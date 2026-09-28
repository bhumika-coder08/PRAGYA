/**
 * PRAGYA: Predictability & Rapid Atmospheric Genesis Intelligence Architecture
 * Core Type Definitions
 *
 * SCIENTIFIC INTEGRITY PRINCIPLE:
 * EVENT RISK: How likely severe convection is.
 * PREDICTABILITY: How confidently the atmosphere currently allows that event to be distinguished from plausible alternative futures.
 * These are NEVER identical values.
 */

export type ConvectiveStatus =
  | 'BOUNDARY_LAYER_ACCUMULATION'
  | 'INITIATION'
  | 'CONVECTIVE DEVELOPMENT'
  | 'MATURE SEVERE'
  | 'RAPID GENESIS'
  | 'DISSIPATION';

export type ConvectiveStage = 'STABLE' | 'INITIATION' | 'DEVELOPING' | 'MATURE' | 'EXTREME';

export type CameraPreset = 'REGIONAL' | 'STORM' | 'CROSS_SECTION' | 'TOP_DOWN' | 'GROUND_VIEW';

export interface VerticalProfileLevel {
  altitudeKm: number;
  pressureHpa: number;
  temperatureC: number;
  relativeHumidity: number; // %
  dewPointC: number;
  windSpeedMs: number;
  windSpeedKnots: number;
  windDirectionDeg: number;
  windDirectionText: string;
  verticalVelocityMs: number;
  potentialTempK: number;
  description: string;
  isSimulated: true;
}

export interface AtmosphericObservation {
  id: string;
  source: 'DOPPLER_RADAR' | 'INSAT_3D' | 'RADIOSONDE' | 'SURFACE_AWS' | 'LIGHTNING_NETWORK' | 'NWP_HYBRID';
  variable: string;
  value: number;
  unit: string;
  altitudeKm: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  qualityScore: number; // 0 to 1
  isSimulated: true;
}

export interface StormCell {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number]; // [lat, lon]
  status: ConvectiveStatus;
  
  // PRIMARY METEOROLOGICAL METRICS
  eventRisk: number;          // 0-100% Probability of severe convection
  predictability: number;     // 0-100% Confidence that current state distinguishes this from non-severe futures
  
  // ATMOSPHERIC DYNAMICS (Demo/Simulated values)
  cape: number;               // J/kg (Convective Available Potential Energy)
  cin: number;                // J/kg (Convective Inhibition)
  relativeHumidity: number;   // % at 850-700 hPa
  verticalVelocity: number;   // m/s max updraft
  windShear: number;          // m/s (0-6 km bulk shear)
  moistureConvergence: number;// g/kg/hr
  cloudTopCooling: number;    // °C/15min
  lightningActivity: number;  // flashes/min
  
  ambiguityAssessment: string;
  candidatePrecursorSignals: string[];
  altitudeRangeKm: [number, number];
  observedAt: string;
  isSimulated: true;
}

export interface PredictabilityState {
  timeOffsetMin: number;      // e.g. -120, -90, -60, -47, -30, -15, 0
  label: string;              // "T-120", "T-47"
  eventRisk: number;          // %
  predictability: number;     // %
  entropyBits: number;        // Information entropy
  divergenceIndex: number;    // Multi-model state divergence
  isThresholdCrossed: boolean;
  isEarliestDefensibleWarning: boolean;
  atmosphereStateNote: string;
}

export type FutureCategory = 
  | 'Dissipation' 
  | 'Ordinary Convection' 
  | 'Severe Thunderstorm' 
  | 'Extreme Rainfall';

export interface EnsembleFuture {
  id: string;
  memberId: string;
  category: FutureCategory;
  probability: number;       // %
  predictabilityScore: number;// %
  peakCape: number;          // J/kg
  peakRainfallRate: number;  // mm/hr
  maxVerticalVelocity: number;// m/s
  radarReflectivityDbz: number;// dBZ
  description: string;
  divergencePointMin: number; // Minute when this ensemble diverges
  isSimulated: true;
}

export interface HistoricalStep {
  minute: number;             // -180 to 0
  label: string;              // "T-180 min"
  eventRisk: number;
  predictability: number;
  radarReflectivity: number;  // dBZ
  satelliteTempC: number;     // Cloud top IR temp
  lightningDetected: number;  // Flashes
  revealedObservation: string;
  precursorSignalStatus: string;
  isThresholdCrossed: boolean;
}

export interface HistoricalEvent {
  id: string;
  code: string;
  name: string;
  date: string;
  region: string;
  description: string;
  actualOutcome: FutureCategory;
  thresholdCrossingMinute: number;
  leadTimeMinutes: number;
  steps: HistoricalStep[];
}

export interface ObservationGap {
  id: string;
  weaklyObservedVariable: string;
  altitudeRangeKm: [number, number];
  spatialRegion: string;
  currentUncertainty: string;
  expectedInformationValue: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  platformLimitation: string;
  recommendedSensorTarget: string;
  simulationBox: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
}

export interface DifferenceSignal {
  variable: string;
  unit: string;
  eventAValue: number; // Convective developed
  eventBValue: number; // Convection failed
  delta: number;
  candidateDiscriminatingPower: number; // 0-100%
  physicalContext: string;
}

export interface AtmosphericFingerprint {
  cellId: string;
  parameters: {
    key: string;
    label: string;
    value: number;
    normalized: number; // 0-100 scale for radar/polygon
    unit: string;
    modelContributionWeight: number; // % contribution to predictability metric
    physicalMeaning: string;
  }[];
}

export interface WeatherAlert {
  id: string;
  level: 'WATCH' | 'WARNING' | 'ADVISORY';
  title: string;
  eventType: string;
  arrivalTimeMin: [number, number]; // [min, max] minutes
  confidence: 'LOW' | 'MODERATE' | 'HIGH';
  predictabilityState: string;
  hazards: string[];
  affectedDistricts: string[];
  safetyGuidance: {
    en: string[];
    hi: string[];
    mr: string[];
  };
  translations: {
    en: {
      title: string;
      arrival: string;
      confidence: string;
      hazardsText: string;
      guidanceHeader: string;
    };
    hi: {
      title: string;
      arrival: string;
      confidence: string;
      hazardsText: string;
      guidanceHeader: string;
    };
    mr: {
      title: string;
      arrival: string;
      confidence: string;
      hazardsText: string;
      guidanceHeader: string;
    };
  };
}

export interface ModelMetricPlaceholder {
  id: string;
  metric: string;
  abbreviation: string;
  category: 'DETECTION' | 'PROBABILISTIC' | 'TIMING' | 'SPATIAL';
  mathematicalDefinition: string;
  targetBenchmark: string;
  status: 'AWAITING_EXPERIMENTAL_DATA';
  validationDatasetRequirement: string;
}

// ============================================================================
// CORE RESEARCH INTELLIGENCE INTERFACES
// ============================================================================

export type PredictabilityRegime =
  | 'UNRESOLVED'
  | 'EMERGING'
  | 'PREDICTABLE'
  | 'HIGH CONFIDENCE';

export interface PredictabilityThresholdConfig {
  unresolvedMax: number;    // default 35
  emergingMax: number;      // default 65
  predictableMax: number;   // default 85
  persistentStepsRequired: number; // default 2
}

export interface PredictabilityHorizonResult {
  thresholdPercentage: number;
  firstCrossingMinute: number;
  persistentCrossingMinute: number;
  leadTimeMinutes: number;
  state: PredictabilityRegime;
  confidenceScore: number;
  summaryText: string;
  isDefensible: boolean;
}

export type ObservationSufficiencyStatus = 'AVAILABLE' | 'PARTIAL' | 'MISSING';

export interface ObservationSufficiencyItem {
  id: string;
  sourceName: string;
  platformCategory: 'SATELLITE' | 'RADAR' | 'LIGHTNING' | 'SURFACE_AWS' | 'UPPER_AIR' | 'MODEL_NWP';
  status: ObservationSufficiencyStatus;
  cadence: string;
  latencySeconds: number;
  informationContributionWeight: number; // %
  limitingFactorNote: string;
}

export interface ObservationSufficiencyAssessment {
  overallConfidenceScore: number; // 0-100%
  statusSummary: 'CONFIDENT' | 'ACCEPTABLE' | 'OBSERVATION_LIMITED';
  limitingHeadline: string;
  items: ObservationSufficiencyItem[];
  mostInfluentialGap: {
    variable: string;
    altitudeRangeKm: [number, number];
    coverageStatus: string;
    estimatedSensitivity: 'CRITICAL' | 'HIGH' | 'MODERATE';
    recommendation: string;
  };
}

export interface ModelContributionSignal {
  variable: string;
  trend: 'INCREASING' | 'DECREASING' | 'OBSERVATION_IMPROVEMENT';
  magnitude: string;
  signalPower: number; // 0-100
  note: string;
}

export interface PrecursorTrajectoryPoint {
  minute: number;
  label: string; // T-180, T-120, etc.
  cape: number;
  cin: number;
  moisture: number;
  convergence: number;
  verticalVelocity: number;
  shear: number;
  cloudCooling: number;
  lightning: number;
  regime: PredictabilityRegime;
  entropyBits: number;
  divergenceIndex: number;
}

export interface CounterfactualParameters {
  moisture: number;    // % (40-100)
  cape: number;        // J/kg (1000-4000)
  cin: number;         // J/kg (-120 to 0)
  windShear: number;   // m/s (5-40)
  convergence: number; // g/kg/hr (0.5-8.0)
}

export interface CounterfactualResult {
  simulatedRisk: number;
  simulatedPredictability: number;
  simulatedDivergenceIndex: number;
  primaryAttractor: FutureCategory;
  distribution: {
    category: FutureCategory;
    probability: number;
  }[];
  sensitivityInterpretation: string;
}

export interface ResearchEventLogItem {
  id: string;
  timestamp: string;
  minuteOffset: number; // e.g. -47
  message: string;
  category: 'OBSERVATION' | 'DIVERGENCE' | 'REGIME' | 'THRESHOLD' | 'RISK';
  severity: 'INFO' | 'WATCH' | 'ALERT' | 'SUCCESS';
}

export interface BaselineComparisonSlot {
  id: string;
  name: string;
  type: 'PRAGYA' | 'PERSISTENCE' | 'THRESHOLD' | 'FUTURE_ML';
  status: 'RESEARCH_PROTOTYPE' | 'BENCHMARK_SPECIFIED' | 'AWAITING_DATA';
  leadTimeExpected: string;
  brierScoreExpected: string;
  csiExpected: string;
  description: string;
}

export interface JudgeStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  route: string;
  description: string;
  keyTakeaway: string;
}

export * from './observation';


