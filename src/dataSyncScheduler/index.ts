import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { IDataSyncConnector } from "../common/interfaces/dataSyncConnector";
// @ts-ignore
import smartcar = require("smartcar");

export class DataSyncScheduler {
    constructor(
        private readonly smartcarClient: smartcar.AuthClient,
        private readonly persistenceLayer: IPersistenceLayer,
        private readonly dataSyncConnector: IDataSyncConnector
    ) {
        console.log(this.smartcarClient);
        console.log(this.persistenceLayer);
        console.log(this.dataSyncConnector);
    }

    async prepareDataSyncRequest(): Promise<void> {
        // todo
    }
}
