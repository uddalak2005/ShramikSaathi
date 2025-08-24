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
            "REV-APPNAME": "localization",
            "REV-APPVERSION": "3.0"
        },
        body: JSON.stringify({
            src_lang: "en",
            tgt_lang: "bn",
            domain: "generic",
            data: [englishMessage]
        })
    });
    if (!response.ok) {
        throw new Error(`Reverie API error: ${response.status} ${response.statusText}`);
    }
    const json = (await response.json());
    console.log("Reverie API response:", JSON.stringify(json, null, 2));
    const translation = json.responseList?.[0]?.outString ||
        json.translatedText ||
        null;
    if (!translation) {
        throw new Error("Translation failed: " + JSON.stringify(json));
    }
    return translation;
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
