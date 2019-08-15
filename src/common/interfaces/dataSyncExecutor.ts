import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../dto/smartcarDataSyncRequest";

export interface IDataSyncExecutor {
    processDataSyncRequest(request: SmartcarDataSyncRequest.Type): Promise<SmartcarDataSyncResult.Type>;
}
