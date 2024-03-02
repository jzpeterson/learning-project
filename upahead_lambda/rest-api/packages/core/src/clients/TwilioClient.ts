import twilio, { Twilio } from 'twilio';
import { Config } from "sst/node/config";

export class TwilioClient {
    client: Twilio;

    constructor() {
        const accountSid: string = Config.TWILIO_ACCOUNT_SID;
        const authToken: string = Config.TWILIO_AUTH_TOKEN;
        this.client = twilio(accountSid, authToken);
    }

    public async sendTwilioMessage(
        body: string,
        from: string,
        to: string
    ): Promise<any> {
        console.log("Sending message to", to, "from", from, "with body", body);
        try {
            return await this.client.messages.create({ body, from, to });
        } catch (error) {
            console.error(error);
            // Depending on your error handling strategy, you might want to re-throw the error or handle it differently
            throw error;
        }
    }
}