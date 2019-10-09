import t = require("io-ts");

export namespace SmartCarApiResponse {
  export namespace TokenExchange {
    export const dto = t.intersection([
      t.type({
        access_token: t.string
      }),
      t.partial({
        refresh_token: t.string,
        token_type: t.string,
        expires_in: t.number
      })
    ]);
    export type Type = t.TypeOf<typeof dto>;
  }

  export namespace Odometer {
    export const dto = t.type({
      data: t.type({
        distance: t.number
      })
    });
    export type Type = t.TypeOf<typeof dto>;
  }
}
