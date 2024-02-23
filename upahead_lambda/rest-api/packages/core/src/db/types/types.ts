// import {ConversationStatus} from "../../conversations/enums/ConversationStatus";
// import {Generated, Insertable, Selectable, Updateable} from 'kysely'
// import {MessageDirection} from "../../conversations/enums/MessageDirection";
// import {ContentTypes} from "../../conversations/enums/ContentTypes";
//
// export interface Database {
//     conversations: ConversationsTable
//     messages: MessagesTable
// }
//
// export interface ConversationsTable {
//     id: Generated<number>;
//     recipient_phone_number: string;
//     account_phone_number: string;
//     start_time: Generated<Date>;
//     last_update_time: Date;
//     status: ConversationStatus;
// }
//
// export type Conversation = Selectable<ConversationsTable>;
// export type NewConversation = Insertable<ConversationsTable>;
// export type ConversationUpdate = Updateable<ConversationsTable>;
//
// export interface MessagesTable {
//     id: Generated<number>;
//     conversations_id: string; // TODO make this a foreign key
//     message_direction: MessageDirection;
//     content_type: ContentTypes;
//     content: string;
//     timestamp: Generated<Date>;
// }
//
// export type Message = Selectable<MessagesTable>;
// export type NewMessage = Insertable<MessagesTable>;
// export type MessageUpdate = Updateable<MessagesTable>;