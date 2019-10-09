import t = require("io-ts");

export namespace Smartcar {
  export namespace Vehicle {
    export const dto = t.type({
      // fixme: add other properties to identify the vehicle (e.g. vin)
      odometer: t.number
    });
    export type Type = t.TypeOf<typeof dto>;
  }
}
