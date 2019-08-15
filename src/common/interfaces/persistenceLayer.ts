import {
  SmartcarDataSyncRequestDto,
  SmartcarDataSyncResultDto
} from "../dto/smartcarDataSyncRequest";

export interface IPersistenceLayer {
  getRefreshTokens(): Promise<SmartcarDataSyncRequestDto.Type[]>;
  updateDataSyncStatus(payload: SmartcarDataSyncResultDto.Type): Promise<void>;
}
