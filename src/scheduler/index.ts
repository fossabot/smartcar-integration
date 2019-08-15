import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";

export class DataSyncScheduler {
  constructor(private readonly persistenceLayer: IPersistenceLayer) {}
}
