import { IPitstopClient } from "../../common/interfaces/pitstopClient";
import { getDebuggr } from "../../common/logger";
import { PitstopClientNS } from "../../common/dto/pitstop";

const log = getDebuggr("PitstopClientMock");

export class PitstopClientMock implements IPitstopClient {
  async createCar(req: PitstopClientNS.Client.CreateCarReqDto.Type): Promise<PitstopClientNS.Client.CarResDto.Type> {
    log.debug(req);
    return { id: 1, vin: "vin", totalMileage: 123 };
  }

  async getCarByVin(
    req: PitstopClientNS.Client.GetCarByVinReqDto.Type
  ): Promise<PitstopClientNS.Client.CarResDto.Type | undefined> {
    log.debug(req);
    return undefined;
  }

  async getOrCreateCar(
    req: PitstopClientNS.Client.CreateCarReqDto.Type
  ): Promise<PitstopClientNS.Client.CarResDto.Type> {
    log.debug(req);
    return { id: 1, vin: "vin", totalMileage: 123 };
  }

  async updateOdometer(req: { carId: number; mileage: number }): Promise<void> {
    log.debug(req);
    return undefined;
  }
}
