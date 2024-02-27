import {randomUUID} from "node:crypto";

export async function decodeBase64String(base64String: string): Promise<string> {
    return Buffer.from(base64String, "base64").toString("utf-8");
}

export async function decodeEventBody(event: any): Promise<any> {
    return await decodeBase64String(event.body);
}

export interface MessageParams {
    recipientPhoneNumber: string | null
    accountPhoneNumber: string | null,
    message: string | null,
    mediaContentType: string | null,
    numMedia: string | null,
    mediaUrl: string | null,
    messageSid: string | null
}

export async function getParams(event: any): Promise<MessageParams> {
    const decodedEvent = await decodeEventBody(event);

    const params = new URLSearchParams(decodedEvent);

    const returnValue = {
        recipientPhoneNumber: params.get('To'),
        accountPhoneNumber: params.get('From'),
        message: params.get('Body') ,
        mediaContentType: params.get('MediaContentType0'),
        numMedia: params.get('NumMedia'),
        mediaUrl: params.get('MediaUrl0'),
        messageSid: params.get('MessageSid'),
    };
    console.log("Decoded Event Body", decodedEvent);
    console.log("Returning params", returnValue);
    return returnValue;
}