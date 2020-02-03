import { IPersistenceLayer } from "./persistenceLayer";
import { IDataSyncConnector } from "./dataSyncConnector";
import { ISmartcarClient } from "./smartcar";
import { IPitstopClient } from "./pitstopClient";

export interface DataSyncSchedulerOptions {
  readonly smartcarClient: ISmartcarClient;
  readonly pitstopClient: IPitstopClient;
  readonly persistenceLayer: IPersistenceLayer;
  readonly dataSyncConnector: IDataSyncConnector;
}
