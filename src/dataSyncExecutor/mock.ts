import { IDataSyncExecutor } from "../common/interfaces/dataSyncExecutor";
import { SmartcarDataSyncRequest, SmartcarDataSyncResult } from "../common/dto/smartcarDataSyncRequest";

export class DataSyncExecutorMock implements IDataSyncExecutor {
  setup(): void {}

  async processDataSyncRequest(request: SmartcarDataSyncRequest.Type): Promise<SmartcarDataSyncResult.Type> {
    return {
      meta: { timestamp: new Date().toISOString(), request },
      data: { status: "ok" }
    };
  }
}
