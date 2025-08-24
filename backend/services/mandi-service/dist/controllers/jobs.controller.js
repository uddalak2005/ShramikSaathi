import Job from "../models/job.model.js";
import Joi from "joi";
import mongoose from "mongoose";
import amqp from "amqplib";
class JobsController {
    jobSchema;
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
    async publishJobNotification(worker) {
        const RABBIT_URL = process.env.RABBIT_URL;
        const ALERT_QUEUE = "notification.newJobAlert";
        const IVR_QUEUE = "ivr.newJobAlert";
        try {
            const connection = await amqp.connect(RABBIT_URL);
            const channel = await connection.createChannel();
            // Send to ALERT_QUEUE
            try {
                await channel.assertQueue(ALERT_QUEUE, { durable: true });
                const message = JSON.stringify(worker);
                channel.sendToQueue(ALERT_QUEUE, Buffer.from(message), { persistent: true });
                console.log("Message sent to ALERT_QUEUE");
            }
            catch (alertError) {
                const error = alertError;
                console.error("Failed to send to ALERT_QUEUE:", error.message);
            }
            // Send to IVR_QUEUE
            try {
                await channel.assertQueue(IVR_QUEUE, { durable: true });
                const message = JSON.stringify(worker);
                channel.sendToQueue(IVR_QUEUE, Buffer.from(message), { persistent: true });
                console.log("Message sent to IVR_QUEUE");
            }
            catch (ivrError) {
                const error = ivrError;
                console.error("Failed to send to IVR_QUEUE:", error.message);
            }
            await channel.close();
            await connection.close();
        }
        catch (err) {
            const error = err;
            console.error("Connection error:", error.message);
            return err;
        }
    }
    async createJob(req, res) {
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
            const user = req.user;
            let type;
            if (user.role === "employer") {
                type = "Petty";
            }
            else if (user.role === "NGO") {
                type = "NGO";
            }
            const newJob = await Job.create({
                ...value,
                employerId: user.id,
                type
            });
            await mongoose.connect(process.env.MONGO_URI);
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
            for (let worker of workersNearby) {
                const payload = {
                    id: worker._id,
                    name: worker.name,
                    jobId: newJob._id,
                    phone: worker.phone,
                    email: worker.email,
                    location: worker.location,
                    job: value.title,
                    jobDescription: value.description,
                    salary: value.salary,
                };
                await this.publishJobNotification(payload);
            }
            return res.status(201).send(newJob);
        }
        catch (err) {
            const error = err;
            console.error(error.message);
            return res.status(400).json({
                error: error.message
            });
        }
    }
    async getNearbyJobs(req, res) {
        try {
            if (req.user && req.user.role !== "worker") {
                return res.status(401).send("Unauthorized");
            }
            // const { long, lat, type } = req.query;
            //
            // if (!long || !lat) {
            //     return res.status(400).send("Longitude and latitude required");
            // }
            //
            // const jobs = await Job.find({
            //     location: {
            //         $near: {
            //             $geometry: {
            //                 type: "Point",
            //                 coordinates: [parseFloat(long as string), parseFloat(lat as string)],
            //             },
            //             $maxDistance: 5000, // 5 km in meters
            //         },
            //     },
            //     status: "open",
            //     type// only open jobs
            // });
            const jobs = await Job.find({});
            return res.json(jobs);
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
}
export default new JobsController();
