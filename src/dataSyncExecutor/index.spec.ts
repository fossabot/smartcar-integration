import { DataSyncExecutor } from "./index";
import { PersistenceLayerMock } from "../persistenceLayer/mock";
import { DataSyncConnectorMock } from "../dataSyncConnector/mock";
import { SmartcarClientMock, SmartcarVehicleMock } from "../vendors/smartcar/mock";
import { PitstopClientMock } from "../vendors/pitstop/mock";

describe("DataSyncExecutor", () => {
  it("updates vehicle mileage", async () => {
    const persistenceLayer = new PersistenceLayerMock();
    const dataSyncConnector = new DataSyncConnectorMock();
    const smartcarClient = new SmartcarClientMock();
    const pitstopClient = new PitstopClientMock();

    const request = {
      meta: { dataSyncRequestId: "a" },
      data: { vehicleId: "b", accessToken: "c", shopId: 1 }
    };

    const vehicle = new SmartcarVehicleMock();

    /*
     * mocks
     */
    jest.spyOn(vehicle, "vehicleAttributes").mockImplementation(async () => ({
      make: "make",
      model: "model",
      year: 2000
    }));
    jest.spyOn(vehicle, "vin").mockImplementation(async () => "abc");
    jest
      .spyOn(vehicle, "odometer")
      .mockImplementation(async () => ({ data: { distance: 123 }, age: null, unitSystem: "metrics" }));
    jest.spyOn(smartcarClient, "getVehicle").mockImplementation(() => vehicle);
    const getOrCreateCarSpy = jest.spyOn(pitstopClient, "getOrCreateCar").mockImplementation(async req => ({
      ...req,
      id: 2,
      totalMileage: req.mileage
    }));
    const updateMileageSpy = jest.spyOn(pitstopClient, "updateOdometer");

    const executor = new DataSyncExecutor({ persistenceLayer, dataSyncConnector, smartcarClient, pitstopClient });

    await expect(executor.processDataSyncRequest(request)).resolves.not.toThrow();
    expect(getOrCreateCarSpy).toHaveBeenCalledWith({
      vin: "abc",
      make: "make",
      model: "model",
      year: 2000,
      mileage: 123,
      shopId: 1
    });
    expect(updateMileageSpy).toHaveBeenCalledWith({ carId: 2, mileage: 123 });
  });
});
