import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";
import { SmartcarUserRelation } from "../common/dto/smartcarDataSyncRequest";

export class PersistenceLayerMock implements IPersistenceLayer {
    async getRefreshTokens(): Promise<SmartcarUserRelation.Type[]> {
        return [];
    }

    async updateDataSyncStatus(): Promise<void> {}
}
