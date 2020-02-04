import { PitstopClientNS } from "../dto/pitstop";
import Client = PitstopClientNS.Client;

export interface IPitstopClient {
  getCarByVin(req: Client.GetCarByVinReqDto.Type): Promise<Client.CarResDto.Type | undefined>;
  createCar(req: Client.CreateCarReqDto.Type): Promise<Client.CarResDto.Type>;
  getOrCreateCar(req: Client.CreateCarReqDto.Type): Promise<Client.CarResDto.Type>;
  updateOdometer(req: { carId: number; mileage: number }): Promise<void>;
}

export interface PitstopClientOptions {
  baseUrl: string;
  clientId: string;
  apiKey: string;
}
