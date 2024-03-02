import { ConversationStatus } from "../enums/ConversationStatus";
import {Message} from "./_Message";
import {ContentTypes} from "../enums/ContentTypes";

export interface Conversation {
    accountId: string;
    internalPhoneNumber: string;
    externalPhoneNumber: string;
    conversationStartedAt: Date;
    status: ConversationStatus;
    conversationConfiguration: ConversationConfiguration;
    messages: Message[]
}

export interface ConversationConfiguration {
    firstMessage: string;
    expectedResponseType: ContentTypes;
    lastMessage: string;
    accountId: string;
}