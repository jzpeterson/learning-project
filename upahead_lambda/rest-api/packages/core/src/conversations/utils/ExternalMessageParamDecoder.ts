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

        const internalPhoneNumber: string = params.get('To') || "";
        if (!internalPhoneNumber) {
            throw new Error("Missing required 'To' phone number parameter");
        }

        const externalPhoneNumber: string = params.get('From') || "";
        if (!externalPhoneNumber) {
            throw new Error("Missing required 'From' phone number parameter");
        }

        const messageSid: string = params.get('MessageSid') || "";
        if (!messageSid) {
            throw new Error("Missing required 'MessageSid' parameter");
        }

        const returnValue: ExternalMessageParams = {
            internalPhoneNumber: internalPhoneNumber,
            externalPhoneNumber: externalPhoneNumber,
            message: params.get('Body'),
            mediaContentType: params.get('MediaContentType0'),
            numMedia: params.get('NumMedia'),
            mediaUrl: params.get('MediaUrl0'),
            messageSid: messageSid,
        };
        console.log("Decoded Event Body", decodedEvent);
        console.log("Returning params", returnValue);
        return returnValue;
    }
}

