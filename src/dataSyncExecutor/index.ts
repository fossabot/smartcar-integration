import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../common/dto/smartcarDataSyncRequest";
import { DataSyncExecutorOptions, IDataSyncExecutor } from "../common/interfaces/dataSyncExecutor";
import { ISmartcarVehicle } from "../common/interfaces/smartcar";

export class DataSyncExecutor implements IDataSyncExecutor {
  constructor(private readonly options: DataSyncExecutorOptions) {}

  setup(): void {
    const { dataSyncConnector } = this.options;
    dataSyncConnector.setRequestExecutor(this.processDataSyncRequest.bind(this));
  }

  async processDataSyncRequest(request: SmartcarDataSyncRequest.Type): Promise<SmartcarDataSyncResult.Type> {
    await this.vehicleDataUpdate(request);

    return {
      meta: { timestamp: new Date().toISOString(), request },
      data: { status: "ok" }
    };
  }

  private async vehicleDataUpdate(request: SmartcarDataSyncRequest.Type) {
    const { pitstopClient, smartcarClient } = this.options;
    const { vehicleId, shopId } = request.data;

    const vehicle: ISmartcarVehicle = await smartcarClient.getVehicle(vehicleId);
    const [
      vin,
      { make, model, year },
      {
        data: { distance }
      }
    ] = await Promise.all([vehicle.vin(), vehicle.vehicleAttributes(), vehicle.odometer()]);
    const roundedDistance = Number(distance.toFixed(3));
    const pitstopCar = await pitstopClient.getOrCreateCar({ vin, make, model, year, shopId, mileage: roundedDistance });
    const { id } = pitstopCar;
    await pitstopClient.updateOdometer({ carId: id, mileage: roundedDistance });
  }
}
