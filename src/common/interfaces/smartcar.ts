import { Smartcar } from "../dto/smartcar";
import { Integration } from "../dto/integration";

export interface ISmartCarClient {
  getAccessToken(integrationRecord: Integration.SmartcarIntegrationRecord.Type): Promise<string>;
  getVehicle(): Promise<Smartcar.Vehicle.Type>;
}
