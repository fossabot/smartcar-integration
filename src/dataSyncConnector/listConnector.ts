import {
  IDataSyncConnector,
  ListDataSyncConnectorExecuteAllResult,
  ListDataSyncConnectorOptions
} from "../common/interfaces/dataSyncConnector";
import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../common/dto/smartcarDataSync";
import _ from "lodash";
import { TimeoutError } from "bluebird";
import { ExecutionTimeoutError } from "../common/errors";
import { TooManyIterationsError } from "@ansik/sdk/lib/errors";
import { getDebugger } from "../common/logger";

const log = getDebugger("ListDataSyncConnector");

/**
 * connector based on local array
 */
export class ListDataSyncConnector implements IDataSyncConnector {
  constructor(private readonly options: ListDataSyncConnectorOptions) {}

  private readonly requestList: SmartcarDataSyncRequest.Type[] = [];
  private cb?: (request: SmartcarDataSyncRequest.Type) => Promise<SmartcarDataSyncResult.Type>;

  requestCount(): number {
    const { requestList } = this;
    return requestList.length;
  }

  async acceptRequest(request: SmartcarDataSyncRequest.Type): Promise<void> {
    const { requestList } = this;
    requestList.push(request);
  }

  async executeRequest(): Promise<SmartcarDataSyncResult.Type | undefined> {
    const {
      cb,
      requestList,
      options: { timeoutMilliseconds, maxCallTimes }
    } = this;

    let retryCount = 0;

    if (typeof cb !== "function") throw new Error("callback function not set. hint: call setRequestExecutor() first");
    const nextRequest = _.first(requestList);
    if (!nextRequest) return;

    const result = await (async () => {
      while (retryCount < maxCallTimes) {
        try {
          return await Promise.try(() =>
            cb(nextRequest)
              .timeout(timeoutMilliseconds)
              .catch(TimeoutError, () => {
                throw new ExecutionTimeoutError("data sync execution timeout");
              })
          );
        } catch (err) {
          log.debug(`request failed, retry # ${retryCount}/${maxCallTimes}`, "; error:", err.name, err.message);
          retryCount += 1;
        }
      }

      throw new TooManyIterationsError("request execution reached max retry limit");
    })();

    requestList.shift(); // remove processed request
    return result;
  }

  /**
   * will return a result with status = "error" if the execution failed
   */
  async safeExecuteRequest(): Promise<SmartcarDataSyncResult.Type | undefined> {
    const { requestList } = this;
    const request = _.first(requestList);
    if (!request) return;
    try {
      return await this.executeRequest();
    } catch (err) {
      if (err instanceof TooManyIterationsError) requestList.shift(); // remove processed request
      return {
        meta: {
          timestamp: new Date().toISOString(),
          request
        },
        data: {
          status: "error",
          errors: [err]
        }
      };
    }
  }

  async executeAll(): Promise<ListDataSyncConnectorExecuteAllResult> {
    const results: ListDataSyncConnectorExecuteAllResult = {
      ok: [],
      error: []
    };

    while (this.requestCount()) {
      const result: SmartcarDataSyncResult.Type | undefined = await this.safeExecuteRequest();
      if (!result) break;
      const status = result.data.status;
      switch (status) {
        case "ok":
        case "error":
          results[status].push({ request: result.meta.request, result });
          break;
        default:
          log.warn("invalid status:", status);
      }
    }
    return results;
  }

  setRequestExecutor(cb: (request: SmartcarDataSyncRequest.Type) => Promise<SmartcarDataSyncResult.Type>): void {
    this.cb = cb;
  }
}
