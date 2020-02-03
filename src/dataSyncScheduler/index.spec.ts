import { DataSyncScheduler } from "./index";
import { SmartcarClientMock } from "../vendors/smartcar/mock";
import { PersistenceLayerMock } from "../persistenceLayer/mock";
import { DataSyncConnectorMock } from "../dataSyncConnector/mock";
import { PitstopClientMock } from "../vendors/pitstop/mock";
import { getDebuggr } from "../common/logger";

const log = getDebuggr("test:DataSyncScheduler");

describe("DataSyncScheduler", () => {
  it("usage", async () => {
    const smartcarClient = new SmartcarClientMock();
    const persistenceLayer = new PersistenceLayerMock();
    const dataSyncConnector = new DataSyncConnectorMock();
    const pitstopClient = new PitstopClientMock();
    jest
      .spyOn(persistenceLayer, "getIntegrationRecords")
      .mockImplementation(async () => [
        { integrationId: "1", refreshToken: "A", shopId: 1 },
        { integrationId: "2", refreshToken: "B", shopId: 1 }
      ]);
    jest.spyOn(smartcarClient, "tokenExchange").mockImplementation(async integrationRecord => {
      const { refreshToken } = integrationRecord;
      switch (refreshToken) {
        case "A":
          return "a";
        case "B":
          return "b";
        default:
          log.info("invalid refresh token: ", refreshToken);
          return "";
      }
    });
    const getVehicleListResponses = [{ vehicles: ["vehicle-1", "vehicle-2"] }, { vehicles: ["vehicle-3"] }];

    jest
      .spyOn(smartcarClient, "getVehicleList")
      .mockImplementation(async () => getVehicleListResponses.shift() || { vehicles: [] });

    const acceptRequestSpy = jest.spyOn(dataSyncConnector, "acceptRequest");

    const dataSyncScheduler = new DataSyncScheduler({
      smartcarClient,
      pitstopClient,
      persistenceLayer,
      dataSyncConnector
    });

    await expect(dataSyncScheduler.run()).resolves.not.toThrow();
    expect(acceptRequestSpy).toHaveBeenCalledTimes(3);
    expect(acceptRequestSpy).toHaveBeenCalledWith({
      meta: { dataSyncRequestId: expect.any(String) },
      data: { vehicleId: "vehicle-1", accessToken: "a", shopId: 1 }
    });
    expect(acceptRequestSpy).toHaveBeenCalledWith({
      meta: { dataSyncRequestId: expect.any(String) },
      data: { vehicleId: "vehicle-2", accessToken: "a", shopId: 1 }
    });
    expect(acceptRequestSpy).toHaveBeenCalledWith({
      meta: { dataSyncRequestId: expect.any(String) },
      data: { vehicleId: "vehicle-3", accessToken: "b", shopId: 1 }
    });
  });
});
