import Community from "../models/community.model.js";
import mongoose from "mongoose";
class CommunityController {
    async getCommunity(req, res) {
        try {
            const userID = new mongoose.Types.ObjectId(req.user?.id);
            const userCollection = mongoose.connection.collection("users");
            await userCollection.createIndex({ location: "2dsphere" });
            const user = await userCollection.findOne({ _id: userID });
            if (!user) {
                res.status(404).send("User does not exist");
            }
            const userLocation = user?.location;
            const [lng, lat] = user?.location.coordinates;
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
            });
        }
        catch (err) {
            const error = err;
            console.error(error);
            return res.status(500).json({
                error: error.message
            });
        }
    }
    async createCommunity(req, res) {
        try {
            const user = req.user;
            if (req.user?.role !== "NGO") {
                return res.status(401).send("Unauthorized");
            }
            const { title } = req.body;
            const userCollection = mongoose.connection.collection("users");
            await userCollection.createIndex({ location: "2dsphere" });
            const userFound = await userCollection.findOne({ _id: new mongoose.Types.ObjectId(user?.id) });
            const newCommunity = await Community.create({
                title: title,
                admin: user?.id,
                location: {
                    type: "Point",
                    coordinates: [userFound?.location.coordinates[0], userFound?.location.coordinates[1]],
                },
            });
            return res.status(201).json({
                newCommunity,
            });
        }
        catch (err) {
            const error = err;
            console.error(error.message);
            return res.status(500).json({
                error: error.message
            });
        }
    }
}
export default new CommunityController();
