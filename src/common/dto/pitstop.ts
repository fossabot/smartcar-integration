import t = require("io-ts");

export namespace PitstopClientNS {
  export namespace Client {
    export namespace CreateCarReqDto {
      export const dto = t.type({
        vin: t.string,
        make: t.string,
        model: t.string,
        year: t.number,
        mileage: t.number,
        shopId: t.number
      });
      export type Type = t.TypeOf<typeof dto>;
    }
    export namespace GetCarByVinReqDto {
      export const dto = t.type({
        vin: t.string
      });
      export type Type = t.TypeOf<typeof dto>;
    }
    export namespace CarResDto {
      export const dto = t.type({
        id: t.number,
        vin: t.string,
        totalMileage: t.number
      });
      export type Type = t.TypeOf<typeof dto>;
    }
  }

  export namespace Api {
    export namespace GetCarByVin {
      export namespace Request {
        export const dto = t.type({
          vin: t.string
        });
        export type Type = t.TypeOf<typeof dto>;
      }
      export namespace Response {
        export const dto = t.type({
          id: t.number,
          vin: t.string,
          totalMileage: t.string
        });
        export type Type = t.TypeOf<typeof dto>;
      }
    }

    export namespace CreateCar {
      export namespace Request {
        export const dto = t.type({
          vin: t.string,
          make: t.string,
          model: t.string,
          year: t.number,
          baseMileage: t.number,
          totalMileage: t.number,
          shopId: t.number,
          vinCorrection: t.boolean,
          ignoreVinDecodingFailure: t.boolean
        });
        export type Type = t.TypeOf<typeof dto>;
      }
      export namespace Response {
        export const dto = t.type({
          id: t.number,
          vin: t.string,
          totalMileage: t.string
        });
        export type Type = t.TypeOf<typeof dto>;
      }
    }

    export namespace UpdateCarOdometer {
      export namespace Request {
        export const dto = t.type({
          totalMileage: t.number
        });
        export type Type = t.TypeOf<typeof dto>;
      }
    }
  }
}
