/**
 * PRAGYA SCIENTIFIC DATA SOURCE ARCHITECTURE
 * Shared types, status definitions, and adapter interfaces for real meteorological sources.
 */

export type DataSourceStatus =
  | 'CONNECTED'
  | 'CREDENTIALS_REQUIRED'
  | 'AVAILABLE_NOT_CONFIGURED'
  | 'UNAVAILABLE'
  | 'ERROR'
  | 'SIMULATED';

export type ScientificDataMode =
  | 'REAL'
  | 'REANALYSIS'
  | 'DERIVED'
  | 'SIMULATED';

export type QualityStatus =
  | 'VALID'
  | 'SUSPECT'
  | 'MISSING'
  | 'INTERPOLATED'
  | 'SYNTHETIC';

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface TimeWindow {
  start: string; // ISO 8601 UTC
  end: string;   // ISO 8601 UTC
}

export interface SourceProvenance {
  provider: string;
  source: string;
  dataset: string;
  originalVariable: string;
  retrievedAt: string;
  processingLevel: 'L1' | 'L2' | 'L3' | 'ANALYSIS' | 'SYNTHETIC';
  qualityStatus: QualityStatus;
  licenseOrCitation: string;
  derivationMethod?: string;
}

export interface NormalizedObservation {
  id: string;
  eventId?: string;
  dataSourceId: string;
  observedAt: Date;
  availableAt: Date; // Strict temporal time-gating: availableAt >= observedAt
  latitude: number;
  longitude: number;
  altitude?: number | null; // meters or hPa
  variable: string;         // e.g. "temperature", "dew_point", "cape", "reflectivity", "precipitation_rate"
  value: number | null;     // null for missing data (NEVER zero-fill!)
  unit: string;             // "degC", "J/kg", "mm/hr", "dBZ", "m/s", "hPa"
  qualityStatus: QualityStatus;
  observationType: 'POINT' | 'GRID' | 'PROFILE';
  isDerived: boolean;
  metadata?: Record<string, any>;
  provenance: SourceProvenance;
}

export interface SourceMetadata {
  id: string;
  name: string;
  provider: string;
  category: 'SATELLITE' | 'RADAR' | 'REANALYSIS' | 'SURFACE_AWS' | 'UPPER_AIR' | 'PRECIPITATION' | 'TERRAIN' | 'SYNTHETIC';
  dataMode: ScientificDataMode;
  spatialResolution: string;
  temporalResolution: string;
  latencyMinutes: number;
  authRequired: boolean;
  requiredEnvVars: string[];
  variablesSupported: string[];
  description: string;
  accessUrl?: string;
  limitations: string[];
}

export interface IScientificSourceAdapter {
  metadata: SourceMetadata;
  checkStatus(): Promise<{
    status: DataSourceStatus;
    message: string;
    lastTested: string;
    details?: Record<string, any>;
  }>;
  fetchObservations(params: {
    eventId?: string;
    timeWindow: TimeWindow;
    boundingBox?: BoundingBox;
    altitudeLevel?: number;
  }): Promise<NormalizedObservation[]>;
}
