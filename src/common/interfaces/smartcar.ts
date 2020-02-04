import { Smartcar } from "../dto/smartcar";
import { Integration } from "../dto/integration";
import { IPersistenceLayer } from "./persistenceLayer";

export interface ISmartcarClient {
  tokenExchange(
    integrationRecord: Integration.SmartcarIntegrationRecord.Type
  ): Promise<Smartcar.TokenExchange.Type["accessToken"]>;
  getVehicleList(): Promise<Smartcar.VehicleList.Type>;
  getVehicle(id: Smartcar.VehicleList.Type["vehicles"][0]): ISmartcarVehicle;
}

export interface ISmartcarVehicle {
  vin(): Promise<Smartcar.Vin.Type>;
  vehicleAttributes(): Promise<Smartcar.VehicleAttributes.Type>;
  odometer(): Promise<Smartcar.Odometer.Type>;
}

export interface SmartCarClientOptions {
  persistenceLayer: IPersistenceLayer;
  client: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  };
}
