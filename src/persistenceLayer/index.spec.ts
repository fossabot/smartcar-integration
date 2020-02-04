import { PersistenceLayer } from "./index";
import { KnexQueryExecutor } from "@ansik/sdk/lib/sql/queryExecutor";
import { DBSchema } from "../common/dto/dbSchema";
import { fixtureCleanup, fixtureSetup } from "../testUtils";
import Knex = require("knex");
import IntegrationRecord = DBSchema.IntegrationRecord;

const DB_NAME = "local-test";

describe("PersistenceLayer", () => {
  let connection: Knex;
  let queryExecutor: KnexQueryExecutor;
  beforeEach(async () => {
    connection = Knex({ client: "postgres", connection: `postgres://localhost/${DB_NAME}` });
    await fixtureCleanup(connection);
    await fixtureSetup(connection);
    queryExecutor = new KnexQueryExecutor(<any>connection);
  });
  afterEach(async () => {
    await queryExecutor.close();
  });
  describe("addIntegrationRecord", () => {
    it("inserts an integration record", async () => {
      const persistenceLayer = new PersistenceLayer({ queryExecutor });
      const integrationRecord = { id_shop: 1, alias: "abc", refresh_token: "2" };
      await persistenceLayer.addIntegrationRecord(integrationRecord);
      // noinspection SqlResolve
      const inserted = await queryExecutor.query(
        `select "id_shop", "alias", "refresh_token" from ${IntegrationRecord.tableName}`
      );
      expect(inserted).toEqual([{ id_shop: 1, alias: "abc", refresh_token: "2" }]);
    });
  });
  describe("getIntegrationRecords", () => {
    it("gets all integration records", async () => {
      // stub data
      const stubQuery = connection
        .insert([
          { id_shop: 1, alias: "abc", refresh_token: "2" },
          { id_shop: 2, alias: "abc", refresh_token: "3" },
          { id_shop: 1, alias: "def", refresh_token: "4" }
        ])
        .into(IntegrationRecord.tableName)
        .toSQL();
      await queryExecutor.query(stubQuery.sql, stubQuery.bindings);

      const persistenceLayer = new PersistenceLayer({ queryExecutor });
      const records = await persistenceLayer.getIntegrationRecords();
      expect(records).toHaveLength(3);
      expect(records).toContainEqual({ integrationId: expect.any(String), refreshToken: "2", shopId: 1 });
      expect(records).toContainEqual({ integrationId: expect.any(String), refreshToken: "3", shopId: 2 });
      expect(records).toContainEqual({ integrationId: expect.any(String), refreshToken: "4", shopId: 1 });
    });
  });
});
