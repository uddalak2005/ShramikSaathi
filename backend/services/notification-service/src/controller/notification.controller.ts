import amqp, { type ConsumeMessage } from "amqplib";
import twilioUtils from "../utils/twilio.util.ts";

interface JobNotificationPayload {
    name: string;
    phone: string;
    email: string;
    location: any; // you can refine later
    job: string;
    jobDescription: string;
    salary: number;
}

export function constructJobSMS(payload: JobNotificationPayload): string {
    return `Hi ${payload.name}, new job: ${payload.job}. Pay Rs ${payload.salary}. Task: ${payload.jobDescription}. Contact: ${payload.phone}`;
}

class NotificationController {
    async notificationConsumerForJobAlert() {
        const RABBIT_URL = process.env.RABBIT_URL as string;
        const ALERT_QUEUE = "notification.newJobAlert";

        try {
            const connection = await amqp.connect(RABBIT_URL);
            const channel = await connection.createChannel();

            await channel.assertQueue(ALERT_QUEUE, { durable: true });
            await channel.prefetch(1);

            console.log("Listening for job alerts...");

            channel.consume(
                ALERT_QUEUE,
                async (message: ConsumeMessage | null) => {
                    if (!message) return;

                    try {
                        const payload: JobNotificationPayload = JSON.parse(
                            message.content.toString()
                        );
                        console.log("Received payload:", payload);

                        const SMS = constructJobSMS(payload);

                        await twilioUtils(payload.phone, SMS);

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
}

export default new NotificationController();
