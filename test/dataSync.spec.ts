import { PersistenceLayerMock } from "../src/persistenceLayer/mock";
import { SmartcarAuthClientMock } from "../src/vendors/smartcar/mock";
import { DataSyncScheduler } from "../src/dataSyncScheduler";
import { DataSyncConnectorMock } from "../src/dataSyncConnector/mock";
import { DataSyncExecutor } from "../src/dataSyncExecutor";
import { SmartcarDataSyncRequest } from "../src/common/dto/smartcarDataSyncRequest";

describe("DataSyncScheduler", () => {
    it("usage", async () => {
        const persistenceLayer = new PersistenceLayerMock();
        const smartcarAuthClient = new SmartcarAuthClientMock();
        const dataSyncConnector = new DataSyncConnectorMock();
        const dataSyncScheduler = new DataSyncScheduler(smartcarAuthClient, persistenceLayer, dataSyncConnector);
        const dataSyncExecutor = new DataSyncExecutor(smartcarAuthClient, persistenceLayer, dataSyncConnector);
        dataSyncConnector.setRequestExecutor(request => dataSyncExecutor.processDataSyncRequest(request));

        jest.spyOn(persistenceLayer, "getRefreshTokens").mockImplementation(async () => {
            return []; // todo
        });

        const updateDataSyncStatusSpy = jest.spyOn(persistenceLayer, "updateDataSyncStatus");

        await dataSyncScheduler.prepareDataSyncRequest();
        const mockRequest: SmartcarDataSyncRequest.Type = {
          id: '1234',
          userId: 1234,
          refreshToken: '399ba9fd-2201-4dfe-b354-97c04a33ffd2',
        };
        dataSyncConnector.acceptRequest(mockRequest);
        const dataSyncResult = await dataSyncConnector.executeRequest();
        expect(dataSyncConnector.request).toEqual(mockRequest);
        expect(updateDataSyncStatusSpy).toHaveBeenCalledWith(mockRequest, "ok", dataSyncResult);
    });
});
