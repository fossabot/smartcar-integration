import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { SmartcarDataSyncResult, SmartcarVehicleRelation } from "../common/dto/smartcarDataSyncRequest";
import { Smartcar } from "../common/dto/smartcar";
import { Integration } from "../common/dto/integration";

export class PersistenceLayerMock implements IPersistenceLayer {
  async getVehicles(): Promise<SmartcarVehicleRelation.Type[]> {
    return [];
  }

  async updateVehicle(vehicle: SmartcarVehicleRelation.Type): Promise<void> {
    console.log(vehicle);
  }

  async updateDataSyncStatus(
    vehicle: SmartcarVehicleRelation.Type,
    result: SmartcarDataSyncResult.Type
  ): Promise<void> {
    console.log(vehicle, result);
  }

  async updateVehicleOdometer(vehicle: Smartcar.Vehicle.Type): Promise<void> {
    console.log(vehicle);
  }

  async updateRefreshToken(
    integrationRecord: Integration.SmartcarIntegrationRecord.Type,
    newRefreshToken: Integration.SmartcarIntegrationRecord.Type["refreshToken"]
  ): Promise<void> {
    console.log(integrationRecord, newRefreshToken);
  }
}
