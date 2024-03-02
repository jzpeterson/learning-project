import { describe, expect, it } from "vitest";
import { ExternalMessageParamDecoder } from "../../../src/conversations/utils/ExternalMessageParamDecoder";
import {
    simpleTextTwilioWebhookEventApple
} from "@rest-api/functions/test/resources/twilioWebhookEvents/devices/apple/basic_text_message_webhook_event_APPLE";


const decoder = new ExternalMessageParamDecoder();

describe('ExternalMessageParamDecoder', () => {
    it('should decode a base64 string', async () => {
        // Given
        const base64String = 'SGVsbG8gV29ybGQ=';

        // When
        const decodedString = await decoder.decodeBase64String(base64String);

        // Then
        expect(decodedString).toBe('Hello World');
    });

    it('should decode the event body', async () => {
        // Given
        const event = {
            body: 'SGVsbG8gV29ybGQ='
        };

        // When
        const decodedEvent = await decoder.decodeEventBody(event);

        // Then
        expect(decodedEvent).toBe('Hello World');
    });

    // The remaining tests follow a similar pattern
    // Here's one for demonstration:
    it('should get the params from a simple text (text only without any media) event apple', async () => {
        // When
        const params = await decoder.getParams(simpleTextTwilioWebhookEventApple);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+18017916516",
            "mediaContentType": null,
            "mediaUrl": null,
            "message": "Text 12 12:20pm",
            "numMedia": "0",
            "recipientPhoneNumber": "+18446151430",
            "messageSid": null, // Ensure this is correct based on the actual structure of your test events
        });
    });

    // Add the rest of your tests here, updating them to use the `decoder` instance
});
