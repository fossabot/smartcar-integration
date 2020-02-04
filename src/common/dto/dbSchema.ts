import t = require("io-ts");

export namespace DBSchema {
  export namespace IntegrationRecord {
    export const tableName = "integration_shop_smartcar";
    export const dto = t.type({
      id: t.string,
      id_shop: t.number,
      refresh_token: t.string,
      alias: t.string
    });
    export type Type = t.TypeOf<typeof dto>;
  }

  export namespace Car {
    export const tableName = "car";
    export const dto = t.type({
      vin: t.string,
      car_make: t.string,
      car_model: t.string,
      car_year: t.number,
      mileage_total: t.number
    });
    export type Type = t.TypeOf<typeof dto>;
  }
}
