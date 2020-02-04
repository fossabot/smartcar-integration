import _ from "lodash";
import { Configuration, ConfigurationLoader } from "@ansik/sdk/lib/configurationLoader";
import { KnexQueryExecutor } from "@ansik/sdk/lib/sql/queryExecutor";
import {
  configuration,
  DataSyncExecutor,
  DataSyncScheduler,
  Dto,
  ListDataSyncConnector,
  Log,
  PersistenceLayer,
  Vendors
} from "../src";
import { fixtureCleanup, fixtureSetup } from "../src/testUtils";
import Knex = require("knex");

const log = Log.getDebugger("e2e test");

describe("e2e test", () => {
  jest.setTimeout(20000);

  let config: Configuration;
  let connection: Knex;
  let knexQueryExecutor: KnexQueryExecutor;

  beforeAll(async () => {
    const confPath = process.env["CONF_PATH"];
    if (!confPath) throw new Error("must set CONF_PATH");
    config = await new ConfigurationLoader().loadFrom({
      confEntries: configuration,
      confPath
    });
  });
  beforeEach(async () => {
    connection = Knex(config.get("persistenceLayer.queryExecutor.knexClientOptions"));
    knexQueryExecutor = new KnexQueryExecutor(<any>connection);
    await fixtureCleanup(knexQueryExecutor["knexInstance"]);
    await fixtureSetup(knexQueryExecutor["knexInstance"]);
  });
  afterEach(async () => {
    knexQueryExecutor && (await knexQueryExecutor.close());
  });

  it("creates and integration record, then migrate data from one vehicle", async () => {
    log.debug("instantiation");
    const persistenceLayer = new PersistenceLayer({ queryExecutor: knexQueryExecutor });
    const smartcarClient = new Vendors.SmartcarClient({ persistenceLayer, client: config.get("smartcar") });
    const dataSyncConnector = new ListDataSyncConnector({
      timeoutMilliseconds: 20000,
      maxCallTimes: 3
    });
    const pitstopClient = new Vendors.PitstopClient({
      baseUrl: config.get("pitstop.baseUrl"),
      clientId: config.get("pitstop.clientId"),
      apiKey: config.get("pitstop.apiKey")
    });

    const vehicles = config.get("test.context.vehicles");

    // authorization
    await (async () => {
      log.debug("authorization test: start");

      log.debug("authorization code exchange");
      const authorizationCode = config.get("test.context.authorizationCode");
      log.debug(`authorization code: ${authorizationCode}`);
      const refreshToken = await smartcarClient.authorizationCodeExchange(authorizationCode);
      log.debug(`refresh token: ${refreshToken}`);
      log.debug("insert integration record");
      await persistenceLayer.addIntegrationRecord({ id_shop: 1, alias: "a", refresh_token: refreshToken });

      log.debug("authorization test: done");
    })();

    // scheduler
    await (async () => {
      log.debug("scheduler test: start");

      const scheduler = new DataSyncScheduler({ persistenceLayer, smartcarClient, pitstopClient, dataSyncConnector });
      await scheduler.run();
      await Promise.delay(1000);

      const accessToken = smartcarClient.accessToken;
      expect(typeof accessToken).toBe("string");
      expect(accessToken).not.toEqual("");

      const requests = dataSyncConnector["requestList"];
      expect(requests.length).toEqual(vehicles.length);
      _.each(vehicles, vehicle => {
        expect(requests).toContainEqual(<Dto.SmartcarDataSync.SmartcarDataSyncRequest.Type>{
          meta: {
            dataSyncRequestId: expect.any(String)
          },
          data: {
            vehicleId: vehicle.vehicleId,
            accessToken: accessToken,
            shopId: 1
          }
        });
      });
      /**
       * each request should have different meta.dataSyncRequestIdø
       */
      expect(
        _.chain(requests)
          .map(request => _.get(request, "meta.dataSyncRequestId"))
          .uniq()
          .value()
      ).toHaveLength(vehicles.length);

      log.debug("scheduler test: done");
    })();

    // connector
    // todo

    // executor
    await (async () => {
      log.debug("executor test: start");
      const executor = new DataSyncExecutor({ persistenceLayer, dataSyncConnector, smartcarClient, pitstopClient });
      expect(dataSyncConnector.requestCount()).toEqual(vehicles.length);
      executor.setup();

      await expect(
        (async () => {
          while (dataSyncConnector.requestCount()) await dataSyncConnector.executeRequest();
        })()
      ).resolves.not.toThrow();

      const vehiclesFromApi = _.chain(
        await Promise.map(
          vehicles,
          async vehicle => {
            const car = await pitstopClient.getCarByVin({ vin: _.get(vehicle, "vin") });
            return car && { vin: car.vin, totalMileage: car.totalMileage };
          },
          {
            concurrency: 1
          }
        )
      )
        .compact()
        .value();

      _.each(vehiclesFromApi, vehicleFromApi => {
        expect(typeof vehicleFromApi.totalMileage).toBe("number");
        expect(vehicleFromApi.totalMileage).toBeGreaterThan(0);
        expect(_.map(vehicles, vehicle => vehicle.vin)).toContainEqual(vehicleFromApi.vin);
      });

      log.debug("executor test: done");
    })();
  });
});
