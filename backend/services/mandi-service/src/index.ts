import app from "./app.ts";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const PORT:string | number= process.env.PORT || 3002;
const MONGO_URI:string= process.env.MONGO_URI as string;

if(!MONGO_URI){
    console.error("MongoDB URI is missing");
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    }).catch((err) => {
    console.error(err);
})

app.listen(PORT, () => {
    console.log(`app is listening at port ${PORT}`);
});