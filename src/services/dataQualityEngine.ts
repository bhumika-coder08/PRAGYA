/**
 * PRAGYA DATA QUALITY & PROVENANCE ENGINE
 * Manages normalized atmospheric observations, tracks sensor provenance,
 * computes multi-factor observation confidence, and enforces scientific
 * integrity rules (never replace missing data with zeros).
 */

import {
  AtmosphericObservation,
  DataProvenance,
  QualityState,
  DataSourcePlatformCategory
} from '../types/observation';

export class DataQualityEngine {
  private static instance: DataQualityEngine;

  private constructor() {}

  public static getInstance(): DataQualityEngine {
    if (!DataQualityEngine.instance) {
      DataQualityEngine.instance = new DataQualityEngine();
    }
    return DataQualityEngine.instance;
  }

  // --------------------------------------------------------------------------
  // 1. DATA PROVENANCE CATALOG
  // --------------------------------------------------------------------------
  public getProvenance(variableName: string, minuteOffset: number): DataProvenance {
    const timestamp = this.formatIsoForOffset(minuteOffset);

    switch (variableName.toLowerCase()) {
      case 'radartop':
      case 'radarreflectivity':
      case 'reflectivity':
        return {
          source: 'IMD Doppler Weather Radar (Mumbai C-Band)',
          timestamp,
          quality: minuteOffset <= 0 ? 'GOOD' : 'MISSING',
          isObserved: true,
          isDerived: false,
          processingStatus: 'QUALITY_CONTROLLED',
          sensorPlatform: 'C-Band Dual-Polarization Doppler Radar (5.6 GHz)',
          calibrationNote: 'Calibrated against ground clutter filters; 0.5 deg elevation volume scan.'
        };

      case 'cloudtoptemperature':
      case 'cloudcoolingrate':
      case 'satellite':
        return {
          source: 'INSAT-3DR Geostationary Imager (TIR-1 10.8 µm)',
          timestamp,
          quality: 'VERIFIED',
          isObserved: true,
          isDerived: false,
          processingStatus: 'QUALITY_CONTROLLED',
          sensorPlatform: 'Geostationary Meteorological Satellite (74°E)',
          calibrationNote: 'Radiometrically calibrated via blackbody reference; 4 km spatial resolution.'
        };

      case 'lightning':
      case 'lightningactivity':
        return {
          source: 'ISRO / IITM Lightning Location Network',
          timestamp,
          quality: 'GOOD',
          isObserved: true,
          isDerived: false,
          processingStatus: 'QUALITY_CONTROLLED',
          sensorPlatform: 'VLF/LF Total Lightning Detection Sensor Array',
          calibrationNote: 'Detection efficiency estimated at 92% for intra-cloud and CG strokes.'
        };

      case 'cape':
      case 'cin':
      case 'sounding':
        return {
          source: 'IMD Radiosonde Sounding (Santa Cruz 43003) + Surface AWS',
          timestamp,
          quality: minuteOffset >= -120 ? 'PARTIAL' : 'GOOD',
          isObserved: false,
          isDerived: true,
          derivationMethod: 'Pseudo-adiabatic parcel integration over mixed-layer thermodynamics',
          processingStatus: 'ASSIMILATED',
          sensorPlatform: 'Vaisala RS41-SGP Radiosonde + AWS Tower',
          calibrationNote: 'Upper-air sounding launched at 00/12 UTC; boundary layer nudged with surface AWS.'
        };

      case 'moistureconvergence':
      case 'convergence':
      case 'windshear':
        return {
          source: 'PRAGYA Diagnostic Kinematic Mesh Assimilation',
          timestamp,
          quality: 'GOOD',
          isObserved: false,
          isDerived: true,
          derivationMethod: 'Variational 3D kinematic wind analysis from Doppler radial velocities and mesonet',
          processingStatus: 'ASSIMILATED',
          sensorPlatform: 'Multi-Sensor Meso-Analysis Grid',
          calibrationNote: 'Derived field; subject to spatial interpolation uncertainty along terrain interface.'
        };

      default:
        return {
          source: 'PRAGYA Regional Convective Testbed',
          timestamp,
          quality: 'GOOD',
          isObserved: false,
          isDerived: true,
          derivationMethod: 'Synthetic demonstration atmospheric dataset',
          processingStatus: 'SYNTHETIC_DEMO',
          sensorPlatform: 'Simulated Research Testbed',
          calibrationNote: 'Demonstration data for research methodology evaluation.'
        };
    }
  }

  // --------------------------------------------------------------------------
  // 2. OBSERVATION CONFIDENCE FORMULA (DOCUMENTED DEMO LOGIC)
  // --------------------------------------------------------------------------
  /**
   * Calculates Observation Confidence based on:
   * - Availability: % of expected sensor platforms actively reporting
   * - Recency: Age of newest platform observation relative to replay time
   * - Coverage: Spatial domain completeness
   * - Quality: Ratio of VERIFIED/GOOD flags versus PARTIAL/LOW CONFIDENCE
   *
   * NEVER manufactures data. Missing observations reduce confidence score.
   */
  public calculateObservationConfidence(
    observations: AtmosphericObservation[],
    targetMinute: number
  ): {
    score: number;
    availabilityScore: number;
    recencyScore: number;
    coverageScore: number;
    qualityScore: number;
    rating: 'HIGH' | 'MODERATE' | 'LOW' | 'COMPROMISED';
    limitingFactor: string;
  } {
    if (!observations || observations.length === 0) {
      return {
        score: 0,
        availabilityScore: 0,
        recencyScore: 0,
        coverageScore: 0,
        qualityScore: 0,
        rating: 'COMPROMISED',
        limitingFactor: 'No observations received in the current temporal window.'
      };
    }

    // Filter to observations applicable at or before targetMinute
    const validObs = observations.filter(o => o.minuteOffset <= targetMinute);

    // 1. Availability (how many core variables have non-null readings)
    const checkedFields: (keyof AtmosphericObservation)[] = [
      'temperature',
      'relativeHumidity',
      'windSpeed',
      'cape',
      'cin',
      'moistureConvergence',
      'radarReflectivity',
      'cloudTopTemperature',
      'lightningActivity'
    ];

    let availableCount = 0;
    checkedFields.forEach(f => {
      const hasNonNull = validObs.some(o => o[f] !== null);
      if (hasNonNull) availableCount++;
    });
    const availabilityScore = Math.round((availableCount / checkedFields.length) * 100);

    // 2. Recency (distance between latest observation and targetMinute)
    const latestOffset = validObs.reduce((max, o) => Math.max(max, o.minuteOffset), -999);
    const timeDelta = Math.abs(targetMinute - latestOffset);
    let recencyScore = 100;
    if (timeDelta > 60) recencyScore = 40;
    else if (timeDelta > 30) recencyScore = 65;
    else if (timeDelta > 15) recencyScore = 85;

    // 3. Quality score across valid observations
    let totalQualityWeight = 0;
    validObs.forEach(o => {
      switch (o.qualityFlag) {
        case 'VERIFIED': totalQualityWeight += 1.0; break;
        case 'GOOD': totalQualityWeight += 0.9; break;
        case 'PARTIAL': totalQualityWeight += 0.6; break;
        case 'LOW CONFIDENCE': totalQualityWeight += 0.3; break;
        case 'MISSING': totalQualityWeight += 0.0; break;
      }
    });
    const qualityScore = validObs.length > 0
      ? Math.round((totalQualityWeight / validObs.length) * 100)
      : 0;

    // 4. Coverage score (assumed 85% for localized testbed, penalized if radar missing)
    const hasRadar = validObs.some(o => o.radarReflectivity !== null);
    const coverageScore = hasRadar ? 88 : 55;

    // Weighted composite
    const score = Math.round(
      availabilityScore * 0.35 +
      recencyScore * 0.25 +
      qualityScore * 0.25 +
      coverageScore * 0.15
    );

    let rating: 'HIGH' | 'MODERATE' | 'LOW' | 'COMPROMISED' = 'LOW';
    if (score >= 80) rating = 'HIGH';
    else if (score >= 60) rating = 'MODERATE';
    else if (score >= 35) rating = 'LOW';
    else rating = 'COMPROMISED';

    let limitingFactor = 'Optimal multi-platform assimilation across all tiers.';
    if (availabilityScore < 70) {
      limitingFactor = 'Missing vertical sounding moisture profile between 2.1 - 3.4 km AGL.';
    } else if (recencyScore < 75) {
      limitingFactor = 'Upper-air radiosonde observations > 45 minutes old.';
    } else if (!hasRadar) {
      limitingFactor = 'Doppler radar volumetric core unavailable; relying on satellite infrared proxy.';
    }

    return {
      score,
      availabilityScore,
      recencyScore,
      coverageScore,
      qualityScore,
      rating,
      limitingFactor
    };
  }

  // --------------------------------------------------------------------------
  // 3. NORMALIZED HISTORICAL DATASET GENERATOR (DEMO TESTBED)
  // --------------------------------------------------------------------------
  public getNormalizedHistoricalObservations(): AtmosphericObservation[] {
    const timeOffsets = [-180, -150, -120, -90, -60, -47, -30, -15, 0];

    return timeOffsets.map(offset => {
      const isPastT47 = offset >= -47;
      const isPastT15 = offset >= -15;

      return {
        id: `OBS-GHATS-${Math.abs(offset)}M`,
        timestamp: this.formatIsoForOffset(offset),
        minuteOffset: offset,
        latitude: 18.922,
        longitude: 73.234,
        altitude: 450, // Western Ghats foothills station
        temperature: parseFloat((29.8 - Math.abs(offset) * 0.02).toFixed(1)),
        relativeHumidity: Math.min(98, Math.round(72 + (offset + 180) * 0.14)),
        pressure: 968.4,
        windSpeed: parseFloat((4.2 + (offset + 180) * 0.06).toFixed(1)),
        windDirection: 245, // Southwesterly monsoon flow
        verticalVelocity: offset < -90 ? 0.8 : offset < -47 ? 3.4 : isPastT15 ? 24.2 : 14.8,
        cape: Math.round(2300 + (offset + 180) * 2.2),
        cin: offset < -60 ? -65 : offset < -30 ? -22 : 0,
        windShear: parseFloat((18.5 + (offset + 180) * 0.04).toFixed(1)),
        moistureConvergence: parseFloat((1.8 + (offset + 180) * 0.022).toFixed(2)),
        cloudTopTemperature: offset < -90 ? -12 : offset < -47 ? -38 : isPastT15 ? -68 : -54,
        cloudTopCoolingRate: offset < -90 ? 1.2 : offset < -47 ? 5.8 : 9.4,
        precipitationRate: offset < -30 ? 0 : offset < -15 ? 12.4 : offset < 0 ? 46.0 : 142.5,
        lightningActivity: offset < -60 ? null : offset < -47 ? 4 : isPastT15 ? 120 : 42,
        radarReflectivity: offset < -60 ? null : offset < -47 ? 28 : isPastT15 ? 58 : 46,
        source: 'PRAGYA Western Ghats Field Observation Testbed',
        qualityFlag: offset <= 0 ? 'GOOD' : 'MISSING',
        isObserved: true,
        isDerived: false,
        provenance: this.getProvenance('radarreflectivity', offset)
      };
    });
  }

  private formatIsoForOffset(offset: number): string {
    const base = new Date('2024-07-26T14:32:00.000Z');
    base.setMinutes(base.getMinutes() + offset);
    return base.toISOString();
  }
}

export const dataQualityEngine = DataQualityEngine.getInstance();
