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
            } catch (alertError) {
                console.error("Failed to send to ALERT_QUEUE:", alertError.message);
            }

            // Send to IVR_QUEUE
            try {
                await channel.assertQueue(IVR_QUEUE, { durable: true });
                const message = JSON.stringify(worker);
                channel.sendToQueue(IVR_QUEUE, Buffer.from(message), { persistent: true });
                console.log("Message sent to IVR_QUEUE");
            } catch (ivrError) {
                console.error("Failed to send to IVR_QUEUE:", ivrError.message);
            }

            await channel.close();
            await connection.close();
        } catch (err) {
            console.error("Connection error:", err.message);
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
                return res.status(400).send(error.details.map((d) => d.message).join(", "));
            }

            const user = req.user;
            let type;
            if (user.role === "employer") {
                type = "Petty";
            } else if (user.role === "NGO") {
                type = "NGO";
            }

            const newJob = await Job.create({
                ...value,
                employerId: user.id,
                type
            });

            // REMOVE mongoose.connect() - use existing connection
            const userCollection = mongoose.connection.collection("users");

            const workersNearby = await userCollection.find({
                role: "worker",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: value.location.coordinates,
                        },
                        $maxDistance: 5000,
                    },
                },
            }).toArray();

            console.log("Found workers nearby:", workersNearby.length);

            // Publish to queue for each worker
            for (const worker of workersNearby) {
                const payload = {
                    id: worker._id.toString(), // Use _id instead of id
                    jobId: newJob._id,
                    name: worker.name,
                    phone: worker.phone,
                    email: worker.email,
                    location: worker.location, // Use the actual location object
                    job: value.title,
                    jobDescription: value.description,
                    salary: value.salary || value.offeredWage || value.suggestedWage,
                };
                console.log("Publishing notification for worker:", worker._id);
                await this.publishJobNotification(payload);
            }

            return res.status(201).send(newJob);
        } catch (err) {
            console.error("Error in createJob:", err.message);
            return res.status(400).json({
                error: err.message
            });
        }
    }
    async getNearbyJobs(req, res) {
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
                            coordinates: [parseFloat(long), parseFloat(lat)],
                        },
                        $maxDistance: 5000, // 5 km in meters
                    },
                },
                status: "open",
                type // only open jobs
            });
            return res.json(jobs);
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
}
export default new JobsController();
