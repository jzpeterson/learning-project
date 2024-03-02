import {ExternalMessageParams} from "./ExternalMessageParams";

export class ExternalMessageParamDecoder {
    public async decodeBase64String(base64String: string): Promise<string> {
        return Buffer.from(base64String, "base64").toString("utf-8");
    }

    public async decodeEventBody(event: any): Promise<any> {
        return await this.decodeBase64String(event.body);
    }

    public async getParams(event: any): Promise<ExternalMessageParams> {
        const decodedEvent = await this.decodeEventBody(event);

        const params = new URLSearchParams(decodedEvent);

        const returnValue = {
            recipientPhoneNumber: params.get('To'),
            accountPhoneNumber: params.get('From'),
            message: params.get('Body'),
            mediaContentType: params.get('MediaContentType0'),
            numMedia: params.get('NumMedia'),
            mediaUrl: params.get('MediaUrl0'),
            messageSid: params.get('MessageSid'),
        };
        console.log("Decoded Event Body", decodedEvent);
        console.log("Returning params", returnValue);
        return returnValue;
    }
}

