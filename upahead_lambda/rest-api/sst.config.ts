import { SSTConfig } from "sst";
import { UpAheadStack } from "./stacks/UpAheadStack";

export default {
  config(_input) {
    return {
      name: "upahead-conversations-lambda",
      region: "us-west-2",
    };
  },
  stacks(app) {
    app.stack(UpAheadStack);
  }
} satisfies SSTConfig;
