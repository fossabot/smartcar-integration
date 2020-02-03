import {IDataSyncConnector, ListDataSyncConnectorOptions} from "../common/interfaces/dataSyncConnector";
import {SmartcarDataSyncRequest, SmartcarDataSyncResult} from "../common/dto/smartcarDataSyncRequest";
import _ from "lodash";
import {TimeoutError} from "bluebird";
import {ExecutionTimeoutError} from "../common/errors";
import {TooManyIterationsError} from "@ansik/sdk/lib/errors";
import {getDebuggr} from "../common/logger";

const log = getDebuggr("ListDataSyncConnector");

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
      options: { timeoutMilliseconds, retryLimit }
    } = this;

    let retryCount = 0;

    if (typeof cb !== "function") throw new Error("callback function not set. hint: call setRequestExecutor() first");
    const nextRequest = _.first(requestList);
    if (!nextRequest) return;

    const result = await (async () => {
      while (retryCount < retryLimit) {
        try {
          return await Promise.try(() =>
            cb(nextRequest)
              .timeout(timeoutMilliseconds)
              .catch(TimeoutError, () => {
                throw new ExecutionTimeoutError("data sync execution timeout");
              })
          );
        } catch (err) {
          log.debug("request failed, retry #:", retryCount, "; error:", err.name, err.message);
          retryCount += 1;
        }
      }

      throw new TooManyIterationsError("request execution reached max retry limit");
    })();

    requestList.shift(); // remove processed request
    return result;
  }

  async executeAll(): Promise<void> {
    // while (dataSyncConnector.requestCount()) await dataSyncConnector.executeRequest();
  }

  setRequestExecutor(cb: (request: SmartcarDataSyncRequest.Type) => Promise<SmartcarDataSyncResult.Type>): void {
    this.cb = cb;
  }
}
