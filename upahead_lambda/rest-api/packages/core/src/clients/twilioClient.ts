import twilio from 'twilio';

const accountSid: string = process.env.TWILIO_ACCOUNT_SID!;
const authToken: string = process.env.TWILIO_AUTH_TOKEN!;

const client = twilio(accountSid, authToken);

export async function sendTwilioMessage(
    body: string,
    from: string,
    to: string
): Promise<any> {

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