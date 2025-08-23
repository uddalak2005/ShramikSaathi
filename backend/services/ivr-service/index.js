import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { jobListener } from "./utils/jobListener.util.js";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import ivrRoute from "./routes/ivr.route.js";
import path from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

app.use(cors({
    origin: "*",
}))


app.use('/audio', express.static(path.join(__dirname, 'public/audio')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/', (req, res) => {
    res.send('IVR Service is running');
});

app.use("/ivr", ivrRoute);

await jobListener();

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
} catch (err) {
    console.error("Error connecting with with MongoDB");
}

// Start server
app.listen(port, () => {
    console.log(`IVR Service listening at http://localhost:${port}`);
});