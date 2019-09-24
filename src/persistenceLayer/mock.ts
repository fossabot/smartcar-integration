import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { SmartcarVehicleRelation, SmartcarDataSyncResult } from "../common/dto/smartcarDataSyncRequest";

export class PersistenceLayerMock implements IPersistenceLayer {
    async getVehicles(): Promise<SmartcarVehicleRelation.Type[]> {
        return [];
    }

    async updateVehicle(vehicle: SmartcarVehicleRelation.Type): Promise<void> {
        console.log(vehicle);
    }

    async updateDataSyncStatus(vehicle: SmartcarVehicleRelation.Type, result: SmartcarDataSyncResult.Type): Promise<void> {
        console.log(vehicle, result);
    }
}
