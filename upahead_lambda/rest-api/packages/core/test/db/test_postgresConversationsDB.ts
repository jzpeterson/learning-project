import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import Database from "../../src/db/types/Database";

const dialect = new PostgresDialect({
    pool: new Pool({
        database: 'upaheadconversations',
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        port: 5432,
        max: 10,
    })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const testDB = new Kysely<Database>({
    dialect,
})