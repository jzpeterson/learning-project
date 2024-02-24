import {describe, expect, it, vi} from "vitest";
import {handler} from "../src/twilioWebhook";
import * as conversationManager from "@rest-api/core/conversations/conversationManager";
import {simpleTextTwilioWebhookEventApple} from "./resources/twilioWebhookEvents/devices/apple/basic_text_message_webhook_event_APPLE";


vi.mock('@rest-api/core/conversations/conversationManager', () => ({
    handleIncomingMessage: vi.fn(),
}));
describe('Twilio handler function', () => {
    it('should return a 200 status code with a basic mock event', async () => {
        // Given
        const messageResponse = 'First Message';
        conversationManager.handleIncomingMessage.mockResolvedValueOnce(messageResponse);

        const mockEvent = {
            body: Buffer.from('Your message here').toString('base64'),
        };

        // When
        const response = await handler(mockEvent);


        // Then
        expect(response.statusCode).toBe(200);
        expect(response.headers).toEqual({"Content-Type": "text/xml"});
        expect(response.body).toContain(messageResponse);
    });

    it('should return a 200 status code using a realistic twilio text message event', async () => {
        // Given
        const messageResponse = 'First Message';
        conversationManager.handleIncomingMessage.mockResolvedValueOnce(messageResponse);

        // When
        const response = await handler(simpleTextTwilioWebhookEventApple);

        // Then
        expect(response.statusCode).toBe(200);
        expect(response.headers).toEqual({"Content-Type": "text/xml"});
        expect(response.body).toContain(messageResponse);
    });
});
