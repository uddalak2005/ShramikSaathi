import amqp from "amqplib";
import twilioUtils from "../utils/twilio.util.js";
export async function constructJobSMS(payload) {
    const englishMessage = `Hi ${payload.name}, new job: ${payload.job}. Pay Rs ${payload.salary}. Task: ${payload.jobDescription}`;

    const response = await fetch("https://revapi.reverieinc.com/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "REV-API-KEY": process.env.REVERIE_API_KEY,
            "REV-APP-ID": process.env.REVERIE_APP_ID,
            "src_lang": "en",
            "tgt_lang": "bn",
            "domain": "generic",
            "REV-APPNAME": "localization",
            "REV-APPVERSION": "3.0"
        },
        body: JSON.stringify({
            data: [englishMessage]
        })
    });

    const json = await response.json();

    if (!json || !json.responseList || !json.responseList[0] || !json.responseList[0].outString) {
        throw new Error("Translation failed: " + JSON.stringify(json));
    }

    return json.responseList[0].outString;
}
class NotificationController {
    async notificationConsumerForJobAlert() {
        const RABBIT_URL = process.env.RABBIT_URL;
        const ALERT_QUEUE = "notification.newJobAlert";
        try {
            const connection = await amqp.connect(RABBIT_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(ALERT_QUEUE, { durable: true });
            await channel.prefetch(1);
            console.log("Listening for job alerts...");
            channel.consume(ALERT_QUEUE, async (message) => {
                if (!message)
                    return;
                try {
                    const payload = JSON.parse(message.content.toString());
                    console.log("Received payload:", payload);
                    // ✅ await constructJobSMS
                    const SMS = await constructJobSMS(payload);
                    await twilioUtils(payload.phone, SMS);
                    channel.ack(message);
                }
                catch (err) {
                    console.error("Error processing message:", err);
                    // nack without requeue (so it won’t loop infinitely)
                    channel.nack(message, false, false);
                }
            }, { noAck: false });
        }
        catch (err) {
            console.error("RabbitMQ consumer error:", err);
        }
    }
}
export default new NotificationController();
