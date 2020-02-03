import { ConfigurationEntryLoadOptions } from "@ansik/sdk/common/interfaces/configurationLoader";

export const configuration = <ConfigurationEntryLoadOptions[]>[
  { destPath: "smartcar.clientId", isRequired: true },
  { destPath: "smartcar.clientSecret", isRequired: true },
  { destPath: "smartcar.redirectUri", isRequired: true },
  { destPath: "smartcar.testMode", isRequired: true, deserializer: Boolean },
  { destPath: "pitstop.baseUrl", isRequired: true },
  { destPath: "pitstop.clientId", isRequired: true },
  { destPath: "pitstop.apiKey", isRequired: true },
  { destPath: "persistenceLayer.queryExecutor.knexClientOptions.client", isRequired: true },
  { destPath: "persistenceLayer.queryExecutor.knexClientOptions.connection.host", isRequired: true },
  { destPath: "persistenceLayer.queryExecutor.knexClientOptions.connection.port", deserializer: Number },
  { destPath: "persistenceLayer.queryExecutor.knexClientOptions.connection.user", isRequired: true },
  { destPath: "persistenceLayer.queryExecutor.knexClientOptions.connection.password" },
  { destPath: "persistenceLayer.queryExecutor.knexClientOptions.connection.database", isRequired: true },
  { destPath: "test.context.authorizationCode" },
  { destPath: "test.context.vehicles", deserializer: JSON.parse } // todo: use io-ts decoder?
];
