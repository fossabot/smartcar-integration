import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../dto/smartcarDataSync";
import { IPersistenceLayer } from "./persistenceLayer";
import { IDataSyncConnector } from "./dataSyncConnector";
import { ISmartcarClient } from "./smartcar";
import { IPitstopClient } from "./pitstopClient";

export interface IDataSyncExecutor {
  setup(): void;
  processDataSyncRequest(request: SmartcarDataSyncRequest.Type): Promise<SmartcarDataSyncResult.Type>;
}

export interface DataSyncExecutorOptions {
  readonly pitstopClient: IPitstopClient;
  readonly smartcarClient: ISmartcarClient; // fixme: set up smartcar client and DI into DataSyncExecutor
  readonly persistenceLayer: IPersistenceLayer;
  readonly dataSyncConnector: IDataSyncConnector;

}
