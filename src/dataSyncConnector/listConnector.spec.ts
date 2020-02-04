import { ListDataSyncConnector } from "./listConnector";
import { DataSyncExecutorMock } from "../dataSyncExecutor/mock";
import { TooManyIterationsError } from "@ansik/sdk/lib/errors";
import { makeUuid } from "@ansik/sdk/lib/utils";
import { SmartcarDataSyncRequest } from "../common/dto/smartcarDataSync";
import _ from "lodash";

describe("ListConnector", () => {
  it("accepts a request and redirect to an executor", async () => {
    const connector = new ListDataSyncConnector({
      timeoutMilliseconds: 3000,
      maxCallTimes: 3
    });
    const executor = new DataSyncExecutorMock();
    connector.setRequestExecutor((...args) => executor.processDataSyncRequest(...args));
    const spy = jest.spyOn(executor, "processDataSyncRequest");

    const request = {
      meta: { dataSyncRequestId: makeUuid() },
      data: { vehicleId: makeUuid(), accessToken: makeUuid(), shopId: 1 }
    };
    await connector.acceptRequest(request);
    await expect(connector.executeRequest()).resolves.not.toThrow();
    expect(spy).toHaveBeenCalledWith(request);
  });
  it("executor fails to handle a request", async () => {
    const connector = new ListDataSyncConnector({
      timeoutMilliseconds: 3000,
      maxCallTimes: 3
    });
    const executor = new DataSyncExecutorMock();
    connector.setRequestExecutor((...args) => executor.processDataSyncRequest(...args));
    const spy = jest.spyOn(executor, "processDataSyncRequest");
    spy.mockImplementation(async () => {
      throw new Error("foo");
    });
    await connector.acceptRequest({
      meta: { dataSyncRequestId: makeUuid() },
      data: { vehicleId: makeUuid(), accessToken: makeUuid(), shopId: 1 }
    });
    await expect(connector.executeRequest()).rejects.toThrow(TooManyIterationsError);
    expect(spy).toHaveBeenCalledTimes(3);
  });
  it("failed handling shouldn't affect other requests", async () => {
    const connector = new ListDataSyncConnector({
      timeoutMilliseconds: 1000,
      maxCallTimes: 1
    });
    const executor = new DataSyncExecutorMock();
    connector.setRequestExecutor((...args) => executor.processDataSyncRequest(...args));
    const spy = jest.spyOn(executor, "processDataSyncRequest");
    spy.mockImplementation(async request => ({
      meta: {
        timestamp: new Date().toISOString(),
        request
      },
      data: { status: "ok" }
    }));
    spy.mockImplementationOnce(async () => {
      throw new Error("foo");
    });

    const requests: SmartcarDataSyncRequest.Type[] = [
      {
        meta: { dataSyncRequestId: makeUuid() },
        data: { vehicleId: makeUuid(), accessToken: makeUuid(), shopId: 1 }
      },
      {
        meta: { dataSyncRequestId: makeUuid() },
        data: { vehicleId: makeUuid(), accessToken: makeUuid(), shopId: 1 }
      }
    ];

    _.each(requests, request => connector.acceptRequest(request));

    const result = await connector.executeAll();
    expect(spy).toHaveBeenCalledTimes(2);
    expect(result.error).toHaveLength(1);
    expect(result.error).toContainEqual({
      request: requests[0],
      result: {
        meta: { timestamp: expect.any(String), request: requests[0] },
        data: { status: "error", errors: [expect.any(TooManyIterationsError)] }
      }
    });
    expect(result.ok).toHaveLength(1);
    expect(result.ok).toContainEqual({
      request: requests[1],
      result: {
        meta: { timestamp: expect.any(String), request: requests[1] },
        data: { status: "ok" }
      }
    });
  });
  it("request timeout", async () => {
    const connector = new ListDataSyncConnector({
      timeoutMilliseconds: 10,
      maxCallTimes: 3
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
        maxCallTimes: 3
      });
      const executor = new DataSyncExecutorMock();
      const spy = jest.spyOn(executor, "processDataSyncRequest");
      spy.mockImplementation(async request => ({
        meta: {
          timestamp: new Date().toISOString(),
          dataSyncRequestId: request.meta.dataSyncRequestId,
          request: request
        },
        data: { status: "ok" }
      }));
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
          dataSyncRequestId: request.meta.dataSyncRequestId,
          request
        },
        data: { status: "ok" }
      });
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it("max retry limit", async () => {
      const connector = new ListDataSyncConnector({
        timeoutMilliseconds: 1000,
        maxCallTimes: 3
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
