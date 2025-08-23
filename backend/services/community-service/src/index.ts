import app from "./app.ts";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 3004;
const MONGO_URI = process.env.MONGODB_URI as string;

try{

    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("connected to mongoDB...");

}catch(err){
    const error = err as Error;
    console.error(error);
}

app.listen(PORT as number, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}`);
})