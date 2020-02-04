import { SmartcarClient } from "./index";
import { PersistenceLayerMock } from "../../persistenceLayer/mock";
import { InvalidStateError } from "../../common/errors";

describe("smartcar client", () => {
  describe("auth", () => {
    it.todo("authorizationCodeExchange()");
    describe("authenticate()", () => {
      const persistenceLayer = new PersistenceLayerMock();
      const updateRefreshTokenSpy = jest.spyOn(persistenceLayer, "updateRefreshToken");
      let client: SmartcarClient;
      let makeAuthClientSpy: jest.SpyInstance;

      beforeEach(() => {
        client = new SmartcarClient({ persistenceLayer, client: { clientId: "", clientSecret: "", redirectUri: "" } });
        makeAuthClientSpy = jest.spyOn(client, "makeAuthClient");
        updateRefreshTokenSpy.mockReset();
      });

      it("usage", async () => {
        makeAuthClientSpy.mockImplementation(() => ({
          exchangeRefreshToken: jest.fn(async () => {
            return {
              accessToken: "11016e76-610c-41c6-9688-1f5613889932",
              refreshToken: "09337f8a-da3a-46c0-95e7-9c19180b06c0"
            };
          })
        }));

        const integrationRecord = { integrationId: "id", refreshToken: "abc", shopId: 1 };
        const accessToken = await client.tokenExchange(integrationRecord);
        expect(accessToken).toEqual("11016e76-610c-41c6-9688-1f5613889932");
        expect(updateRefreshTokenSpy).toHaveBeenCalledTimes(1);
        expect(updateRefreshTokenSpy).toHaveBeenCalledWith(integrationRecord, "09337f8a-da3a-46c0-95e7-9c19180b06c0");
      });
      it.todo("invalid clientId or clientSecret");
      it("authentication failed", async () => {
        makeAuthClientSpy.mockImplementation(() => ({
          exchangeRefreshToken: jest.fn(async () => {
            throw new Error("mock");
          })
        }));

        const integrationRecord = { integrationId: "id", refreshToken: "abc", shopId: 1 };
        await expect(client.tokenExchange(integrationRecord)).rejects.toThrow("mock");
      });
      it("authentication passed but has no access token", async () => {
        makeAuthClientSpy.mockImplementation(() => ({
          exchangeRefreshToken: jest.fn(async () => ({
            refreshToken: "09337f8a-da3a-46c0-95e7-9c19180b06c0"
          }))
        }));

        const integrationRecord = { integrationId: "id", refreshToken: "abc", shopId: 1 };
        await expect(client.tokenExchange(integrationRecord)).rejects.toThrow(
          new InvalidStateError("failed to decode token exchange response")
        );
      });
      it("authentication passed but has no refresh token", async () => {
        makeAuthClientSpy.mockImplementation(() => ({
          exchangeRefreshToken: jest.fn(async () => ({
            accessToken: "11016e76-610c-41c6-9688-1f5613889932"
          }))
        }));

        const integrationRecord = { integrationId: "id", refreshToken: "abc", shopId: 1 };

        await expect(client.tokenExchange(integrationRecord)).rejects.toThrow(
          new InvalidStateError("failed to decode token exchange response")
        );
        expect(updateRefreshTokenSpy).not.toHaveBeenCalled();
        expect(persistenceLayer.updateRefreshToken).not.toHaveBeenCalled();
      });
    });
  });
  describe("methods", () => {
    it.todo("getVehicleIds()");
    describe("getVehicleById()", () => {
      it.todo("usage");
      it.todo("invalid vehicle id");
    });
  });
});
