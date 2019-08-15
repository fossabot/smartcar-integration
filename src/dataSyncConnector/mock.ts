import { IDataSyncConnector } from "../common/interfaces/dataSyncConnector";
import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../common/dto/smartcarDataSyncRequest";

export class DataSyncConnectorMock implements IDataSyncConnector {
    request: any;
    cb: any;

    async acceptRequest(request: SmartcarDataSyncRequest.Type): Promise<void> {
        this.request = request;
    }

    setRequestExecutor(cb: (request: SmartcarDataSyncRequest.Type) => Promise<SmartcarDataSyncResult.Type>): void {
        this.cb = cb;
    }

    async executeRequest(): Promise<SmartcarDataSyncResult.Type> {
        return this.cb(this.request);
    }
}
