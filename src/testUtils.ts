import Knex = require("knex");

export async function fixtureSetup(connection: Knex) {
  await connection.transaction(async t => {
    await t.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    if (!(await t.schema.hasTable("car"))) {
      await t.schema.createTable("car", builder => {
        builder.integer("id");
        builder.primary(["id"]);
        builder.text("vin").notNullable();
        builder.text("car_make");
        builder.text("car_model");
        builder.integer("car_year");
        builder.decimal("mileage_total", 17, 3);
        builder.unique(["vin"]);
      });
    }

    if (!(await t.schema.hasTable("shop"))) {
      await t.schema.createTable("shop", builder => {
        builder.integer("id");
        builder.primary(["id"]);
      });
    }

    if (!(await t.schema.hasTable("integration_shop_smartcar"))) {
      await t.schema.createTable("integration_shop_smartcar", builder => {
        builder.text("id").defaultTo(connection.raw("uuid_generate_v4()"));
        builder.integer("id_shop");
        builder.text("alias");
        builder.text("refresh_token");
        builder.timestamp("default_migration_start_timestamp", { useTz: true });
        builder.timestamp("created_at", { useTz: true }).defaultTo(connection.raw("now()"));
        builder.primary(["id_shop", "alias"]);
      });
    }
  });
}

export async function fixtureCleanup(connection: Knex) {
  await connection.transaction(async t => {
    await t.schema.dropTableIfExists("shop");
    await t.schema.dropTableIfExists("integration_shop_smartcar");
  });
}
