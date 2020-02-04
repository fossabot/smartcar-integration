import { PitstopClient } from "./index";
import nock from "nock";
import _ from "lodash";

describe("PitstopClient", () => {
  const host = "http://my.pitstop.api";
  afterEach(() => {
    nock.cleanAll();
  });
  describe("getCarByVin", () => {
    it("response has one car", async () => {
      const vin = "vin";
      const client = new PitstopClient({ baseUrl: host, clientId: "", apiKey: "" });
      const mockResponse = GetCarResponseOneCar;
      nock(host)
        .get(`/v1/car?vin=${vin}`)
        .reply(200, mockResponse);

      const car = await client.getCarByVin({ vin });
      expect(car).toEqual({
        id: mockResponse.result[0].id,
        vin: mockResponse.result[0].vin,
        totalMileage: Number(mockResponse.result[0].totalMileage)
      });
    });
    it("response has two cars", async () => {
      const vin = "vin";
      const client = new PitstopClient({ baseUrl: host, clientId: "", apiKey: "" });
      const mockResponse = GetCarResponseMultiCar;
      nock(host)
        .get(`/v1/car?vin=${vin}`)
        .reply(200, mockResponse);

      const car = await client.getCarByVin({ vin });
      expect(car).toEqual({
        id: mockResponse.result[0].id,
        vin: mockResponse.result[0].vin,
        totalMileage: Number(mockResponse.result[0].totalMileage)
      });
    });
    it("response has no cars", async () => {
      const vin = "vin";
      const client = new PitstopClient({ baseUrl: host, clientId: "", apiKey: "" });
      // noinspection UnnecessaryLocalVariableJS
      const mockResponse = GetCarResponseNoCar;
      nock(host)
        .get(`/v1/car?vin=${vin}`)
        .reply(200, mockResponse);

      const car = await client.getCarByVin({ vin });
      expect(car).toBeUndefined();
    });
  });
  describe("createCar", () => {
    it("creates a car", async () => {
      const vin = "vin";
      const client = new PitstopClient({ baseUrl: host, clientId: "", apiKey: "" });
      nock(host)
        .post("/v1/car")
        .reply(200, CreateCarSuccessResponse);
      const car = await client.createCar({ vin, make: "make", model: "model", year: 2000, mileage: 0, shopId: 1 });
      expect(car.id).toEqual(CreateCarSuccessResponse.id);
    });
    it("fails to create a car (duplicate vin)", async () => {
      const vin = "vin";
      const client = new PitstopClient({ baseUrl: host, clientId: "", apiKey: "" });
      nock(host)
        .post("/v1/car")
        .reply(409, CreateCarDuplicateVinResponse);
      await expect(
        client.createCar({ vin, make: "make", model: "model", year: 2000, mileage: 0, shopId: 1 })
      ).rejects.toThrowError();
    });
  });
});

const GetCarResponseOneCar = {
  meta: {
    count: 1
  },
  result: [
    {
      id: 157,
      userId: null,
      vin: "0WD12D12",
      licensePlate: null,
      year: null,
      make: null,
      model: null,
      trim: null,
      engine: null,
      tankSize: null,
      cityMileage: null,
      highwayMileage: null,
      baseMileage: "200000.0",
      totalMileage: "200000.0",
      lastConnectionTimestamp: null,
      carName: null,
      source: null,
      images: {
        fullsizeImagePath: null,
        midsizeImagePath: null,
        thumbnailImagePath: null
      },
      acesMapping: {
        acesVehicleId: null,
        acesEngineConfigId: null,
        acesTransmissionId: null,
        acesVehicleToEngineConfigId: null
      },
      user: {
        userId: null,
        firstName: null,
        lastName: null,
        role: null
      },
      issueCounts: {},
      issues: [],
      metrics: {}
    }
  ]
};

const GetCarResponseMultiCar = {
  meta: {
    count: 2
  },
  result: [
    {
      id: 158,
      userId: null,
      vin: "0WD12D12-123",
      licensePlate: null,
      year: null,
      make: null,
      model: null,
      trim: null,
      engine: null,
      tankSize: null,
      cityMileage: null,
      highwayMileage: null,
      baseMileage: "200000.0",
      totalMileage: "200000.0",
      lastConnectionTimestamp: null,
      carName: null,
      source: null,
      images: {
        fullsizeImagePath: null,
        midsizeImagePath: null,
        thumbnailImagePath: null
      },
      acesMapping: {
        acesVehicleId: null,
        acesEngineConfigId: null,
        acesTransmissionId: null,
        acesVehicleToEngineConfigId: null
      },
      user: {
        userId: null,
        firstName: null,
        lastName: null,
        role: null
      },
      issueCounts: {},
      issues: [],
      metrics: {}
    },
    {
      id: 157,
      userId: null,
      vin: "0WD12D12",
      licensePlate: null,
      year: null,
      make: null,
      model: null,
      trim: null,
      engine: null,
      tankSize: null,
      cityMileage: null,
      highwayMileage: null,
      baseMileage: "200000.0",
      totalMileage: "200000.0",
      lastConnectionTimestamp: null,
      carName: null,
      source: null,
      images: {
        fullsizeImagePath: null,
        midsizeImagePath: null,
        thumbnailImagePath: null
      },
      acesMapping: {
        acesVehicleId: null,
        acesEngineConfigId: null,
        acesTransmissionId: null,
        acesVehicleToEngineConfigId: null
      },
      user: {
        userId: null,
        firstName: null,
        lastName: null,
        role: null
      },
      issueCounts: {},
      issues: [],
      metrics: {}
    }
  ]
};

const GetCarResponseNoCar = {
  meta: {
    count: 0
  },
  result: []
};

const CreateCarSuccessResponse = {
  id: 159,
  userId: null,
  vin: "test-vin",
  licensePlate: null,
  year: null,
  make: null,
  model: null,
  trim: null,
  engine: null,
  tankSize: null,
  cityMileage: null,
  highwayMileage: null,
  baseMileage: "10.0",
  totalMileage: "10.0",
  lastConnectionTimestamp: null,
  carName: null,
  source: null,
  images: {
    fullsizeImagePath: null,
    midsizeImagePath: null,
    thumbnailImagePath: null
  },
  acesMapping: {
    acesVehicleId: null,
    acesEngineConfigId: null,
    acesTransmissionId: null,
    acesVehicleToEngineConfigId: null
  },
  user: {
    userId: null,
    firstName: null,
    lastName: null,
    role: null
  },
  issueCounts: {},
  issues: [],
  metrics: {}
};

const CreateCarDuplicateVinResponse = {
  error: "CarAlreadyExists",
  code: 204,
  message: "Car already exists"
};
