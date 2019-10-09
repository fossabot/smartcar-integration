import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { IDataSyncConnector } from "../common/interfaces/dataSyncConnector";
import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../common/dto/smartcarDataSyncRequest";
import { IDataSyncExecutor } from "../common/interfaces/dataSyncExecutor";
import { ISmartCarClient } from "../common/interfaces/smartcar";

export class DataSyncExecutor implements IDataSyncExecutor {
  constructor(
    private readonly persistenceLayer: IPersistenceLayer,
    private readonly dataSyncConnector: IDataSyncConnector,
    private readonly smartcarClient: ISmartCarClient // fixme: set up smartcar client and DI into DataSyncExecutor
  ) {
    console.log(this.persistenceLayer);
    console.log(this.dataSyncConnector);
    console.log(this.smartcarClient);
  }

  async processDataSyncRequest(request: SmartcarDataSyncRequest.Type): Promise<SmartcarDataSyncResult.Type> {
    // const vehicle = new smartcar.Vehicle(request.data.vehicleId, request.data.accessToken); // fixme: instantiate elsewhere

    // fixme: move into api wrapper of smartcar nodejs client (i.e. vendors/smartcar)
    // todo: decode response and handle decoding error
    // const odometerResonseDecoded = SmartCarApiResponse.Odometer.dto.decode(odometerResponse);
    const vehicle = await this.smartcarClient.getVehicle();
    await this.persistenceLayer.updateVehicleOdometer(vehicle);

    // todo: update vehicle odometer by calling persistence layer

    return {
      meta: { timestamp: new Date().toISOString(), request },
      data: { status: "ok", values: { odometer: response.data.distance } }
    };
  }
}
