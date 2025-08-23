import twilio from "twilio";

export default async function sendSMS(to: string, message: string) {

    const client = twilio(
        process.env.TWILIO_ACCOUNT_SID as string,
        process.env.TWILIO_AUTH_TOKEN as string
    );

    try {

        console.log("Twilio SID:", process.env.TWILIO_ACCOUNT_SID);
        console.log("Twilio Auth Token:", process.env.TWILIO_AUTH_TOKEN);
        console.log("Twilio Phone:", process.env.TWILIO_PHONE);


        const response = await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE as string,
            to,
        });

        console.log("✅ SMS sent:", response.sid);
        return response;
    } catch (error: any) {
        console.error("❌ SMS failed:", error.message);
        throw new Error(error.message);
    }
}
