import { getDebuggr } from "../../common/logger";
import { ISmartCarClient } from "../../common/interfaces/smartcar";
import { Integration } from "../../common/dto/integration";
import { Smartcar } from "../../common/dto/smartcar";

const log = getDebuggr("SmartcarClientMock");

export class SmartcarClientMock implements ISmartCarClient {
  async getAccessToken(integrationRecord: Integration.SmartcarIntegrationRecord.Type): Promise<string> {
    log.debug("integration record: ", integrationRecord);
    return "refresh token";
  }

  async getVehicle(): Promise<Smartcar.Vehicle.Type> {
    return {
      odometer: 1
    };
  }
}
