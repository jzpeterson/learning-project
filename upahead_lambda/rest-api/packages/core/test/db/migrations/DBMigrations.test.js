import { describe, expect, it } from "vitest";
import { testDB } from "../test_postgresConversationsDB";
// Only use this class to run DB migrations locally. Don't commit it uncommented or will drop your DB.
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
