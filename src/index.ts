import { Runtime } from "@ansik/sdk/runtime";
import { ConfigurationLoader } from "@ansik/sdk/lib/configurationLoader";
import { readFileSync } from "fs";
import { configuration } from "./configuration";

require("./init");

export function foo() {
  console.log("bar");
}

let inited = false;

export function entrypoint() {
  if (!inited) bootstrap();
}

export function bootstrap() {
  const debug = Runtime.GetInstance().debuggerFactory.getDebugger("bootstrap");
  const conf = new ConfigurationLoader();
  let confObject = undefined;
  if (process.env.CONF_PATH) {
    debug(`loading configuration from file: ${process.env.CONF_PATH}`);
    confObject = JSON.parse(readFileSync(process.env.CONF_PATH).toString());
    debug("configuration file loaded");
  }
  conf.load({
    confEntries: configuration,
    confObject
  });
}
