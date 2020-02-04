import { ConfigurationLoader } from "@ansik/sdk/lib/configurationLoader";
import { KnexQueryExecutor } from "@ansik/sdk/lib/sql/queryExecutor";
import Knex from "knex";
import {
  configuration,
  DataSyncExecutor,
  DataSyncScheduler,
  ListDataSyncConnector,
  Log,
  PersistenceLayer,
  Vendors
} from "../index";

const log = Log.getDebugger("entryPoint-standalone");

export async function run() {
  log.debug("starting standalone migration");
  log.debug("check for configurations");
  const confPath = process.env["CONF_PATH"];
  if (!confPath) throw new Error("must specify environment variable CONF_PATH");
  const config = await new ConfigurationLoader().loadFrom({ confPath, confEntries: configuration });
  log.info("configuration loaded");

  log.debug("set up instances");
  const connection = Knex(config.get("persistenceLayer.queryExecutor.knexClientOptions"));
  const knexQueryExecutor = new KnexQueryExecutor(<any>connection);
  const persistenceLayer = new PersistenceLayer({ queryExecutor: knexQueryExecutor });

  const smartcarClient = new Vendors.SmartcarClient({ persistenceLayer, client: config.get("smartcar") });
  const pitstopClient = new Vendors.PitstopClient({
    baseUrl: config.get("pitstop.baseUrl"),
    clientId: config.get("pitstop.clientId"),
    apiKey: config.get("pitstop.apiKey")
  });

  const dataSyncConnector = new ListDataSyncConnector({
    timeoutMilliseconds: 10000, // fixme: hard coded
    maxCallTimes: 3 // fixme: hard coded
  });
  const dataSyncScheduler = new DataSyncScheduler({
    smartcarClient,
    pitstopClient,
    persistenceLayer,
    dataSyncConnector
  });
  const dataSyncExecutor = new DataSyncExecutor({ pitstopClient, smartcarClient, persistenceLayer, dataSyncConnector });
  dataSyncExecutor.setup();
  log.info("instances created");

  log.debug("generating data sync requests");
  await dataSyncScheduler.run();
  log.info("data sync requests scheduled");
  await dataSyncConnector.executeAll();
  log.info("data sync requests processed");
}

run()
  .then(() => log.info("done"))
  .catch(console.error);
