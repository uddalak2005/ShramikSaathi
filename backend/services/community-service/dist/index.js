import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const PORT = process.env.PORT || 3004;
const MONGO_URI = process.env.MONGODB_URI;
try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongoDB...");
}
catch (err) {
    const error = err;
    console.error(error);
}
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}`);
});
