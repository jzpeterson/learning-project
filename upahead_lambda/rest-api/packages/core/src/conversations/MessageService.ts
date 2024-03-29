import * as MessageRepository from "../db/repositories/MessageRepository";
import {MessageDirection} from "./enums/MessageDirection";
import {ContentTypes} from "./enums/ContentTypes";
import {ConverterService} from "../services/FileConverter";
import {ExternalMessageParams} from "./utils/ExternalMessageParams";

export interface CustomMessage {
    direction: MessageDirection;
    content: string | null;
}

export class MessageService {
    // TODO refactor this to expect a type once we have refactored MessageRepository to be a class
    private messageRepository: any;
    private fileConverter: ConverterService; // TODO fix the name of this service

    constructor() {
        this.messageRepository = MessageRepository;
        this.fileConverter = new ConverterService();
    }

    private async identifyContentType(contentType: string): Promise<ContentTypes> {
        if (!contentType) {
            return ContentTypes.TEXT;
        }
        if (contentType.startsWith('video/')) {
            return ContentTypes.VIDEO;
        }
        if (contentType.startsWith('image/')) {
            return ContentTypes.IMAGE;
        }
        if (contentType.startsWith('audio/')) {
            return ContentTypes.AUDIO;
        }
        return ContentTypes.TEXT;
    }

    async addInboundMessage(conversationId: string, params: ExternalMessageParams): Promise<CustomMessage> {
        // TODO: cleanup this method
        const contentType = await this.identifyContentType(params.mediaContentType);
        console.log('Message Content Type:', contentType)
        let s3MediaUrl = null;
        let messageContent: string = params.message;
        if (contentType === ContentTypes.VIDEO) {
            console.log("Handling video content type");
            if (!params.mediaUrl) {
                throw new Error('Video content type requires a mediaUrl');
            }
            s3MediaUrl = await this.fileConverter.convertAndUpload(
                params.mediaUrl,
                params.internalPhoneNumber,
                params.messageSid);
        }

        if (s3MediaUrl != null) {
            console.log("Setting message content to s3MediaUrl:", s3MediaUrl);
            messageContent = s3MediaUrl;
        }

        const message = {
            direction: MessageDirection.INBOUND,
            content_type: contentType,
            content: messageContent
        };
        return await this.addMessage(conversationId, message);
    }

    async addMessage(conversationId: string, message: CustomMessage,): Promise<CustomMessage> {
        {}
        return await this.messageRepository.addMessageToConversation(conversationId, message);
    }

    // async addMessage(content: string): Promise<CustomMessage> {
    //     // Apply any business logic here, e.g., validation, enrichment, etc.
    //     if (!content) {
    //         throw new Error('Message content cannot be empty');
    //     }
    //
    //     // Assuming the repository returns the saved message including an autogenerated ID and timestamp
    //     const message: CustomMessage = await this.messageRepository.save({ content });
    //
    //     return message;
    // }

    // Example method to retrieve messages
    async getMessages(): Promise<CustomMessage[]> {
        return this.messageRepository.findAll();
    }

    // Add more methods as needed to interact with the repository
    // and apply your business logic, such as updating or deleting messages
}
