// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import { type ColumnType, type Selectable, type Insertable, type Updateable } from 'kysely';

/** Identifier type for public.Conversation */
export type ConversationId = number & { __brand: 'ConversationId' };

/** Represents the table public.Conversation */
export default interface ConversationTable {
  id: ColumnType<ConversationId, ConversationId | undefined, ConversationId>;

  recipient_phone_number: ColumnType<string, string, string>;

  account_phone_number: ColumnType<string, string, string>;

  start_time: ColumnType<Date, Date | string | undefined, Date | string>;

  last_update_time: ColumnType<Date, Date | string, Date | string>;

  status: ColumnType<string, string, string>;
}

export type Conversation = Selectable<ConversationTable>;

export type NewConversation = Insertable<ConversationTable>;

export type ConversationUpdate = Updateable<ConversationTable>;
