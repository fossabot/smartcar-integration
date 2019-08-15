import { SmartcarDataSyncRequest, SmartcarUserRelation } from "../dto/smartcarDataSyncRequest";

export interface IPersistenceLayer {
    getRefreshTokens(): Promise<SmartcarUserRelation.Type[]>;
    updateDataSyncStatus(request: SmartcarDataSyncRequest.Type, status: string, payload: {}): Promise<void>;
}
