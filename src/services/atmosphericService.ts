/**
 * PRAGYA Atmospheric Intelligence Services
 * Centralized Demo Data Service and future API Provider interfaces.
 * 
 * Components consume this service so simulated values can later be replaced
 * by live NWP / Radar / ML inference backends without rewriting UI components.
 */

import {
  StormCell,
  PredictabilityState,
  EnsembleFuture,
  HistoricalEvent,
  ObservationGap,
  DifferenceSignal,
  AtmosphericFingerprint,
  WeatherAlert,
  ModelMetricPlaceholder,
  VerticalProfileLevel,
  ConvectiveStage
} from '../types';

import {
  DEMO_STORM_CELLS,
  DEMO_PREDICTABILITY_TIMELINE,
  DEMO_ENSEMBLE_FUTURES,
  DEMO_DIFFERENCE_SIGNALS,
  DEMO_CELL_FINGERPRINT,
  DEMO_HISTORICAL_EVENTS,
  DEMO_OBSERVATION_GAPS,
  DEMO_CITIZEN_ALERT,
  DEMO_MODEL_METRICS,
  DEMO_VERTICAL_SOUNDINGS,
  DEMO_CELL_POSITIONS_3D,
  DEMO_TIMELINE_METRICS
} from '../data/demoAtmosphericData';

// FUTURE SERVICE INTERFACES (Cleanly defined for future backend integration)
export interface WeatherApiService {
  getLiveObservations(bbox?: [number, number, number, number]): Promise<any[]>;
  getDopplerMosaic(timestamp: string): Promise<ArrayBuffer>;
  getSurfaceAwsStations(): Promise<any[]>;
}

export interface PredictionApiService {
  getPredictabilityState(cellId: string): Promise<PredictabilityState>;
  getEnsembleMembers(cellId: string): Promise<EnsembleFuture[]>;
  calculateEntropyDivergence(cellId: string): Promise<{ entropy: number; divergence: number }>;
}

export interface HistoricalApiService {
  getHistoricalReplayCatalog(): Promise<HistoricalEvent[]>;
  getReplaySteps(eventId: string): Promise<HistoricalEvent>;
}

export interface DatabaseApiService {
  saveResearchNote(cellId: string, note: string): Promise<void>;
  queryArchive(params: any): Promise<any[]>;
}

// Current In-Memory Demonstration Service Provider
export class AtmosphericDataService {
  private static instance: AtmosphericDataService;
  private isDemoMode: boolean = true;

  private constructor() {}

  public static getInstance(): AtmosphericDataService {
    if (!AtmosphericDataService.instance) {
      AtmosphericDataService.instance = new AtmosphericDataService();
    }
    return AtmosphericDataService.instance;
  }

  public isDemonstrationMode(): boolean {
    return this.isDemoMode;
  }

  public getDataSourceName(): string {
    return this.isDemoMode ? "PRAGYA SIMULATION TESTBED (SYNTHETIC RUN 04A)" : "IMD / NCMRWF HYBRID FEED";
  }

  public getAnalysisTimeUtc(): string {
    return "2026-09-28 10:15:00 UTC";
  }

  public getAnalysisTimeIst(): string {
    return "28-SEP-2026 15:45:00 IST";
  }

  // Active Storm Cells
  public getActiveStormCells(): StormCell[] {
    return DEMO_STORM_CELLS;
  }

  public getStormCellById(id: string): StormCell | undefined {
    return DEMO_STORM_CELLS.find(cell => cell.id === id) || DEMO_STORM_CELLS[0];
  }

  // Predictability Timeline
  public getPredictabilityTimeline(cellId?: string): PredictabilityState[] {
    // In future, dynamically compute/fetch per cellId
    return DEMO_PREDICTABILITY_TIMELINE;
  }

  // Future Ensembles
  public getEnsembleFutures(cellId?: string): EnsembleFuture[] {
    return DEMO_ENSEMBLE_FUTURES;
  }

  // Storm Laboratory Comparison Data
  public getDifferenceSignals(): DifferenceSignal[] {
    return DEMO_DIFFERENCE_SIGNALS;
  }

  // Atmospheric Fingerprint
  public getCellFingerprint(cellId?: string): AtmosphericFingerprint {
    return DEMO_CELL_FINGERPRINT;
  }

  // Historical Events
  public getHistoricalEvents(): HistoricalEvent[] {
    return DEMO_HISTORICAL_EVENTS;
  }

  public getHistoricalEventById(id: string): HistoricalEvent | undefined {
    return DEMO_HISTORICAL_EVENTS.find(ev => ev.id === id) || DEMO_HISTORICAL_EVENTS[0];
  }

  // Observation Gaps
  public getObservationGaps(): ObservationGap[] {
    return DEMO_OBSERVATION_GAPS;
  }

  // Citizen Alerts
  public getActiveCitizenAlert(): WeatherAlert {
    return DEMO_CITIZEN_ALERT;
  }

  // Model Evaluation Metrics Placeholders
  public getModelMetricPlaceholders(): ModelMetricPlaceholder[] {
    return DEMO_MODEL_METRICS;
  }

  // Vertical Atmospheric Soundings
  public getVerticalSoundings(): VerticalProfileLevel[] {
    return DEMO_VERTICAL_SOUNDINGS;
  }

  public getVerticalSoundingByAltitude(altitudeKm: number): VerticalProfileLevel | undefined {
    return DEMO_VERTICAL_SOUNDINGS.find(s => s.altitudeKm === altitudeKm);
  }

  // 3D Scene Cell Positions
  public getCell3DPosition(cellId: string) {
    return DEMO_CELL_POSITIONS_3D[cellId] || DEMO_CELL_POSITIONS_3D['CX-017'];
  }

  public getAllCell3DPositions() {
    return DEMO_CELL_POSITIONS_3D;
  }

  // Timeline Metrics & Stages
  public getTimelineMetric(point: string) {
    return DEMO_TIMELINE_METRICS[point] || DEMO_TIMELINE_METRICS['NOW'];
  }
}

// Export singleton instance for direct import
export const atmosphericService = AtmosphericDataService.getInstance();
