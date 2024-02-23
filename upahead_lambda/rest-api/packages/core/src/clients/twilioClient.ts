import twilio from 'twilio';
import {Config} from "sst/node/config";

const accountSid: string = Config.TWILIO_ACCOUNT_SID;
const authToken: string = Config.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function sendTwilioMessage(
    body: string,
    from: string,
    to: string
): Promise<any> {

    console.log("Sending message to", to, "from", from, "with body", body)
    try {
        return await client.messages
            .create({body, from, to});
    } catch (error) {
        return console.error(error);
    }
}

// Example usage
// const response = await sendTwilioMessage(
//     'Hello from Twilio',
//     '+18446151430',
//     '+18017916516'
// );
// console.log(response);