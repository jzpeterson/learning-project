import {Kysely, sql} from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
    console.log("Creating Conversation and Message tables");
    const current_timestamp = sql<null>`CURRENT_TIMESTAMP`;
    await db.schema
        .createTable('Conversation')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('recipient_phone_number', 'varchar', (col) => col.notNull())
        .addColumn('account_phone_number', 'varchar', (col) => col.notNull())
        .addColumn('start_time', 'timestamp', ((col) => col
            .notNull()
            .defaultTo(current_timestamp)))
        .addColumn('last_update_time', 'timestamp', (col) => col.notNull())
        .addColumn('status', 'varchar', (col) => col.notNull())
        .execute();

    await db.schema
        .createTable('Message')
        .addColumn('id', 'serial', (col) => col.primaryKey())
        .addColumn('conversation_id', 'serial', (col) =>
            col.references('Conversation.id').onDelete('cascade').notNull())
        .addColumn('direction', 'varchar', (col) => col.notNull())
        .addColumn('content_type', 'varchar', (col) => col.notNull())
        .addColumn('content', 'text', (col) => col.notNull())
        .addColumn('timestamp', 'timestamp', (col) => col.notNull()
            .defaultTo(current_timestamp))
        .execute();
}

export async function down(db) {
    console.log("Dropping Conversation and Message tables");
    await db.schema
        .dropTable('Message')
        .execute();

    await db.schema
        .dropTable('Conversation')
        .execute();
}
