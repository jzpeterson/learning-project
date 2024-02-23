import {beforeEach, describe, expect, it, vi} from "vitest";
import {generateNextResponse} from "../../src/conversations/responseGenerator";
import {MessageDirection} from "../../src/conversations/enums/MessageDirection";
import {getMessagesForConversation} from "../../src/db/repositories/MessageRepository";

// TODO figure out how mocks are working because this file is super broken.
// describe('Test responseGenerator', () => {
//     beforeEach(async () => {
//         const mockMessagesForConversation = vi.fn(() => Promise.resolve([
//         // Any setup that needs to happen before each test, including re-mocking modules
//     });
//     it('should return the second message if a single outbound message is found', async () => {
//         // Given
//         // vi.mock('../../src/db/repositories/MessageRepository', () => ({
//         //     getMessagesForConversation: vi.fn(() => Promise.resolve([
//         //         {direction: MessageDirection.INBOUND},
//         //         {direction: MessageDirection.OUTBOUND},
//         //         {direction: MessageDirection.INBOUND}])),
//         // }));
//
//         // When
//         const message = await generateNextResponse('159')
//
//         // Then
//         expect(message).toEqual('Second Message');
//     });
//
//     it('should return the first message if an empty list of messages are returned', async () => {
//         // Given
//         // vi.mock('../../src/db/repositories/MessageRepository', () => ({
//         //     getMessagesForConversation: vi.fn(() => Promise.resolve([])),
//         // }));
//
//         // When
//         const message = await generateNextResponse('159')
//
//         // Then
//         expect(message).toEqual('First Message');
//     });
//
//     it('should return the first message if null is returned', async () => {
//         // Given
//         // vi.mock('../../src/db/repositories/MessageRepository', () => ({
//         //     getMessagesForConversation: vi.fn(() => Promise.resolve(null)),
//         // }));
//
//         // When
//         const message = await generateNextResponse('159')
//
//         // Then
//         expect(message).toEqual('First Message');
//     });
//
//     it('should return the first message if only a single inbound message is found', async () => {
//         // Given
//         vi.mock('../../src/db/repositories/MessageRepository', () => ({
//             getMessagesForConversation: vi.fn(() => Promise.resolve([{direction: MessageDirection.INBOUND}])),
//         }));
//
//         // When
//         const message = await generateNextResponse('159')
//
//         // Then
//         expect(message).toEqual('First Message');
//     });
//
//     it('should return the first message if only multiple inbound messages are found', async () => {
//         // Given
//         vi.mock('../../src/db/repositories/MessageRepository', () => ({
//             getMessagesForConversation: vi.fn(() => Promise.resolve([
//                 {direction: MessageDirection.INBOUND},
//                 {direction: MessageDirection.INBOUND},
//                 {direction: MessageDirection.INBOUND}])),
//         }));
//
//         // When
//         const message = await generateNextResponse('159')
//
//         // Then
//         expect(message).toEqual('First Message');
//     });
//
// });