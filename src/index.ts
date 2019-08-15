import { ConfigurationEntryLoadOptions } from "@ansik/sdk/dist/common/interfaces/configurationLoader";
import { ConfigurationLoader } from "@ansik/sdk/dist/lib/configurationLoader";
import { Runtime } from "@ansik/sdk/dist/runtime";
import { readFileSync } from "fs";

import init from "./init";

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

    const configEntries: ConfigurationEntryLoadOptions[] = [
        {
            destPath: "db.connectionString",
            sourcePath: "db__connectionString",
            isRequired: true
        },
        {
            destPath: "smartcar.clientId",
            sourcePath: "smartcar__clientId",
            isRequired: true
        },
        {
            destPath: "smartcar.redirectUri",
            sourcePath: "smartcar__clientSecret",
            isRequired: true
        },
        {
            destPath: "smartcar.clientId",
            sourcePath: "smartcar__clientId",
            isRequired: true
        },
        {
            destPath: "smartcar.testMode",
            sourcePath: "smartcar__testMode",
            isRequired: true,
            deserializer: Boolean
        }
    ];

    const conf = new ConfigurationLoader();
    let configObject = undefined;
    if (process.env.CONF_PATH) {
        debug(`loading configuration from file: ${process.env.CONF_PATH}`);
        configObject = JSON.parse(readFileSync(process.env.CONF_PATH).toString());
        debug("configuration file loaded");
    }
    conf.load(configEntries, configObject);
}
