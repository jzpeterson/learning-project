import {describe, expect, it} from "vitest";
import {down, up} from "../../../src/db/migrations/setupInitialConversationsTables";
import {testDB} from "../test_postgresConversationsDB";


describe('Test DB Migrations', () => {
    it('should have a defined db', () => {
        expect(testDB).toBeDefined();
    });
    // it('should run migrations up', async () => {
    //     await up(testDB);
    // });
    //
    // it('should run migrations down', async () => {
    //     await down(testDB);
    // });
});