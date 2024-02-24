import {describe, expect, it} from "vitest";
import {decodeBase64String, decodeEventBody, getParams} from "../../../src/conversations/utils/base64Decoder";
import {
    simpleTextTwilioWebhookEventApple
} from "@rest-api/functions/test/resources/twilioWebhookEvents/devices/apple/basic_text_message_webhook_event_APPLE";
import {
    singleTenSecondVideoTwilioEventApple
} from "@rest-api/functions/test/resources/twilioWebhookEvents/devices/apple/text_message_with_single_10_second_video_webhook_event_APPLE";

describe('Base64 decoder', () => {
    it('should decode a base64 string', async () => {
        // Given
        const base64String = 'SGVsbG8gV29ybGQ=';

        // When
        const decodedString = await decodeBase64String(base64String);

        // Then
        expect(decodedString).toBe('Hello World');
    });

    it('should decode the event body', async () => {
        // Given
        const event = {
            body: 'SGVsbG8gV29ybGQ='
        };

        // When
        const decodedEvent = await decodeEventBody(event);

        // Then
        expect(decodedEvent).toBe('Hello World');
    })

    it('should get the params from a simple text (text only without any media) event', async () => {
        // When
        const params = await getParams(simpleTextTwilioWebhookEventApple);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+18017916516",
            "mediaContentType": null,
            "mediaUrl": null,
            "message": "Text 12 12:20pm",
            "numMedia": "0",
            "recipientPhoneNumber": "+18446151430",
        });
    });

    it('should get the params from a text with a single video event', async () => {
        // When
        const params = await getParams(singleTenSecondVideoTwilioEventApple);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+18017916516",
            "mediaContentType": "video/3gpp",
            "mediaUrl": "https://api.twilio.com/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/MMf3aec14a0afd453f9b8809032b043ad0/Media/ME4daf2ae187fcf9e29503f1d6b25b78ce",
            "message": "",
            "numMedia": "1",
            "recipientPhoneNumber": "+18446151430",
        });
    });

    it('should get the params from a text with a single image event', async () => {
        // When
        const params = await getParams(singleTenSecondVideoTwilioEventApple);

        // Then
        expect(params).toEqual({
            "accountPhoneNumber": "+18017916516",
            "mediaContentType": "video/3gpp",
            "mediaUrl": "https://api.twilio.com/2010-04-01/Accounts/ACb2722d11b73d22b594c81d79aed6b8d2/Messages/MMf3aec14a0afd453f9b8809032b043ad0/Media/ME4daf2ae187fcf9e29503f1d6b25b78ce",
            "message": "",
            "numMedia": "1",
            "recipientPhoneNumber": "+18446151430",
        });
    });
});
