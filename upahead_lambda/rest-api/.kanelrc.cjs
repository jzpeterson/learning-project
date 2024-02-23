const { makeKyselyHook } = require("kanel-kysely");
const outputPath = "C:/Users/jordo/upahead/upahead_node_project/upahead_lambda/rest-api/packages/core/src/db/types"
module.exports = {

    connection: {
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        database: 'upaheadconversations',
        charset: 'utf8',
        port: 5432,
    },
    outputPath: outputPath,
    // ... your config here.

    preRenderHooks: [makeKyselyHook()],
};

