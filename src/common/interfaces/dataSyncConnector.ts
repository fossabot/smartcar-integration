import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../dto/smartcarDataSyncRequest";

export interface IDataSyncConnector {
    acceptRequest(request: SmartcarDataSyncRequest.Type): Promise<void>;
    setRequestExecutor(cb: (request: SmartcarDataSyncRequest.Type) => Promise<SmartcarDataSyncResult.Type>): void;
}
