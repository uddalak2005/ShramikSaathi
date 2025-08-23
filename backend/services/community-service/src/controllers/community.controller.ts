import Community from "../models/community.model.ts";
import type {Request, Response} from "express";
import mongoose from "mongoose";
import type {Document, Collection} from "mongoose";

interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    password: string;
    aadhar?: string;
    role: "worker" | "employer" | "NGO";
    location: {
        type: "Point";
        coordinates: [number, number]; // [lng, lat]
    };
    address?: string;
    communityId : mongoose.Types.ObjectId;
    rating: number;
}

class CommunityController {

    public async getCommunity(req: Request, res: Response): Promise<Response> {

        try{
            const userID = new mongoose.Types.ObjectId(req.user?.id);

            const userCollection : Collection<IUser> = mongoose.connection.collection("users");

            await userCollection.createIndex({ location: "2dsphere" });

            const user = await userCollection.findOne({_id : userID});

            if (!user) {
                res.status(404).send("User does not exist");
            }

            const userLocation  = user?.location;

            const [lng, lat] = user?.location.coordinates as [number, number];

            // Find communities near user within 20 km
            const nearbyCommunities = await Community.findOne({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [lng, lat] },
                        $maxDistance: 20000,
                    },
                },
            });

            if (!nearbyCommunities) {
                res.status(404).send("No nearby communities found.");
            }

            return res.status(200).json({
                nearbyCommunities,
            })

        }catch(err){
            const error = err as Error;
            console.error(error);
            return res.status(500).json({
                error : error.message
            })
        }
    }

    public async createCommunity(req: Request, res: Response): Promise<Response> {
        try{
            const user = req.user;

            if(req.user?.role !== "NGO"){
                return res.status(401).send("Unauthorized");
            }

            const {title} = req.body;

            const userCollection : Collection<IUser> = mongoose.connection.collection("users");

            await userCollection.createIndex({ location: "2dsphere" });

            const userFound = await userCollection.findOne({_id : new mongoose.Types.ObjectId(user?.id )});


            const newCommunity = await Community.create({
                title : title,
                admin : user?.id,
                location : {
                    type : "Point",
                    coordinates : [userFound?.location.coordinates[0], userFound?.location.coordinates[1]],
                },
            });

            return res.status(201).json({
                newCommunity,
            })
        }catch(err){
            const error = err as Error;
            console.error(error.message);
            return res.status(500).json({
                error : error.message
            })
        }
    }
}

export default new CommunityController();