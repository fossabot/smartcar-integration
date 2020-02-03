// @ts-ignore
import smartcar = require("smartcar");
import { ISmartcarClient, ISmartcarVehicle, SmartCarClientOptions } from "../../common/interfaces/smartcar";
import { Smartcar } from "../../common/dto/smartcar";
import { Integration } from "../../common/dto/integration";
import { getDebuggr } from "../../common/logger";
import { decodeData } from "../../common/dto/utils";
import { InvalidStateError } from "../../common/errors";

const log = getDebuggr("SmartcarClient");

export class SmartcarClient implements ISmartcarClient {
  private authentication?: Smartcar.TokenExchange.Type = undefined;

  constructor(private readonly options: SmartCarClientOptions) {}

  get accessToken(): string | undefined {
    return this.authentication && this.authentication.accessToken;
  }

  /**
   * exchanges and returns a refresh token from authorization code
   * @param code
   */
  async authorizationCodeExchange(code: string): Promise<string> {
    const client = this.makeAuthClient();
    const { refreshToken } = await client.exchangeCode(code);
    if (!refreshToken) {
      log.warn(`no refresh token in exchange result. authorization code: ${code}`);
    }
    return refreshToken;
  }

  /**
   * exchanges a new access token and updates refresh token record in db, then return the access token
   * @param integrationRecord
   */
  async tokenExchange(integrationRecord: Integration.SmartcarIntegrationRecord.Type): Promise<string> {
    const { accessToken, refreshToken } = await this.authenticate(integrationRecord.refreshToken);
    if (!refreshToken) {
      log.warn("no refresh token in token exchange result, integration record: ", integrationRecord);
    } else {
      await this.options.persistenceLayer.updateRefreshToken(integrationRecord, refreshToken);
    }

    return accessToken;
  }

  /**
   * this method exchanges for a new access token and a new refresh token.
   * see https://smartcar.com/docs/api?language=cURL#refresh-token-exchange
   */
  private async authenticate(refreshToken: string): Promise<Smartcar.TokenExchange.Type> {
    const tokenExchangeResponse = await this.makeAuthClient().exchangeRefreshToken(refreshToken);
    const tokenExchangeResponseDecoded = Smartcar.TokenExchange.dto.decode(tokenExchangeResponse);

    if (tokenExchangeResponseDecoded.isLeft()) {
      log.debug("failed to decode token exchange response: ", tokenExchangeResponse);
      throw new InvalidStateError("failed to decode token exchange response");
    }

    this.authentication = tokenExchangeResponseDecoded.value;

    return this.authentication;
  }

  async getVehicleList(): Promise<Smartcar.VehicleList.Type> {
    if (!this.authentication || !this.authentication.accessToken) {
      throw new Error("client has no access token. hint: call tokenExchange()");
    }
    const { accessToken } = this.authentication;

    const data = await smartcar.getVehicleIds(accessToken);
    const parsed = Smartcar.VehicleList.dto.decode(data);
    if (parsed.isLeft()) throw new Error(`failed to decode vehicle list: ${data}`);
    return parsed.value;
  }

  getVehicle(id: Smartcar.VehicleList.Type["vehicles"][0]): SmartcarVehicle {
    if (!this.authentication || !this.authentication.accessToken) {
      throw new Error("client has no access token. hint: call tokenExchange()");
    }
    const { accessToken } = this.authentication;

    return new SmartcarVehicle(new smartcar.Vehicle(id, accessToken));
  }

  /**
   * exposed for unit test
   */
  makeAuthClient(): smartcar.AuthClient {
    return new smartcar.AuthClient(this.options.client);
  }
}

export class SmartcarVehicle implements ISmartcarVehicle {
  constructor(private readonly vehicle: smartcar.Vehicle) {}

  async vin(): Promise<Smartcar.Vin.Type> {
    const data = await this.vehicle.vin();
    return decodeData({ data, decoder: Smartcar.Vin.dto, dtoName: "vin" });
  }

  async vehicleAttributes(): Promise<Smartcar.VehicleAttributes.Type> {
    const data = await this.vehicle.info();
    return decodeData({ data, decoder: Smartcar.VehicleAttributes.dto, dtoName: "vehicleAttributes" });
  }

  async odometer(): Promise<Smartcar.Odometer.Type> {
    const data = JSON.parse(JSON.stringify(await this.vehicle.odometer())); // make all fields deserializable
    return decodeData({ data, decoder: Smartcar.Odometer.dto, dtoName: "odometer" });
  }
}
