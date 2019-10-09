import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { IDataSyncConnector } from "../common/interfaces/dataSyncConnector";
import { SmartcarDataSyncResult, SmartcarVehicleRelation } from "../common/dto/smartcarDataSyncRequest";
import { v4 as uuid } from "uuid";
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
    const vehicles: SmartcarVehicleRelation.Type[] = await this.persistenceLayer.getVehicles();
    for (let i = 0; i < vehicles.length; i++) {
      const vehicle: SmartcarVehicleRelation.Type = vehicles[i];

      // Refresh and store new refresh token
      const auth = this.smartcarClient.exchangeRefreshToken(vehicle.refreshToken);
      const updates = {
        refreshToken: auth.refreshToken,
        refreshExpiration: auth.refreshExpiration.toString()
      };
      await this.persistenceLayer.updateVehicle(Object.assign(vehicle, updates));

      // Send new request to the connector
      await this.dataSyncConnector.acceptRequest({
        meta: {
          dataSyncRequestId: uuid()
        },
        data: {
          vehicleId: vehicle.id,
          accessToken: auth.accessToken
        }
      });
      const result: SmartcarDataSyncResult.Type = await this.dataSyncConnector.executeRequest();
    }
  }
}
