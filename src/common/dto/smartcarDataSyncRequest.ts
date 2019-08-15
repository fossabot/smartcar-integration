import t = require("io-ts");

export namespace SmartcarUserRelation {
    export const dto = t.type({
        id: t.string,
        userId: t.number,
        refreshToken: t.string
    });

    export type Type = t.TypeOf<typeof dto>;
}

export namespace SmartcarDataSyncRequest {
    export const dto = t.type({
        id: t.string,
        userId: t.number,
        refreshToken: t.string
    });

    export type Type = t.TypeOf<typeof dto>;
}

export namespace SmartcarDataSyncResult {
    export const dto = t.type({
        meta: t.type({
            timestamp: t.string,
            request: SmartcarUserRelation.dto
        }),
        data: t.intersection([
            t.type({
                status: t.union([t.literal("ok"), t.literal("error")]),
                message: t.string
            }),
            t.partial({
                errors: t.array(
                    t.type({
                        name: t.string,
                        message: t.string
                    })
                )
            })
        ])
    });

    export type Type = t.TypeOf<typeof dto>;
}
