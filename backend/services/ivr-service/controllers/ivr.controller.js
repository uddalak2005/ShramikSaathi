import twilio from "twilio";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import path from 'path';
import { fileURLToPath } from 'url';
import client from "../utils/redisClient.util.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { twiml } = twilio;

class IvrController {

    constructor() {
        this.job = null;
        this.workerId = "";
        this.accountSid = process.env.TWILIO_ACCOUNT_SID;
        this.authToken = process.env.TWILIO_AUTH_TOKEN;
        this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        this.client = twilio(this.accountSid, this.authToken);
        this.makeCall = this.makeCall.bind(this);
        this.outGoingIVR = this.outGoingIVR.bind(this);
        this.jobDescription = this.jobDescription.bind(this);
        this.saveInterest = this.saveInterest.bind(this);
        this.biddingOrHangUp = this.biddingOrHangUp.bind(this);
        this.saveBid = this.saveBid.bind(this);
        this.constructJobSMS = this.constructJobSMS.bind(this);
    }

    async constructJobSMS(payload) {
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

        return json.responseList[0].outString; // ✅ Bengali translation
    }


    async textToSpeechAndPlay(session) {
        try {
            // Step 1: Construct the SMS text
            const text = await this.constructJobSMS(session);
            console.log('Generated Text:', text);

            // Step 2: Call Reverie TTS API (using docu`mented endpoint and headers)
            const apiKey = process.env.REVERIE_API_KEY;
            const appId = process.env.REVERIE_APP_ID;
            const ttsUrl = 'https://revapi.reverieinc.com/';
            const speaker = 'bn_female'; // You can make this dynamic based on language

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



    async makeCall(req, res) {
        console.log("making call");
        try {
            const { phone } = req.body;
            const { payload } = req.body;

            console.log(payload);


            // if (!this.twilioPhoneNumber) {
            //     throw new Error("Twilio phone number not set. Check TWILIO_PHONE_NUMBER env.");
            // }

            const client = twilio(this.accountSid, this.authToken);

            const call = await client.calls.create({
                from: "+18149149380",
                to: phone,
                url: `${process.env.BASE_URL}/ivr/intro`,
            });

            console.log(call.sid);

            console.log(payload);

            this.job = payload;

            return res.status(200).json(call);

        } catch (err) {
            console.error(err.message)
            return res.status(500).json({
                message: err.message,
            })
        }
    }



    //Webhook for outgoing ivr
    async outGoingIVR(req, res) {
        console.log("outgoing IVR");
        const twimlResponse = new twiml.VoiceResponse();
        console.log("Job : ", this.job);

        try {
            const callSid = req.body.CallSid;

            console.log(callSid);

            let session = await client.hset(
                callSid,
                {
                    id: this.job.id,
                    jobId: this.job.jobId,
                    name: this.job.name,
                    phone: this.job.phone,
                    email: this.job.email,
                    locationLat: this.job.location.coordinates[0],
                    locationLong: this.job.location.coordinates[1],
                    job: this.job.job,
                    jobDescription: this.job.jobDescription,
                    salary: this.job.salary,
                    lang: "bn-IN"
                }
            )

            console.log("session:", session);

            twimlResponse.play(`${process.env.BASE_URL}/audio/bn-IN/1_welcome_and_lang_select.wav`)

            twimlResponse.redirect(`${process.env.BASE_URL}/ivr/jobDescription`);

            res.type('text/xml');
            res.send(twimlResponse.toString());

        } catch (err) {
            console.error(err.message);
            twimlResponse.say("Sorry an application error has occurred");
            return res.status(400).json({
                message: err.message,
            })
        }
    }

    //After Intro Control will come here
    async jobDescription(req, res) {
        console.log("Play Job Description");
        const twimlResponse = new twiml.VoiceResponse();

        try {
            const digit = "2";
            const callSid = req.body.CallSid;
            const session = await client.hgetall(callSid);

            console.log(session);
            console.log(digit, " ", callSid);

            const langMap = {
                "1": "hi-IN",
                "2": "bn-IN",
                "3": "te-IN",
                "4": "en-IN",
            };

            if (digit && langMap[digit]) {
                const lang = langMap[digit];
                await client.hset(callSid, { lang }); //Redis Update

                // Play static job description audio
                twimlResponse.play(`${process.env.BASE_URL}/audio/${lang}/2_job_description.wav`);

                const ttsAudioPath = await this.textToSpeechAndPlay(session); // returns path to temp audio file
                if (ttsAudioPath) {
                    const audioUrl = `${process.env.BASE_URL}/audio/${path.basename(ttsAudioPath)}`;
                    twimlResponse.play(audioUrl);
                }

                twimlResponse.play(`${process.env.BASE_URL}/audio/${lang}/3_confirm_interest.wav`);

                //To record the name of the farmer
                const gather = twimlResponse.gather({
                    input: 'dtmf',
                    numDigits: 1,
                    action: `${process.env.BASE_URL}/ivr/saveInterest`,
                    method: 'POST',
                    timeout: 5
                });

                res.type('text/xml');
                res.send(twimlResponse.toString());

            } else {
                twimlResponse.redirect(`${process.env.BASE_URL}/ivr/intro`);
                return res.type('text/xml').send(twimlResponse.toString());
            }

        } catch (err) {
            console.error(err.message);
            twimlResponse.say("Sorry an application error has occurred");
            return res.status(400).json({
                message: err.message,
            });
        }
    }

    //Save name
    async saveInterest(req, res) {

        console.log("Save Interest");

        const twimlResponse = new twiml.VoiceResponse();

        try {
            const callSid = req.body.CallSid;
            let session = await client.hgetall(callSid);
            const decision = req.body.Digits;

            console.log(session);

            //Get Call Language
            const lang = await client.hget(callSid, "lang");
            console.log("language from saveName : ", lang);


            if (decision === "1") {

                twimlResponse.play(`${process.env.BASE_URL}/audio/${lang}/4_job_accepted.wav`);
                twimlResponse.hangup();

                //function to update
                const bidsCollection = mongoose.connection.collection("bids");

                console.log(session.id);

                const newBid = await bidsCollection.insertOne({
                    jobId: new mongoose.Types.ObjectId(session.jobId),
                    offeredWage: session.salary,
                    workerId: new mongoose.Types.ObjectId(session.id),
                    status: "accepted",
                    pastBids: [
                        {
                            bidType: "worker",
                            offeredWage: session.salary
                        },
                    ]
                });

                console.log("new bid", newBid);

            }
            else if (decision === "2") {
                twimlResponse.play(`${process.env.BASE_URL}/audio/${lang}/5_ask_to_bid.wav`);

                const gather = twimlResponse.gather({
                    input: 'dtmf',
                    numDigits: 5,
                    action: `${process.env.BASE_URL}/ivr/bidding`,
                    method: 'POST',
                    timeout: 5
                });

                res.type('text/xml');
                res.send(twimlResponse.toString());

            }
            twimlResponse.redirect(`${process.env.BASE_URL}/ivr/intro`);
            return res.type('text/xml').send(twimlResponse.toString());

        } catch (err) {
            console.error(err.message);
            const errorTwiml = new twiml.VoiceResponse();
            errorTwiml.say("Sorry an application error has occurred");
            return res.type('text/xml').send(errorTwiml.toString());
        }
    }

    //To save Pincode and get GeoLocation Latitude and Longitude
    async biddingOrHangUp(req, res) {
        console.log("bidding");
        const twimlResponse = new twiml.VoiceResponse();

        try {
            const callSid = req.body.CallSid;
            const decision = req.body.Digits;

            const session = await client.hgetall(callSid);
            const lang = await client.hget(callSid, "lang");

            if (decision === "1") {

                twimlResponse.play(`${process.env.BASE_URL}/audio/${lang}/6_enter_bid_amount.wav`);

                const gather = twimlResponse.gather({
                    input: 'dtmf',
                    numDigits: 5,
                    action: `${process.env.BASE_URL}/ivr/saveBid`,
                    method: 'POST',
                    timeout: 10
                });

                res.type('text/xml');
                res.send(twimlResponse.toString());

            }
            else if (decision === "2") {
                twimlResponse.play(`${process.env.BASE_URL}/audio/${lang}/8_cancel_confirmation.wav`);
                twimlResponse.hangup();

            } else {
                twimlResponse.redirect(`${process.env.BASE_URL}/ivr/intro`);
                return res.type('text/xml').send(twimlResponse.toString());
            }


        } catch (err) {
            console.error(err.message);
            const errorTwiml = new twiml.VoiceResponse();
            errorTwiml.say("Sorry an application error has occurred");
            return res.type('text/xml').send(errorTwiml.toString());
        }
    }

    // Handle bid input
    async saveBid(req, res) {
        console.log("saveLandArea");
        const twimlResponse = new twiml.VoiceResponse();

        try {
            const callSid = req.body.CallSid;
            const bidAmount = req.body.Digits;
            const session = await client.hgetall(callSid);
            const lang = session?.lang;

            console.log("Bid Amount:", bidAmount);


            const bidsCollection = mongoose.connection.collection("bids"); // no "s"

            console.log(session.id, session.jobId);

            const newBid = await bidsCollection.insertOne({
                jobId: new mongoose.Types.ObjectId(session.jobId),
                offeredWage: session.salary,
                workerId: new mongoose.Types.ObjectId(session.id),
                status: "accepted",
                pastBids: [
                    {
                        bidType: "worker",
                        offeredWage: parseInt(bidAmount)
                    }
                ]
            });

            console.log("new bid", newBid);

            twimlResponse.play(`${process.env.BASE_URL}/audio/${lang}/7_bid_confirmation.wav`);

            return res.type('text/xml').send(twimlResponse.toString());



        } catch (err) {
            console.error(err.message);
            twimlResponse.say("Sorry an application error has occurred");
            return res.status(500).json({
                message: err.message
            })
        }
    }


}

export default IvrController;
