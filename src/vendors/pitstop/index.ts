import axios, { AxiosInstance } from "axios";
import { IPitstopClient, PitstopClientOptions } from "../../common/interfaces/pitstopClient";
import { PitstopClientNS } from "../../common/dto/pitstop";
import { getDebugger } from "../../common/logger";
import _ from "lodash";
import Api = PitstopClientNS.Api;
import Client = PitstopClientNS.Client;

const log = getDebugger("PitstopClient");

export class PitstopClient implements IPitstopClient {
  httpClient: AxiosInstance;

  constructor(options: PitstopClientOptions) {
    this.httpClient = axios.create({
      baseURL: options.baseUrl,
      headers: {
        "client-id": options.clientId,
        authorization: `apikey ${options.apiKey}`,
        "content-type": "application/json"
      }
    });
  }

  async createCar(req: Client.CreateCarReqDto.Type): Promise<Client.CarResDto.Type> {
    const { httpClient } = this;
    const { vin, make, model, year, mileage, shopId } = req;
    const requestBody: Api.CreateCar.Request.Type = {
      vin,
      make,
      model,
      year,
      baseMileage: mileage,
      totalMileage: mileage,
      shopId,
      vinCorrection: false,
      ignoreVinDecodingFailure: true
    };

    const response = await httpClient.request({ method: "post", url: "/v1/car", data: requestBody }).catch(err => {
      if (err.response) log.info(err.message, err.response.data);
      throw err;
    });
    const responseDecoded = Api.CreateCar.Response.dto.decode(response.data);
    if (responseDecoded.isLeft()) {
      log.info("failed to decode response:", response.data);
      throw new Error("failed to decode response");
    }

    const result = _.pick(responseDecoded.value, ["id", "vin", "totalMileage"]);
    return { ...result, totalMileage: Number(result.totalMileage) };
  }

  async getCarByVin(req: Client.GetCarByVinReqDto.Type): Promise<Client.CarResDto.Type | undefined> {
    const { httpClient } = this;
    const { vin } = req;
    const response = await httpClient.request({ method: "get", url: "/v1/car", params: { vin } });
    const responseDecoded = Api.GetCarByVin.Response.dto.decode(
      _.chain(response.data)
        .get("result[0]")
        .value()
    );
    if (responseDecoded.isLeft()) {
      log.info("failed to decode response:", response.data);
      return undefined;
    }
    const result = _.pick(responseDecoded.value, ["id", "vin", "totalMileage"]);
    return { ...result, totalMileage: Number(result.totalMileage) };
  }

  async getOrCreateCar(req: Client.CreateCarReqDto.Type): Promise<Client.CarResDto.Type> {
    const { vin } = req;

    let car = await this.getCarByVin({ vin });
    if (!car) {
      log.debug("cannot find car, create a new car instead");
      car = await this.createCar(req);
      if (!car) throw new Error("cannot create car");
      log.debug("new car created");
    }

    return car;
  }

  async updateOdometer(req: { carId: number; mileage: number }): Promise<void> {
    const { httpClient } = this;
    const { carId, mileage } = req;
    const requestBody: Api.UpdateCarOdometer.Request.Type = { totalMileage: mileage };
    log.debug("update odometer to:", mileage);
    await httpClient.request({ method: "patch", url: `/v1/car/${carId}`, data: requestBody });
  }
}
