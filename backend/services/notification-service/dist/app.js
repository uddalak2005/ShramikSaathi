import express from 'express';
import cors from 'cors';
import NotificationController from "./controller/notification.controller.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const { twiml } = twilio;

const app = express();
app.use(cors({
    origin: "*",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
await NotificationController.notificationConsumerForJobAlert();
app.get("/", (req, res) => {
    res.send("notification service");
});
app.post("/sendEmail", async (req, res) => {
    try {
        const { metrics, worker_profile } = req.body;

        if (!metrics || !worker_profile) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        console.log(metrics, worker_profile);

        // ✅ Configure transporter
        const transporter = nodemailer.createTransport({
            service: "gmail", // or "smtp.bank.com"
            auth: {
                user: process.env.ALERT_EMAIL,
                pass: process.env.ALERT_PASS,
            },
        });

        const subject = `Loan Request for Worker ID: ${worker_profile.worker_id}`;
        const body = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
        padding: 20px;
      }
      .container {
        max-width: 650px;
        margin: auto;
        background: #fff;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0px 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        border-bottom: 2px solid #007bff;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .header h1 {
        color: #007bff;
        margin: 0;
      }
      .section-title {
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 8px;
        color: #007bff;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      table, th, td {
        border: 1px solid #ddd;
      }
      th, td {
        text-align: left;
        padding: 8px;
      }
      th {
        background: #f1f1f1;
      }
      .footer {
        margin-top: 30px;
        border-top: 1px solid #ddd;
        padding-top: 15px;
        font-size: 0.9em;
        color: #555;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>ShramikSaathi</h1>
        <p>Migrant Worker Support Platform</p>
      </div>

      <p>Dear Bank Manager,</p>

      <p>
        We at <strong>ShramikSaathi</strong> are submitting a loan request on behalf of 
        <strong>Worker ID: ${worker_profile.worker_id}</strong>.  
        Please find below the worker’s verified performance and financial details from our system:
      </p>

      <div class="section-title">📊 Worker Metrics</div>
      <table>
        <tr><th>MAE</th><td>${metrics.mae}</td></tr>
        <tr><th>MAPE</th><td>${metrics.mape}%</td></tr>
      </table>

      <div class="section-title">👤 Worker Profile</div>
      <table>
        <tr><th>Average Daily Earning</th><td>₹${worker_profile.average_daily_earning.toFixed(2)}</td></tr>
        <tr><th>Estimated Monthly Earning</th><td>₹${worker_profile.estimated_monthly_earning.toFixed(2)}</td></tr>
        <tr><th>Average Feedback Score</th><td>${worker_profile.average_feedback_score}</td></tr>
        <tr><th>Earning Stability</th><td>${(worker_profile.earning_stability * 100).toFixed(1)}%</td></tr>
        <tr><th>Work Index</th><td>${(worker_profile.work_index * 100).toFixed(1)}%</td></tr>
      </table>

      <div class="section-title">📌 Job Distribution</div>
      <table>
        <tr><th>Major Jobs</th><td>${worker_profile.job_distribution.Major}%</td></tr>
        <tr><th>Secondary Jobs</th><td>${worker_profile.job_distribution.Secondary}%</td></tr>
        <tr><th>No Job</th><td>${worker_profile.job_distribution["No Job"]}%</td></tr>
      </table>

      <p>
        Based on these metrics, we believe this worker demonstrates sufficient earning 
        consistency and repayment ability.  
        We kindly request your consideration in approving a loan facility for the above worker.
      </p>

      <div class="footer">
        <p>Warm regards,</p>
        <p><strong>Team ShramikSaathi</strong><br/>Migrant Worker Support Platform</p>
      </div>
    </div>
  </body>
</html>
`;


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: [
                "mukhopadhyayuddalak2005@gmail.com",
                "souherdyasarkar@gmail.com"
            ],
            subject,
            html: body,
        };

        await transporter.sendMail(mailOptions);

        console.log(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        const call = await client.calls.create({
            from: "+18149149380",
            to: "+919531670207",
            url: `${process.env.BASE_URL}/ivr/intro?worker_id=${worker_profile.worker_id}&salary=${worker_profile.estimated_monthly_earning}&score=${worker_profile.average_feedback_score}`,
        });

        console.log(call.sid);



        res.status(200).json({ message: "Loan request email sent successfully" });
    } catch (error) {
        console.error("❌ Email send failed:", error);
        res.status(500).json({ error: "Failed to send loan request email" });
    }
}
);


app.post("/ivr/intro", async (req, res) => {
    console.log("📢 Playing Loan Details...");
    const response = new twiml.VoiceResponse();

    try {
        const { worker_id, salary, score } = req.query;

        // Build session payload
        const payload = {
            worker_id,
            salary: Number(salary),
            score: Number(score),
        };

        // 🔊 Generate audio file with translation + TTS
        const audioFilePath = await textToSpeechAndPlay(payload);

        // Serve audio file publicly via BASE_URL
        const audioFileUrl = `${process.env.BASE_URL}/audio/${path.basename(audioFilePath)}`;
        console.log("🎶 Audio URL:", audioFileUrl);

        // Twilio <Play> the audio only
        response.play(audioFileUrl);

        // End the call after playing
        response.hangup();

        res.type("text/xml");
        res.send(response.toString());
    } catch (err) {
        console.error("❌ Error in loan details IVR:", err.message);
        response.say("Sorry, we are unable to fetch loan details now.");
        response.hangup();
        res.type("text/xml");
        res.send(response.toString());
    }
});



async function constructJobSMS(payload) {
    const loanMessage = `Worker ${payload.worker_id}, your estimated monthly earning is ₹${payload.salary.toFixed(
        0
    )} with a feedback score of ${payload.score}. Eligible for loan consideration and had been fowarded to bank.`;




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

    return json.responseList[0].outString; // ✅ Bengali translation
}


async function textToSpeechAndPlay(session) {
    try {
        // Step 1: Construct the SMS text
        const text = await constructJobSMS(session);
        console.log('Generated Text:', text);

        // Step 2: Call Reverie TTS API (using docu`mented endpoint and headers)
        const apiKey = process.env.REVERIE_API_KEY;
        const appId = process.env.REVERIE_APP_ID;
        const ttsUrl = 'https://revapi.reverieinc.com/';
        const speaker = 'bn_female'; // You can make this dynamic based on language

        console.log(apiKey, appId)

        const response = await axios.post(ttsUrl, {
            text: text
        }, {
            headers: {
                'REV-API-KEY': apiKey,
                'REV-APP-ID': appId,
                'REV-APPNAME': 'tts',
                'speaker': speaker,
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer'
        });

        // Step 3: Save the audio file temporarily in public/audio
        const publicAudioDir = path.resolve(__dirname, '..', 'public', 'audio');
        if (!fs.existsSync(publicAudioDir)) {
            fs.mkdirSync(publicAudioDir, { recursive: true });
        }
        const tempFilePath = path.join(publicAudioDir, `temp_audio_${Date.now()}.wav`);
        fs.writeFileSync(tempFilePath, response.data);
        console.log('Audio file saved:', tempFilePath);

        // Optionally, return the path for further use
        return tempFilePath;

    } catch (error) {
        console.error('Error in TTS process:', error.message);
        if (error.response) {
            console.error('API Error:', error.response.data);
        }
    }
}

export default app;
