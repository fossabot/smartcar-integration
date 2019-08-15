import { Runtime } from "@ansik/sdk/dist/runtime";

const debug = Runtime.GetInstance().debuggerFactory.getDebugger("SmartcarMock");

type Access = {
    expiration: Date;
    accessToken: string;
    refreshToken: string;
    refreshExpiration: Date;
};

export class SmartcarAuthClientMock {
    // noinspection JSMethodCanBeStatic
    async exchangeRefreshToken(refreshToken: string): Promise<Access> {
        debug(`refresh token: ${refreshToken}`);
        return {
            expiration: new Date(),
            accessToken: "access token",
            refreshToken: "refresh token",
            refreshExpiration: new Date()
        };
    }
}
