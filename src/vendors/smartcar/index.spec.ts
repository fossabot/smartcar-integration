import { SmartcarClient } from "./index";
import { PersistenceLayerMock } from "../../persistenceLayer/mock";
import { InvalidStateError } from "../../common/errors";

describe("smartcar client", () => {
  describe("authenticate()", () => {
    const persistenceLayer = new PersistenceLayerMock();
    const updateRefreshTokenSpy = jest.spyOn(persistenceLayer, "updateRefreshToken");
    let client: SmartcarClient;
    let makeAuthClientSpy: jest.SpyInstance;

    beforeEach(() => {
      client = new SmartcarClient({ persistenceLayer, client: { clientId: "", clientSecret: "" } });
      makeAuthClientSpy = jest.spyOn(client, "makeAuthClient");
      updateRefreshTokenSpy.mockReset();
    });

    it("usage", async () => {
      makeAuthClientSpy.mockImplementation(() => ({
        exchangeRefreshToken: jest.fn(async () => ({
          access_token: "11016e76-610c-41c6-9688-1f5613889932",
          token_type: "Bearer",
          expires_in: 7200,
          refresh_token: "09337f8a-da3a-46c0-95e7-9c19180b06c0"
        }))
      }));

      const integrationRecord = { integrationId: "id", refreshToken: "abc" };
      await expect(client.getAccessToken(integrationRecord)).resolves.toEqual("11016e76-610c-41c6-9688-1f5613889932");
      expect(updateRefreshTokenSpy).toHaveBeenCalledTimes(1);
      expect(updateRefreshTokenSpy).toHaveBeenCalledWith(integrationRecord, "09337f8a-da3a-46c0-95e7-9c19180b06c0");
    });
    xit("invalid clientId or clientSecret", async () => {
      // todo
    });
    it("authentication failed", async () => {
      makeAuthClientSpy.mockImplementation(() => ({
        exchangeRefreshToken: jest.fn(async () => {
          throw new Error("mock");
        })
      }));

      const integrationRecord = { integrationId: "id", refreshToken: "abc" };
      await expect(client.getAccessToken(integrationRecord)).rejects.toThrow("mock");
    });
    it("authentication passed but has no access token", async () => {
      makeAuthClientSpy.mockImplementation(() => ({
        exchangeRefreshToken: jest.fn(async () => ({
          token_type: "Bearer",
          expires_in: 7200,
          refresh_token: "09337f8a-da3a-46c0-95e7-9c19180b06c0"
        }))
      }));

      const integrationRecord = { integrationId: "id", refreshToken: "abc" };
      await expect(client.getAccessToken(integrationRecord)).rejects.toThrow(new InvalidStateError());
    });
    it("authentication passed but has no refresh token", async () => {
      makeAuthClientSpy.mockImplementation(() => ({
        exchangeRefreshToken: jest.fn(async () => ({
          access_token: "11016e76-610c-41c6-9688-1f5613889932",
          token_type: "Bearer",
          expires_in: 7200
        }))
      }));

      const integrationRecord = { integrationId: "id", refreshToken: "abc" };

      await expect(client.getAccessToken(integrationRecord)).resolves.not.toThrow();
      expect(updateRefreshTokenSpy).not.toHaveBeenCalled();
      expect(persistenceLayer.updateRefreshToken).not.toHaveBeenCalled();
    });
  });
});
