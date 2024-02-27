import type { ColumnType } from "kysely";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Conversations {
  ConversationID: string;
  RecipientPhoneNumber: string;
  ApplicantPhoneNumber: string;
  StartTime: Timestamp;
  LastUpdateTime: Timestamp;
  Status: string;
}

export interface Messages {
  MessageID: string;
  ConversationID: string;
  Direction: string;
  ContentType: string;
  Content: string;
  Timestamp: Timestamp;
}

export interface Database {
  Conversations: Conversations;
  Messages: Messages;
}
