import {describe, expect, it} from "vitest";
import {handler} from "../src/twilioWebhook";
import * as path from "path";
import * as fs from "fs";

describe('Twilio handler function', () => {
    it('should return a 200 status code with a basic mock event', async () => {
        const mockEvent = {
            body: Buffer.from('Your message here').toString('base64'), // Example body, adjust as needed
        };

        const response = await handler(mockEvent);

        expect(response.statusCode).toBe(200);
        expect(response.headers).toEqual({"Content-Type": "text/xml"});
        expect(response.body).toBeTruthy();
    });
    it('should return a 200 status code using a realistic twilio text message event', async () => {
        const jsonPath = path.join(__dirname, 'basic_text_message_webhook_event.json');
        const event = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.headers).toEqual({"Content-Type": "text/xml"});
        expect(response.body).toBeTruthy();
    });
});
