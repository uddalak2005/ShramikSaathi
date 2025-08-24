import mongoose from 'mongoose';
const communitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: [Number],
    }
});
const Community = mongoose.model("Community", communitySchema);
export default Community;
