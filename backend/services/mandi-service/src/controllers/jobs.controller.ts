import Job from "../models/job.model.ts";
import Joi from "joi";
import type { JobDocument } from "../models/job.model.ts";
import type { Request, Response } from "express";
import Review from "../models/review.model.ts";
import mongoose from "mongoose";
import amqp from "amqplib";


class JobsController {

    private jobSchema: Joi.ObjectSchema<any>;

    constructor() {

        this.jobSchema = Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),

            skillsRequired: Joi.array().items(Joi.string()).default([]),

            location: Joi.object({
                type: Joi.string().valid("Point").required(),
                coordinates: Joi.array()
                    .items(Joi.number())
                    .length(2) // must be [lng, lat]
                    .required(),
                address: Joi.string().optional(),
            }).required(),

            salary: Joi.number().optional(),
            suggestedWage: Joi.number().optional(),
            offeredWage: Joi.number().optional(),
            duration: Joi.string().optional(),


            status: Joi.string()
                .valid("open", "assigned", "completed", "cancelled")
                .default("open"),

        });

        this.createJob = this.createJob.bind(this);
        this.publishJobNotification = this.publishJobNotification.bind(this);
        this.getNearbyJobs = this.getNearbyJobs.bind(this);
    }

    public async publishJobNotification(worker: {
        id: string;
        name: string;
        phone: string;
        email: string;
        location: {
            locationLat: number;
            locationLong: number;
        };
        job: string;
        jobDescription: string;
        salary: number
    }) {

        const RABBIT_URL = process.env.RABBIT_URL as string;
        const ALERT_QUEUE = "notification.newJobAlert";

        try {

            const connection = await amqp.connect(RABBIT_URL);
            const channel = await connection.createChannel();

            await channel.assertQueue(ALERT_QUEUE, { durable: true });

            const message = JSON.stringify(worker);

            channel.sendToQueue(ALERT_QUEUE, Buffer.from(message), { persistent: true });

            console.log("New Job Added to Queue");

            await channel.close();
            await connection.close();

        } catch (err) {
            const error = err as Error;
            console.error(error.message);
            return error;
        }

    }

    public async createJob(req: Request, res: Response) {
        try {

            if (req.user && req.user.role === "worker") {
                return res.status(401).send("Unauthorized");
            }

            const { error, value } = this.jobSchema.validate(req.body);

            if (error) {
                console.error(error.details[0].message);
                if (error) {
                    return res.status(400).send(error.details.map((d) => d.message).join(", "));
                }
            }

            const user: any = req.user;

            let type;
            if (user.role === "employer") {
                type = "Petty";
            } else if (user.role === "NGO") {
                type = "NGO"
            }

            const newJob = await Job.create({
                ...value,
                employerId: user.id,
                type
            });

            await mongoose.connect(process.env.MONGO_URI as string);

            const userCollection = mongoose.connection.collection("users");

            // ensure index exists
            await userCollection.createIndex({ location: "2dsphere" });

            const workersNearby = await userCollection.find({
                role: "worker",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: value.location.coordinates, // [lng, lat]
                        },
                        $maxDistance: 5000, // 5 km
                    },
                },
            }).toArray(); // <-- need toArray() to actually get results



            console.log(workersNearby);

            for await (let worker of workersNearby) {
                const payload = {
                    id: worker.id,
                    name: worker.name,
                    phone: worker.phone,
                    email: worker.email,
                    location: {
                        locationLat: worker.location.coordinates[0],
                        locationLong: worker.location.coordinates[1],
                    },
                    job: value.title,
                    jobDescription: value.description,
                    salary: value.salary,
                }
                await this.publishJobNotification(payload);
            }

            return res.status(201).send(newJob);

        } catch (err) {
            const error = err as Error;
            console.error(error.message);
            return res.status(400).json({
                error: error.message
            })
        }
    }

    public async getNearbyJobs(req: Request, res: Response) {
        try {
            if (req.user && req.user.role !== "worker") {
                return res.status(401).send("Unauthorized");
            }
            const { long, lat, type } = req.query;

            if (!long || !lat) {
                return res.status(400).send("Longitude and latitude required");
            }

            const jobs = await Job.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(long as string), parseFloat(lat as string)],
                        },
                        $maxDistance: 5000, // 5 km in meters
                    },
                },
                status: "open",
                type// only open jobs
            });

            return res.json(jobs);
        } catch (err: any) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
}

export default new JobsController();