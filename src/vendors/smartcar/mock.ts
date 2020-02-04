import { getDebugger } from "../../common/logger";
import { ISmartcarClient, ISmartcarVehicle } from "../../common/interfaces/smartcar";
import { Integration } from "../../common/dto/integration";
import { Smartcar } from "../../common/dto/smartcar";

const log = getDebugger("SmartcarClientMock");

export class SmartcarClientMock implements ISmartcarClient {
  getVehicle(id: string): ISmartcarVehicle {
    log.debug(id);
    return new SmartcarVehicleMock();
  }

  async getVehicleList(): Promise<Smartcar.VehicleList.Type> {
    return { vehicles: [] };
  }

  async tokenExchange(
    integrationRecord: Integration.SmartcarIntegrationRecord.Type
  ): Promise<Smartcar.TokenExchange.Type["accessToken"]> {
    log.debug(integrationRecord);
    return "refresh token";
  }
}

export class SmartcarVehicleMock implements ISmartcarVehicle {
  async vehicleAttributes(): Promise<Smartcar.VehicleAttributes.Type> {
    return { make: "make", model: "model", year: 2000 };
  }

  async vin(): Promise<Smartcar.Vin.Type> {
    return "";
  }

  async odometer(): Promise<Smartcar.Odometer.Type> {
    return {
      data: { distance: 1 },
      age: null,
      unitSystem: "abc"
    };
  }
}
