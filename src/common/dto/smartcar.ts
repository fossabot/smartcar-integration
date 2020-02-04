import t = require("io-ts");
import { DateFromISOString } from "io-ts-types/lib/DateFromISOString";

/**
 * smartcar DTO schemas
 */
export namespace Smartcar {
  export namespace TokenExchange {
    export const dto = t.type({
      accessToken: t.string,
      refreshToken: t.string
    });
    export type Type = t.TypeOf<typeof dto>;
  }

  export namespace VehicleList {
    export const dto = t.type({
      vehicles: t.array(t.string)
      // paging: t.unknown // fixme: support paging
    });
    export type Type = t.TypeOf<typeof dto>;
  }

  export namespace Vin {
    export const dto = t.string;
    export type Type = t.TypeOf<typeof dto>;
  }

  export namespace VehicleAttributes {
    export const dto = t.type({
      make: t.string,
      model: t.string,
      year: t.number
    })
    export type Type = t.TypeOf<typeof dto>;
  }

  export namespace Odometer {
    export const dto = t.type({
      data: t.type({
        distance: t.number
      }),
      age: t.union([t.null, DateFromISOString]),
      unitSystem: t.string
    });
    export type Type = t.TypeOf<typeof dto>;
  }
}
