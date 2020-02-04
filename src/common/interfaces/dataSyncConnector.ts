import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../dto/smartcarDataSync";

export interface IDataSyncConnector {
  acceptRequest(request: SmartcarDataSyncRequest.Type): Promise<void>;
  setRequestExecutor(cb: (request: SmartcarDataSyncRequest.Type) => Promise<SmartcarDataSyncResult.Type>): void;
  executeRequest(): Promise<SmartcarDataSyncResult.Type | undefined>;
}

export interface ListDataSyncConnectorOptions {
  readonly timeoutMilliseconds: number;
  readonly maxCallTimes: number;
}

export type ListDataSyncConnectorExecuteAllResult = {
  [x in SmartcarDataSyncResult.Type["data"]["status"]]: {
    request: SmartcarDataSyncRequest.Type;
    result: SmartcarDataSyncResult.Type;
  }[]
};
