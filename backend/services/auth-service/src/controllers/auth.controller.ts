import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import joi from 'joi';
import User from '../models/user.model.ts';
import type { IUser } from "../models/user.model.ts";
import crypto from "node:crypto";
import bcrypt from "bcrypt";
import mongoose, { type Collection, type Document } from "mongoose";

export interface CommunityDocument extends Document {
    title: string;
    admin: mongoose.Types.ObjectId;
    location: {
        type: string;
        coordinates: [number, number];
    }
}

class AuthController {
    private registrationSchema: joi.ObjectSchema<any>;
    private loginSchema: joi.ObjectSchema<any>;

    constructor() {
        this.registrationSchema = joi.object({
            email: joi.string().email(),
            phone: joi.string().required(),
            password: joi.string().min(6).required(),
            name: joi.string().min(8).required(),
            aadhar: joi.string().min(8).allow("", null).optional(),
            role: joi.string().allow("").optional(),
            location: joi.object({
                locationLat: joi.number().min(8).required(),
                locationLong: joi.number().min(8).required(),
            }),
            address: joi.string(),
        });

        this.loginSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(6).required(),
        })

        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const { error, value } = this.registrationSchema.validate(req.body);

            if (error) {
                console.error(error.details[0].message);
                return res.status(400).send({ error: error.details[0].message });
            }

            const userExists = await User.findOne({ email: value.email });
            if (userExists) {
                console.error("user already exists");
                return res.status(400).json({
                    message: "user already exists"
                });
            }

            // Hash password
            const sha256Hash: string = crypto
                .createHash("sha256")
                .update(value.password)
                .digest("hex");

            const hashedPassword: string = await bcrypt.hash(sha256Hash, 10);
            value.password = hashedPassword;

            const userPayload = {
                ...value,
                location: {
                    type: "Point",
                    coordinates: [
                        value.location.locationLong, // longitude first
                        value.location.locationLat,  // latitude second
                    ],
                },
            };

            const user = new User(userPayload);


            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined in environment variables");
            }

            const communityCollection: Collection<CommunityDocument> = mongoose.connection.collection("communities");

            await communityCollection.createIndex({ location: "2dsphere" });


            // Find communities near user within 20 km
            const nearbyCommunity = await communityCollection.findOne({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [value.location.locationLong, value.location.locationLat] },
                        $maxDistance: 20000,
                    },
                },
            });

            user.communityId = new mongoose.Types.ObjectId(nearbyCommunity?._id);

            const createdUser: IUser = await user.save();

            const token = jwt.sign(
                {
                    id: createdUser._id.toString(),
                    email: createdUser.email,
                    role: createdUser.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(201).json({
                message: "user created successfully",
                token,
                createdUser
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                error: (err as Error).message,
            });
        }
    }


    public async login(req: Request, res: Response): Promise<Response> {
        try {
            console.log(req.body);
            const { error, value } = this.loginSchema.validate(req.body);

            if (error) {
                console.error(error.details[0].message);
                return res.status(400).json({
                    error: error.details[0].message
                })
            }

            const userExist = await User.findOne({ email: value.email });
            if (!userExist) {
                console.error("user doesn't exists");
                return res.status(400).json({
                    error: "user doesn't exists"
                })
            }

            const sha256Hash: string = crypto
                .createHash("sha256")
                .update(value.password)
                .digest("hex");

            const confirmPassword = await bcrypt.compare(sha256Hash, userExist.password);

            if (!confirmPassword) {
                console.error("Wrong password");
                return res.status(400).json({
                    error: "password doesn't match"
                })
            }

            const token = jwt.sign({
                id: userExist._id,
                email: userExist.email,
                role: userExist.role
            },
                process.env.JWT_SECRET as string,
                { expiresIn: "7d" });

            return res.status(200).json({
                message: "user login successfully",
                token,
                userExist
            })

        } catch (err: unknown) {
            console.error(err);
            const error = err as Error;
            return res.status(500).json({
                error: error.message
            })
        }
    }

    public async getUser(req: Request, res: Response): Promise<Response> {
        try {
            const id = req.params.id;
            const user = await User.findById(id);
            if (!user) {
                console.error("user doesn't exists");
                return res.status(400).json({
                    error: "user doesn't exists"
                })
            }

            return res.status(200).json({
                user
            })
        } catch (err: unknown) {
            const error = err as Error;
            console.error(error.message);
            return res.status(500).json({
                error: error.message
            })
        }
    }
}

export default new AuthController();