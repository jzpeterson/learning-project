import { describe, it, expect, vi } from 'vitest';
import {TwilioClient} from "../../src/clients/_TwilioClient";

vi.mock('twilio', () => ({
    default: vi.fn().mockImplementation(() => ({
        messages: {
            create: vi.fn().mockResolvedValue({ sid: 'MockedSID' }),
        },
    })),
}));

describe('TwilioClient', () => {
    it('sends a message and returns a response', async () => {
        const service = new TwilioClient();
        const response = await service.sendTwilioMessage('Hello', '+1234567890', '+0987654321');
        expect(response).toBe('Mocked response');
    });
    it('Given valid parameters, when sendTwilioMessage is called, then it should return a successful response', async () => {
        const twilioService = new TwilioClient();
        const response = await twilioService.sendTwilioMessage('Hello', '+1234567890', '+0987654321');
        expect(response.sid).toBe('MockedSID');
    });

    it('Given invalid parameters, when sendTwilioMessage is called, then it should throw an error', async () => {
        const twilioService = new TwilioClient();
        // Mock the implementation to simulate an error
        vi.mocked(twilioService.client.messages.create).mockRejectedValueOnce(new Error('Invalid parameters'));

        await expect(twilioService.sendTwilioMessage('Hello', 'invalid', '+0987654321'))
            .rejects.toThrow('Invalid parameters');
    });
});
