/**
 * PRAGYA CENTRAL DATA SOURCE REGISTRY
 * Singleton registry managing all authoritative meteorological adapters:
 * IMD, ISRO MOSDAC, NASA GPM, Copernicus ERA5, Open Scientific Archive, and Terrain.
 *
 * SCIENTIFIC RULE:
 * Every adapter reports an honest status:
 * CONNECTED | CREDENTIALS_REQUIRED | AVAILABLE_NOT_CONFIGURED | UNAVAILABLE | ERROR | SIMULATED
 * Never displays CONNECTED unless an actual request succeeds or verified dataset exists.
 */

import { IScientificSourceAdapter, SourceMetadata, DataSourceStatus } from './types.js';
import { ImdAdapter } from './imdAdapter.js';
import { MosdacAdapter } from './mosdacAdapter.js';
import { NasaGpmAdapter } from './nasaGpmAdapter.js';
import { Era5Adapter } from './era5Adapter.js';
import { TerrainAdapter } from './terrainAdapter.js';
import { OpenMeteoAdapter } from './openMeteoAdapter.js';

export interface AdapterStatusReport {
  id: string;
  name: string;
  provider: string;
  category: string;
  dataMode: string;
  status: DataSourceStatus;
  message: string;
  spatialResolution: string;
  temporalResolution: string;
  latencyMinutes: number;
  authRequired: boolean;
  requiredEnvVars: string[];
  variablesSupported: string[];
  lastTested: string;
  accessUrl?: string;
  limitations: string[];
  details?: Record<string, any>;
}

export class DataSourceRegistry {
  private static instance: DataSourceRegistry;
  private adapters: Map<string, IScientificSourceAdapter> = new Map();

  private constructor() {
    this.register(new ImdAdapter());
    this.register(new MosdacAdapter());
    this.register(new NasaGpmAdapter());
    this.register(new Era5Adapter());
    this.register(new TerrainAdapter());
    this.register(new OpenMeteoAdapter());
  }

  public static getInstance(): DataSourceRegistry {
    if (!DataSourceRegistry.instance) {
      DataSourceRegistry.instance = new DataSourceRegistry();
    }
    return DataSourceRegistry.instance;
  }

  public register(adapter: IScientificSourceAdapter): void {
    this.adapters.set(adapter.metadata.id, adapter);
  }

  public getAdapter(id: string): IScientificSourceAdapter | undefined {
    return this.adapters.get(id);
  }

  public getAllMetadata(): SourceMetadata[] {
    return Array.from(this.adapters.values()).map((a) => a.metadata);
  }

  /**
   * Evaluates live connectivity for all registered adapters.
   * Returns honest status breakdown without faking connections.
   */
  public async getStatusReports(): Promise<AdapterStatusReport[]> {
    const results: AdapterStatusReport[] = [];

    for (const adapter of this.adapters.values()) {
      try {
        const check = await adapter.checkStatus();
        results.push({
          id: adapter.metadata.id,
          name: adapter.metadata.name,
          provider: adapter.metadata.provider,
          category: adapter.metadata.category,
          dataMode: adapter.metadata.dataMode,
          status: check.status,
          message: check.message,
          spatialResolution: adapter.metadata.spatialResolution,
          temporalResolution: adapter.metadata.temporalResolution,
          latencyMinutes: adapter.metadata.latencyMinutes,
          authRequired: adapter.metadata.authRequired,
          requiredEnvVars: adapter.metadata.requiredEnvVars,
          variablesSupported: adapter.metadata.variablesSupported,
          lastTested: check.lastTested,
          accessUrl: adapter.metadata.accessUrl,
          limitations: adapter.metadata.limitations,
          details: check.details,
        });
      } catch (err: any) {
        results.push({
          id: adapter.metadata.id,
          name: adapter.metadata.name,
          provider: adapter.metadata.provider,
          category: adapter.metadata.category,
          dataMode: adapter.metadata.dataMode,
          status: 'ERROR',
          message: `Adapter status check failed: ${err.message}`,
          spatialResolution: adapter.metadata.spatialResolution,
          temporalResolution: adapter.metadata.temporalResolution,
          latencyMinutes: adapter.metadata.latencyMinutes,
          authRequired: adapter.metadata.authRequired,
          requiredEnvVars: adapter.metadata.requiredEnvVars,
          variablesSupported: adapter.metadata.variablesSupported,
          lastTested: new Date().toISOString(),
          accessUrl: adapter.metadata.accessUrl,
          limitations: adapter.metadata.limitations,
        });
      }
    }

    return results;
  }
}

export const dataSourceRegistry = DataSourceRegistry.getInstance();
