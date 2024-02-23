import {Kysely} from "kysely";
import {DataApiDialect} from "kysely-data-api";
import {RDS} from "sst/node/rds";
import {RDSData} from "@aws-sdk/client-rds-data";
import Database from "./types/Database";

export const prodDB = new Kysely<Database>({
    dialect: new DataApiDialect({
        mode: "postgres",
        driver: {
            database: RDS.Cluster.defaultDatabaseName,
            secretArn: RDS.Cluster.secretArn,
            resourceArn: RDS.Cluster.clusterArn,
            client: new RDSData({}),
        },
    }),
});