import { ListDataSyncConnector } from "./listConnector";
import { DataSyncExecutorMock } from "../dataSyncExecutor/mock";
import { TooManyIterationsError } from "@ansik/sdk/lib/errors";
import { makeUuid } from "@ansik/sdk/lib/utils";

describe("ListConnector", () => {
  it.todo("accepts a request and redirect to an executor");
  it.todo("executor fails to handle a request");
  it("request timeout", async () => {
    const connector = new ListDataSyncConnector({
      timeoutMilliseconds: 10,
      retryLimit: 3
    });
    const executor = new DataSyncExecutorMock();

    connector.setRequestExecutor(async request => {
      await Promise.delay(200);
      return executor.processDataSyncRequest(request);
    });

    const request = {
      meta: { dataSyncRequestId: "dataSyncRequestId" },
      data: { vehicleId: "vehicleId", accessToken: "accessToken", shopId: 1 }
    };
    await connector.acceptRequest(request);
    await expect(connector.executeRequest()).rejects.toThrow(TooManyIterationsError);
  });
  describe("retry mechanism", () => {
    it("executor fails for the first time, then retry and pass", async () => {
      const connector = new ListDataSyncConnector({
        timeoutMilliseconds: 1000,
        retryLimit: 3
      });
      const executor = new DataSyncExecutorMock();
      const spy = jest.spyOn(executor, "processDataSyncRequest");
      spy.mockImplementationOnce(async () => {
        throw new Error("foo");
      });

      connector.setRequestExecutor(async (...args) => {
        return executor.processDataSyncRequest(...args);
      });

      const request = {
        meta: { dataSyncRequestId: makeUuid() },
        data: { vehicleId: makeUuid(), accessToken: makeUuid(), shopId: 1 }
      };
      await connector.acceptRequest(request);
      expect(await connector.executeRequest()).toEqual({
        meta: {
          timestamp: expect.any(String),
          dataSyncRequestId: request.meta.dataSyncRequestId
        },
        data: { status: "ok" }
      });
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it("max retry limit", async () => {
      const connector = new ListDataSyncConnector({
        timeoutMilliseconds: 1000,
        retryLimit: 3
      });
      const executor = new DataSyncExecutorMock();
      const spy = jest.spyOn(executor, "processDataSyncRequest").mockImplementation(async () => {
        throw new Error("foo");
      });

      connector.setRequestExecutor(async (...args) => executor.processDataSyncRequest(...args));

      const request = {
        meta: { dataSyncRequestId: "dataSyncRequestId" },
        data: { vehicleId: "vehicleId", accessToken: "accessToken", shopId: 1 }
      };
      await connector.acceptRequest(request);
      await expect(connector.executeRequest()).rejects.toThrow(TooManyIterationsError);
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });
});
