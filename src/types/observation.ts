/**
 * PRAGYA OBSERVATION, PROVENANCE & EXPERIMENTAL DATA ARCHITECTURE
 * Standard atmospheric observation formats, quality states, provenance,
 * data source adapters, and experimental reproducible run entities.
 */

export type QualityState =
  | 'VERIFIED'
  | 'GOOD'
  | 'PARTIAL'
  | 'LOW CONFIDENCE'
  | 'MISSING';

export type SystemMode =
  | 'SIMULATION'
  | 'HISTORICAL_RESEARCH'
  | 'LIVE';

export type EventSeverity =
  | 'MODERATE'
  | 'SEVERE'
  | 'EXTREME'
  | 'CATASTROPHIC';

export type SevereEventType =
  | 'THUNDERSTORM'
  | 'HAIL'
  | 'EXTREME RAINFALL'
  | 'CLOUDBURST';

export interface DataProvenance {
  source: string;              // e.g. "INSAT-3DR TIR-1 Channel", "IMD Doppler Radar Mumbai"
  timestamp: string;           // ISO UTC timestamp
  quality: QualityState;
  isObserved: boolean;
  isDerived: boolean;
  derivationMethod?: string;   // e.g. "Demonstration physical thermodynamic calculation"
  processingStatus: 'RAW' | 'QUALITY_CONTROLLED' | 'ASSIMILATED' | 'SYNTHETIC_DEMO';
  sensorPlatform: string;      // e.g. "Geostationary Meteorological Satellite", "C-Band Polarimetric Radar"
  calibrationNote?: string;
}

export interface AtmosphericObservation {
  id: string;
  timestamp: string;           // ISO UTC timestamp
  minuteOffset: number;        // e.g. -180, -120, -60, -47, -30, 0
  latitude: number;
  longitude: number;
  altitude: number | null;     // meters AGL, null if column/surface integrated

  // Thermodynamic variables
  temperature: number | null;          // deg C
  relativeHumidity: number | null;     // % (0-100)
  pressure: number | null;             // hPa

  // Kinematic variables
  windSpeed: number | null;            // m/s
  windDirection: number | null;        // degrees (0-360)
  verticalVelocity: number | null;     // m/s (updraft > 0, downdraft < 0)

  // Convective parameters
  cape: number | null;                 // J/kg (Convective Available Potential Energy)
  cin: number | null;                  // J/kg (Convective Inhibition, typically negative)
  windShear: number | null;            // m/s (0-6 km bulk shear)
  moistureConvergence: number | null;  // g/kg/hr

  // Cloud & Top properties
  cloudTopTemperature: number | null;  // deg C (Infrared brightness temperature)
  cloudTopCoolingRate: number | null;  // deg C / 15 min

  // Precipitation & Electrical
  precipitationRate: number | null;    // mm/hr
  lightningActivity: number | null;    // flashes / min
  radarReflectivity: number | null;    // dBZ

  // Provenance & Quality tracking
  source: string;
  qualityFlag: QualityState;
  isObserved: boolean;
  isDerived: boolean;
  derivationMethod?: string;
  provenance: DataProvenance;
}

// ----------------------------------------------------------------------------
// DATA SOURCE ADAPTER INTERFACES
// ----------------------------------------------------------------------------

export type DataSourcePlatformCategory =
  | 'SATELLITE'
  | 'RADAR'
  | 'LIGHTNING'
  | 'SURFACE_AWS'
  | 'UPPER_AIR'
  | 'MODEL_NWP'
  | 'TERRAIN';

export interface DataSourceAdapterMetadata {
  id: string;
  name: string;
  category: DataSourcePlatformCategory;
  agency: string;             // e.g. "IMD", "ISRO", "NCMRWF", "USGS"
  operationalStatus: 'OPERATIONAL' | 'PLANNED' | 'NOT_CONFIGURED';
  ingestionCadence: string;   // e.g. "15 min", "10 min", "1 sec", "1 min"
  latencyMinutes: number;
  coverageDomain: string;
  formatSpecification: string;// e.g. "HDF5 / NetCDF-4", "BUFR", "GeoTIFF"
  authRequired: boolean;
}

export interface DataSourceAdapter {
  metadata: DataSourceAdapterMetadata;
  testConnection(): Promise<{ success: boolean; message: string }>;
  fetchObservations(timeWindow: { start: string; end: string }): Promise<AtmosphericObservation[]>;
}

// ----------------------------------------------------------------------------
// STANDARDIZED HISTORICAL EVENT MODEL
// ----------------------------------------------------------------------------

export interface HistoricalEventMetadata {
  eventId: string;
  eventName: string;
  eventType: SevereEventType;
  date: string;               // YYYY-MM-DD
  region: string;
  approxCoordinates: {
    lat: number;
    lon: number;
  };
  startTimeUTC: string;
  endTimeUTC: string;
  eventSeverity: EventSeverity;
  dataWindowStartUTC: string;
  dataWindowEndUTC: string;
  knownOutcome: string;
  sourceReferenceMetadata: {
    citation: string;
    verifiedBy: string;
    gaugeRecordPeakMmHr: number;
  };
  isNearMiss: boolean;
  candidatePrecursors?: string[];
}

export interface NearMissComparisonMetadata {
  eventA: HistoricalEventMetadata;
  eventB: HistoricalEventMetadata;
  comparisonSeason: string;
  synopticSimilarityScore: number; // 0-100% (demonstration similarity)
  differingPrecursorCandidate: string;
  physicalInterpretation: string;
}

// ----------------------------------------------------------------------------
// EXPERIMENT RUN & REPRODUCIBILITY ENTITIES
// ----------------------------------------------------------------------------

export interface ExperimentConfiguration {
  predictabilityThreshold: number;   // default 70%
  persistenceStepsRequired: number; // default 2
  dataSourcesIncluded: DataSourcePlatformCategory[];
  reconstructionMethod: 'ENTROPY_BIFURCATION' | 'RADAR_PERSISTENCE' | 'THERMODYNAMIC_THRESHOLD';
}

export interface ExperimentRunResult {
  thresholdCrossingMinute: number | null; // e.g. -47
  leadTimeMinutes: number | null;          // e.g. 47
  observationConfidenceAtCrossing: number;// 0-100%
  horizonDetected: boolean;
  finalRiskAtOnset: number;
  divergenceAtCrossing: number;
  status: 'SUCCESSFUL_DETECTION' | 'AMBIGUOUS' | 'FALSE_ALARM' | 'DEMO_VERIFIED';
}

export interface ExperimentRun {
  experimentId: string;
  eventName: string;
  eventId: string;
  configuration: ExperimentConfiguration;
  modelVersion: string;              // e.g. "PRAGYA-DEMO-0.1"
  executionTimestamp: string;
  executionDurationMs: number;
  result: ExperimentRunResult;
  notes: string;
}

export interface ModelVersion {
  name: string;
  version: string;
  releaseDate: string;
  description: string;
  parameters: Record<string, string | number>;
  trainingDatasetReference: string;
  validationDatasetReference: string;
  status: 'ACTIVE_DEMO' | 'CANDIDATE' | 'DEPRECATED';
}

// ----------------------------------------------------------------------------
// FUTURE DATABASE READINESS SCHEMA (PostgreSQL Mapping Draft)
// ----------------------------------------------------------------------------

export interface DbUserEntity {
  id: string;
  email: string;
  role: 'RESEARCHER' | 'METEOROLOGIST' | 'ADMIN';
  organization: string;
  createdAt: string;
}

export interface DbPredictionSnapshotEntity {
  id: string;
  experimentRunId: string;
  timestamp: string;
  eventRisk: number;
  predictability: number;
  divergenceIndex: number;
  observationConfidence: number;
  regime: string;
}
