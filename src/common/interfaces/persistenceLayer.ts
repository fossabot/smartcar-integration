import { SmartcarDataSyncResult, SmartcarVehicleRelation } from "../dto/smartcarDataSyncRequest";

export interface IPersistenceLayer {
    getVehicles(): Promise<SmartcarVehicleRelation.Type[]>;
    updateVehicle(vehicle: SmartcarVehicleRelation.Type): Promise<void>;
    updateDataSyncStatus(vehicle: SmartcarVehicleRelation.Type, result: SmartcarDataSyncResult.Type): Promise<void>;
}
