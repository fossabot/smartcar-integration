import { IPersistenceLayer, PersistenceLayerOptions } from "../common/interfaces/persistenceLayer";
import { SmartcarDataSyncResult, SmartcarVehicleRelation } from "../common/dto/smartcarDataSync";
import { Integration } from "../common/dto/integration";
import { DBSchema } from "../common/dto/dbSchema";
import _ from "lodash";
import { getDebugger } from "../common/logger";
import Knex = require("knex");
import IntegrationRecord = DBSchema.IntegrationRecord;
import SmartcarIntegrationRecord = Integration.SmartcarIntegrationRecord;

const log = getDebugger("persistenceLayer");

export class PersistenceLayer implements IPersistenceLayer {
  private readonly knex = Knex({ client: "postgres" });

  constructor(private readonly options: PersistenceLayerOptions) {}

  async addIntegrationRecord(record: Omit<IntegrationRecord.Type, "id">): Promise<void> {
    const knex = this.knex;

    const query = knex.insert(record).into(IntegrationRecord.tableName);
    await this.executeQuery(query);
  }

  async getIntegrationRecords(): Promise<Integration.SmartcarIntegrationRecord.Type[]> {
    const knex = this.knex;
    const limit = 2000; // fixme: hard coded

    const query = knex
      .select(["id", "refresh_token", "id_shop"])
      .from(IntegrationRecord.tableName)
      .limit(limit);
    const queryResults = await this.executeQuery(query);

    return _.chain(queryResults)
      .map(item => {
        const parsed = Integration.SmartcarIntegrationRecord.dto.decode(<SmartcarIntegrationRecord.Type>{
          integrationId: _.get(item, "id"),
          refreshToken: _.get(item, "refresh_token"),
          shopId: _.get(item, "id_shop")
        });
        if (parsed.isLeft()) {
          log.debug("failed to decode integration record:");
          log.debug(item);
          return undefined;
        }

        return parsed.value;
      })
      .compact()
      .value();
  }

  async updateRefreshToken(
    integrationRecord: Integration.SmartcarIntegrationRecord.Type,
    newRefreshToken: Integration.SmartcarIntegrationRecord.Type["refreshToken"]
  ): Promise<void> {
    // todo
    const knex = this.knex;

    const query = knex(IntegrationRecord.tableName)
      .update({ refresh_token: newRefreshToken })
      .where({ id: integrationRecord.integrationId });
    await this.executeQuery(query);
  }

  async updateDataSyncStatus(
    vehicle: SmartcarVehicleRelation.Type,
    result: SmartcarDataSyncResult.Type
  ): Promise<void> {
    // todo
    console.log(vehicle, result);
    return undefined;
  }

  private async executeQuery(query: Knex.QueryBuilder): Promise<any> {
    const { queryExecutor } = this.options;
    const { sql, bindings } = query.toSQL();
    return queryExecutor.query(sql, bindings);
  }
}
