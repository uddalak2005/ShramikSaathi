import amqp from "amqplib";
import User from "../models/user.model.js";
export async function updateRating() {
    const REVIEW_QUEUE = "review.update";
    const RABBIT_URL = process.env.RABBIT_URL;
    const connection = await amqp.connect(RABBIT_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(REVIEW_QUEUE);
    await channel.prefetch(1);
    console.log("User service listening to review queue");
    await channel.consume(REVIEW_QUEUE, async (message) => {
        if (message) {
            const review = JSON.parse(message.content.toString());
            console.log("Got Review", review);
            channel.ack(message);
            const workerId = review.workerId;
            const rating = review.rating;
            const user = await User.findOne({ _id: workerId });
            if (!user) {
                console.error("Worker not found");
                return;
            }
            const newRating = (user.rating + rating) / 2;
            user.rating = newRating;
            await user.save();
            console.log("Review updated");
        }
    });
}
