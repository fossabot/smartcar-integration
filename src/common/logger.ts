import { Runtime } from "@ansik/sdk/dist/runtime";
import { DebuggerFactory } from "@ansik/sdk/dist/lib/debug";
import { ILogger } from "@ansik/sdk/dist/common/interfaces/logger";
import { Logger } from "@ansik/sdk/dist/lib/logger";

const context = Runtime.GetInstance().context;

const APP_NAME = "smartcar-integration";

const debuggerFactory = new DebuggerFactory(APP_NAME, context);

export function getDebuggr(name: string): ILogger {
  return new Logger(name, undefined, debuggerFactory);
}
