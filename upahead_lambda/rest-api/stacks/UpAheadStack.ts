import {Api, Config, RDS, StackContext} from "sst/constructs";
import * as path from "path";


export function UpAheadStack({stack}: StackContext) {
    // const migrationsPath = path.join(__dirname, 'packages/core/src/db/migrations');
    const CONVERSATION_DB = "ConversationsDB";

    const TWILIO_ACCOUNT_SID = new Config.Secret(stack, "TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = new Config.Secret(stack, "TWILIO_AUTH_TOKEN");

    const cluster = new RDS(stack, "Cluster", {
        engine: "postgresql13.9",
        defaultDatabaseName: CONVERSATION_DB,
        migrations: 'packages/core/src/db/migrations',
    });

    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [cluster, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN],
            },
        },
        routes: {
            "POST /webhook/twilio": "packages/functions/src/twilioWebhook.handler",
        },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
        SecretArn: cluster.secretArn,
        ClusterIdentifier: cluster.clusterIdentifier,
    });
}
