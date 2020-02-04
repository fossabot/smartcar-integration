import { SmartcarDataSyncResult, SmartcarVehicleRelation } from "../dto/smartcarDataSyncRequest";
import { Integration } from "../dto/integration";
import { IQueryExecutor } from "@ansik/sdk/common/interfaces/sql";
import { DBSchema } from "../dto/dbSchema";

export interface IPersistenceLayer {
  /**
   * adds a smartcar integration record to db.
   * @param record
   */
  addIntegrationRecord(record: Omit<DBSchema.IntegrationRecord.Type, "id">): Promise<void>;
  /**
   * retrieves smartcar integration records from db. (limit hard coded to 2000)
   */
  getIntegrationRecords(): Promise<Integration.SmartcarIntegrationRecord.Type[]>;
  // getVehicles(): Promise<SmartcarVehicleRelation.Type[]>;
  // updateVehicle(vehicle: SmartcarVehicleRelation.Type): Promise<void>;

  /**
   * adds data sync record in db.
   * @param vehicle
   * @param result
   */
  updateDataSyncStatus(vehicle: SmartcarVehicleRelation.Type, result: SmartcarDataSyncResult.Type): Promise<void>;
  /**
   * updates the refresh token of an integration record in db.
   * @param integrationRecord
   * @param newRefreshToken
   */
  updateRefreshToken(
    integrationRecord: Integration.SmartcarIntegrationRecord.Type,
    newRefreshToken: Integration.SmartcarIntegrationRecord.Type["refreshToken"]
  ): Promise<void>;
}

export interface PersistenceLayerOptions {
  readonly queryExecutor: IQueryExecutor;
}
