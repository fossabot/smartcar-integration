import { Integration } from "../common/dto/integration";
import { getDebuggr } from "../common/logger";
import { SmartcarDataSyncRequest } from "../common/dto/smartcarDataSyncRequest";
import { makeUuid } from "@ansik/sdk/lib/utils";
import { EventEmitter } from "events";
import { DataSyncSchedulerOptions } from "../common/interfaces/dataSyncScheduler";
import _ = require("lodash");

const log = getDebuggr("SmartcarClient");

export class DataSyncScheduler {
  static readonly DATA_SYNC_REQ_READY = "dataSyncReqReady";

  readonly emitter = new EventEmitter();

  constructor(private readonly options: DataSyncSchedulerOptions) {
    this.emitter.addListener(DataSyncScheduler.DATA_SYNC_REQ_READY, request => this.onDataSyncRequestReady(request));
  }

  private async onDataSyncRequestReady(request: SmartcarDataSyncRequest.Type): Promise<void> {
    const { dataSyncConnector } = this.options;
    await dataSyncConnector.acceptRequest(request);
  }

  async run(): Promise<void> {
    const { persistenceLayer } = this.options;
    const integrationRecords = await persistenceLayer.getIntegrationRecords();
    await Promise.map(integrationRecords, record => this.prepareFromIntegrationRecord(record), {
      concurrency: 1 // fixme: hard coded
    });
  }

  private async prepareFromIntegrationRecord(
    integrationRecord: Integration.SmartcarIntegrationRecord.Type
  ): Promise<void> {
    const { smartcarClient } = this.options;

    log.debug("exchange access token");
    const accessToken = await smartcarClient.tokenExchange(integrationRecord);
    log.debug("access token exchanged");
    log.debug("fetching vehicle ids");
    const vehicleList = await smartcarClient.getVehicleList();
    log.debug(`# of vehicleIds fetched: ${vehicleList.vehicles.length}`);

    _.each(vehicleList.vehicles, vehicleId => {
      const request: SmartcarDataSyncRequest.Type = {
        meta: { dataSyncRequestId: makeUuid() },
        data: { vehicleId, accessToken, shopId: integrationRecord.shopId }
      };
      this.emitter.emit(DataSyncScheduler.DATA_SYNC_REQ_READY, request);
    });
  }
}
