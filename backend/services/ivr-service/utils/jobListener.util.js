import amqp from "amqplib";
import mongoose from "mongoose";
import axios from "axios";


export async function jobListener() {
    const RABBIT_URL = process.env.RABBIT_URL;
    const ALERT_QUEUE = "ivr.newJobAlert";

    try {
        const connection = await amqp.connect(RABBIT_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(ALERT_QUEUE, { durable: true });
        await channel.prefetch(1);

        console.log("Listening for job alerts...");

        channel.consume(
            ALERT_QUEUE,
            async (message) => {
                if (!message) return;

                try {
                    const payload = JSON.parse(
                        message.content.toString()
                    );
                    console.log("Received payload:", payload);

                    const userCollection = mongoose.connection.collection("users");

                    // ensure index exists
                    await userCollection.createIndex({ location: "2dsphere" });

                    const workersNearby = await userCollection.find({
                        role: "worker",
                        location: {
                            $near: {
                                $geometry: {
                                    type: "Point",
                                    coordinates: payload.location.coordinates, // [lng, lat]
                                },
                                $maxDistance: 5000, // 5 km
                            },
                        },
                    }).toArray(); // <-- need toArray() to actually get results

                    if (workersNearby && workersNearby.length) {
                        const worker = workersNearby[0];
                        try{
                            await axios.post(`${process.env.BASE_URL}/ivr/makeCall`,{
                                phone : worker.phone,
                                payload
                            })
                        }catch(err){
                            console.error(err);
                        }

                    }

                    channel.ack(message);
                } catch (err) {
                    console.error("Error processing message:", err);
                    channel.nack(message, false, false);
                }
            },
            { noAck: false }
        );
    } catch (err) {
        console.error("RabbitMQ consumer error:", err);
    }
}
