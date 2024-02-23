import { Api, RDS } from "sst/constructs";
export function ExampleStack({ stack }) {
    const CONVERSATION_DB = "ConversationsDB";
    const cluster = new RDS(stack, "Cluster", {
        engine: "postgresql13.9",
        defaultDatabaseName: CONVERSATION_DB,
        migrations: "packages/core/src/db/migrations",
        types: {
            path: "packages/core/src/db/types/types.ts",
            camelCase: true
        }
    });
    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [cluster],
            },
        },
        routes: {
            "POST /webhook/twilio": "packages/functions/src/twilioWebhook.handler",
        },
    });
    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });
}
