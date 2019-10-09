import { ConfigurationEntryLoadOptions } from "@ansik/sdk/dist/common/interfaces/configurationLoader";

export const configuration = <ConfigurationEntryLoadOptions[]>[
  { destPath: "smartcar.clientId", isRequired: true },
  { clientSecret: "smartcar.clientSecret", isRequired: true },
  { redirectUri: "smartcar.redirectUri", isRequired: true },
  { destPath: "smartcar.clientId", isRequired: true },
  { destPath: "smartcar.testMode", isRequired: true, deserializer: Boolean }
];
