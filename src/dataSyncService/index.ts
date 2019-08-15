import { IPersistenceLayer } from "../common/interfaces/persistenceLayer";

export class DataSyncService {
  constructor(private readonly persistenceLayer: IPersistenceLayer) {}
}
