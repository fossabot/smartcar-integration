import { PersistenceLayerMock } from "../src/persistenceLayer/mock";
import { SmartcarAuthClientMock } from "../src/vendors/smartcar/mock";
import { DataSyncScheduler } from "../src/dataSyncScheduler";
import { DataSyncConnectorMock } from "../src/dataSyncConnector/mock";
import { DataSyncExecutor } from "../src/dataSyncExecutor";

describe("DataSyncScheduler", () => {
    it("usage", async () => {
        const persistenceLayer = new PersistenceLayerMock();
        const smartcarAuthClient = new SmartcarAuthClientMock();
        const dataSyncConnector = new DataSyncConnectorMock();
        const dataSyncScheduler = new DataSyncScheduler(smartcarAuthClient, persistenceLayer, dataSyncConnector);
        const dataSyncExecutor = new DataSyncExecutor(smartcarAuthClient, persistenceLayer, dataSyncConnector);
        dataSyncConnector.setRequestExecutor(dataSyncExecutor.processDataSyncRequest);

        jest.spyOn(persistenceLayer, "getRefreshTokens").mockImplementation(async () => {
            return []; // todo
        });

        const updateDataSyncStatusSpy = jest.spyOn(persistenceLayer, "updateDataSyncStatus");

        await dataSyncScheduler.prepareDataSyncRequest();
        const dataSyncResult = await dataSyncConnector.executeRequest();
        expect(dataSyncConnector.request).toEqual({});
        expect(updateDataSyncStatusSpy).toHaveBeenCalledWith(dataSyncResult);
    });
});
