import { ConfigurationLoader } from "@ansik/sdk/dist/lib/configurationLoader";
import { Runtime } from "@ansik/sdk/dist/runtime";
import { readFileSync } from "fs";

import init from "./init";
import { configuration } from "./common/configuration";

init();

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
  let configObject = undefined;
  if (process.env.CONF_PATH) {
    debug(`loading configuration from file: ${process.env.CONF_PATH}`);
    configObject = JSON.parse(readFileSync(process.env.CONF_PATH).toString());
    debug("configuration file loaded");
  }
  conf.load(configuration, configObject);
}
