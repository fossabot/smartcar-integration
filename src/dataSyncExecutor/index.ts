import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { IDataSyncConnector } from "../common/interfaces/dataSyncConnector";
import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../common/dto/smartcarDataSyncRequest";
import { IDataSyncExecutor } from "../common/interfaces/dataSyncExecutor";
// @ts-ignore
import smartcar = require("smartcar");

export class DataSyncExecutor implements IDataSyncExecutor {
    constructor(
        private readonly smartcarClient: smartcar.AuthClient,
        private readonly persistenceLayer: IPersistenceLayer,
        private readonly dataSyncConnector: IDataSyncConnector
    ) {
        console.log(this.smartcarClient);
        console.log(this.persistenceLayer);
        console.log(this.dataSyncConnector);
    }

    async processDataSyncRequest(request: SmartcarDataSyncRequest.Type): Promise<SmartcarDataSyncResult.Type> {
        console.log(request);
        return <any>{};
        // todo
    }
}
