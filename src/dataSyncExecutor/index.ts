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
        const mockResult: SmartcarDataSyncResult.Type = {
            meta: {
                timestamp: "2019-09-20T11:30:21-07:00",
                request: {
                    id: '1234',
                    userId: 1234,
                    refreshToken: '399ba9fd-2201-4dfe-b354-97c04a33ffd2',
                },
            },
            data: {
                status: "ok",
                message: "",
            }
        };
        this.persistenceLayer.updateDataSyncStatus(request, "ok", mockResult);
        return mockResult;
    }
}
