import { SmartcarDataSyncResult, SmartcarVehicleRelation } from "../dto/smartcarDataSyncRequest";
import { Smartcar } from "../dto/smartcar";
import { Integration } from "../dto/integration";

export interface IPersistenceLayer {
  getVehicles(): Promise<SmartcarVehicleRelation.Type[]>;
  updateVehicle(vehicle: SmartcarVehicleRelation.Type): Promise<void>;
  updateDataSyncStatus(vehicle: SmartcarVehicleRelation.Type, result: SmartcarDataSyncResult.Type): Promise<void>;
  updateVehicleOdometer(vehicle: Smartcar.Vehicle.Type): Promise<void>;
  updateRefreshToken(
    integrationRecord: Integration.SmartcarIntegrationRecord.Type,
    newRefreshToken: Integration.SmartcarIntegrationRecord.Type["refreshToken"]
  ): Promise<void>;
}
