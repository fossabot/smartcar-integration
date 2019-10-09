// @ts-ignore
import smartcar = require("smartcar");
import { ISmartCarClient } from "../../common/interfaces/smartcar";
import { Smartcar } from "../../common/dto/smartcar";
import { SmartCarApiResponse } from "../../common/dto/smartcarAPI";
import { IPersistenceLayer } from "../../common/interfaces/persistenceLayer";
import { Integration } from "../../common/dto/integration";
import { getDebuggr } from "../../common/logger";

const debug = getDebuggr("SmartcarClient");

export class SmartcarClient implements ISmartCarClient {
  constructor(
    private readonly options: {
      persistenceLayer: IPersistenceLayer;
      client: {
        clientId: string;
        clientSecret: string;
      };
    }
  ) {}

  async getAccessToken(integrationRecord: Integration.SmartcarIntegrationRecord.Type): Promise<string> {
    const tokenExchangeResult = await this.authenticate(integrationRecord.refreshToken);
    if (!tokenExchangeResult.refresh_token) {
      debug.warn("no refresh token in token exchange result, integration record: ", integrationRecord);
    } else {
      await this.options.persistenceLayer.updateRefreshToken(integrationRecord, tokenExchangeResult.refresh_token);
    }

    return tokenExchangeResult.access_token;
  }

  /**
   * this method exchanges for a new access token and a new refresh token, then updates the existing refresh token to the new one.
   * see https://smartcar.com/docs/api?language=cURL#refresh-token-exchange
   */
  private async authenticate(refreshToken: string): Promise<SmartCarApiResponse.TokenExchange.Type> {
    const tokenExchangeResponse = await this.makeAuthClient().exchangeRefreshToken(refreshToken);
    const tokenExchangeResponseDecoded = SmartCarApiResponse.TokenExchange.dto.decode(tokenExchangeResponse);

    if (tokenExchangeResponseDecoded.isLeft()) {
      throw new Error(); // todo: error handling
    }

    return tokenExchangeResponseDecoded.value;
  }

  /**
   * exposed for unit test
   */
  makeAuthClient(): smartcar.AuthClient {
    return new smartcar.AuthClient({
      clientId: this.options.client.clientId,
      clientSecret: this.options.client.clientSecret,
      redirectUri: "",
      scope: []
    });
  }

  getVehicle(): Promise<Smartcar.Vehicle.Type> {
    // todo
    return <any>{};
  }
}
