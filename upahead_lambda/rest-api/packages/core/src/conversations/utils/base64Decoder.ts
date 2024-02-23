export async function decodeBase64String(base64String: string): Promise<string> {
    return Buffer.from(base64String, "base64").toString("utf-8");
}

export async function decodeEventBody(event: any): Promise<any> {
    return await decodeBase64String(event.body);
}

export async function getParams(event: any): Promise<any> {
    const decodedEvent = await decodeEventBody(event);

    const params = new URLSearchParams(decodedEvent);

    const recipientPhoneNumber = params.get('To');
    const accountPhoneNumber = params.get('From');
    const message = params.get('Body');
    const returnValue = {
        recipientPhoneNumber: recipientPhoneNumber,
        accountPhoneNumber: accountPhoneNumber,
        message: message,
    };
    console.log("Returning params", returnValue)
    return returnValue;
}