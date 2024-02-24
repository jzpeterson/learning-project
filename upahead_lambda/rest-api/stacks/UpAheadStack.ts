import {Api, Config, RDS, StackContext} from "sst/constructs";


export function UpAheadStack({stack}: StackContext) {
    const CONVERSATION_DB = "ConversationsDB";

    const TWILIO_ACCOUNT_SID = new Config.Secret(stack, "TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = new Config.Secret(stack, "TWILIO_AUTH_TOKEN");

    const cluster = new RDS(stack, "Cluster", {
        engine: "postgresql13.9",
        defaultDatabaseName: CONVERSATION_DB,
        migrations: 'packages/migrations',
    });

    const api = new Api(stack, "Api", {
        defaults: {
            function: {
                bind: [cluster, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN],
                timeout: 180,
            },
        },
        routes: {
            "POST /webhook/twilio": "packages/functions/src/twilioWebhook.handler",
        },
    });

    stack.addOutputs({
        ApiEndpoint: api.url,
        SecretArn: cluster.secretArn,
        ClusterIdentifier: cluster.clusterIdentifier,
    });
}
