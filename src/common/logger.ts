import { Runtime } from "@ansik/sdk/runtime";
import { DebuggerFactory } from "@ansik/sdk/lib/debug";
import { ILogger } from "@ansik/sdk/common/interfaces/logger";
import { Logger } from "@ansik/sdk/lib/logger";

const context = Runtime.GetInstance().context;

const APP_NAME = "smartcar-integration";

const debuggerFactory = new DebuggerFactory(APP_NAME, context);

export function getDebuggr(name: string): ILogger {
  return new Logger(name, undefined, debuggerFactory);
}
