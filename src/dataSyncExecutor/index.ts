import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { IDataSyncConnector } from "../common/interfaces/dataSyncConnector";
import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../common/dto/smartcarDataSyncRequest";
import { IDataSyncExecutor } from "../common/interfaces/dataSyncExecutor";
// @ts-ignore
import smartcar = require("smartcar");

export class DataSyncExecutor implements IDataSyncExecutor {
    constructor(
        private readonly persistenceLayer: IPersistenceLayer,
        private readonly dataSyncConnector: IDataSyncConnector
    ) {
        console.log(this.persistenceLayer);
        console.log(this.dataSyncConnector);
    }

    async processDataSyncRequest(request: SmartcarDataSyncRequest.Type): Promise<SmartcarDataSyncResult.Type> {
        const vehicle = new smartcar.Vehicle(
            request.data.vehicleId,
            request.data.accessToken
        );
        let result: SmartcarDataSyncResult.Type;
        try {
            const response = await vehicle.odometer();
            result = {
                meta: {
                    timestamp: response.age,
                    request
                },
                data: {
                    status: "ok",
                    values: {
                        odometer: response.data.distance
                    }
                }
            };
        } catch (err) {
            result = {
                meta: {
                    timestamp: (new Date()).toString(),
                    request
                },
                data: {
                    status: "error",
                    errors: [err]
                }
            };
        }

        return result;
    }
}
