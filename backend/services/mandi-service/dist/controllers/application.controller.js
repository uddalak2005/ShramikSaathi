import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import mongoose from "mongoose";
class ApplicationController {
    async applyForJob(req, res) {
        try {
            const { jobId } = req.params;
            const workerId = req.user?.id;
            const job = await Job.findById(jobId);
            if (!job) {
                console.error("Job not found");
                return res.status(400).send("Job not found");
            }
            if (job.type !== "NGO") {
                console.error("You cannot apply for this job. You can only accept or reject this job");
                return res.status(400).send("Job not found");
            }
            if (job.status != "open") {
                return res.status(400).send("Job is closed");
            }
            const existingApp = await Application.findOne({ jobId, workerId });
            if (existingApp)
                return res.status(400).send("Already applied to this job");
            const assignment = await Application.create({
                jobId: job._id,
                workerId: new mongoose.Types.ObjectId(workerId),
                agreedWage: job.offeredWage,
                status: "pending"
            });
            return res.status(200).send(assignment);
        }
        catch (err) {
            console.error(err);
            return res.status(400).send("Job not found");
        }
    }
    async acceptApplication(req, res) {
        try {
            if (req.user?.role !== "NGO") {
                return res.status(401).send("Unauthorized");
            }
            const { assignmentId } = req.body;
            const assignment = await Application.findById(assignmentId);
            if (!assignment)
                return res.status(404).send("Application not found");
            // update assignment + job
            assignment.status = "assigned";
            await assignment.save();
            await Job.findByIdAndUpdate(assignment.jobId, { status: "assigned" });
            // reject all other applications for same job
            await Application.updateMany({ jobId: assignment.jobId, _id: { $ne: assignment._id } }, { $set: { status: "rejected" } });
            return res.json({ message: "Worker assigned", assignment });
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
    /**
     * Employer rejects a worker's application
     */
    async rejectApplication(req, res) {
        try {
            if (req.user?.role !== "NGO") {
                return res.status(401).send("Unauthorized");
            }
            const { assignmentId } = req.body;
            const assignment = await Application.findById(assignmentId);
            if (!assignment)
                return res.status(404).send("Application not found");
            assignment.status = "rejected";
            await assignment.save();
            return res.json({ message: "Application rejected", assignment });
        }
        catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    }
}
export default new ApplicationController();
