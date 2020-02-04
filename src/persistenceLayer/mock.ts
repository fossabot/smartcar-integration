import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { SmartcarDataSyncResult, SmartcarVehicleRelation } from "../common/dto/smartcarDataSync";
import { Integration } from "../common/dto/integration";
import { DBSchema } from "../common/dto/dbSchema";

export class PersistenceLayerMock implements IPersistenceLayer {
  async addIntegrationRecord(record: Omit<DBSchema.IntegrationRecord.Type, "id">): Promise<void> {
    console.log(record);
  }

  async getIntegrationRecords(): Promise<Integration.SmartcarIntegrationRecord.Type[]> {
    return [];
  }

  async updateVehicleOdometer(vin: string, odometerKm: number): Promise<void> {
    console.log(vin, odometerKm);
  }

  async updateRefreshToken(
    integrationRecord: Integration.SmartcarIntegrationRecord.Type,
    newRefreshToken: Integration.SmartcarIntegrationRecord.Type["refreshToken"]
  ): Promise<void> {
    console.log(integrationRecord, newRefreshToken);
  }

  async updateDataSyncStatus(
    vehicle: SmartcarVehicleRelation.Type,
    result: SmartcarDataSyncResult.Type
  ): Promise<void> {
    console.log(vehicle, result);
    return undefined;
  }
}
