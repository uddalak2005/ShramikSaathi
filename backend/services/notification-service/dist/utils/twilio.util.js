import twilio from "twilio";
export default async function sendSMS(to, message) {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    try {
        console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);
        console.log("Twilio Auth Token:", process.env.TWILIO_AUTH_TOKEN);
        console.log("Twilio Phone:", process.env.TWILIO_PHONE);
        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to,
        });
        console.log("✅ SMS sent:", response.sid);
        return response;
    }
    catch (error) {
        console.error("❌ SMS failed:", error.message);
        throw new Error(error.message);
    }
}
