import amqp from "amqplib";
import User from "../models/user.model.js";
export async function updateReward() {
    try {
        const REWARD_QUEUE = "user.reward";
        const RABBIT_URL = process.env.RABBIT_URL;
        const connection = await amqp.connect(RABBIT_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(REWARD_QUEUE);
        await channel.prefetch(1);
        console.log("User service listening to reward queue");
        await channel.consume(REWARD_QUEUE, async (message) => {
            try {
                if (message) {
                    const userInfo = JSON.parse(message.content.toString());
                    console.log("Got user for reward", userInfo);
                    const userId = userInfo.userDetails.userId;
                    const user = await User.findOne({ _id: userId });
                    if (!user) {
                        console.error("Worker not found");
                        return;
                    }
                    if (user.points) {
                        user.points = 0;
                    }
                    else {
                        user.points = Number(user?.points + 5);
                    }
                    await user.save();
                    channel.ack(message);
                    console.log("Review updated");
                }
            }
            catch (err) {
                console.error(err);
                channel.nack(message, false, false);
            }
        }, { noAck: false });
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        return null;
    }
}
