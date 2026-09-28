/**
 * PRAGYA PRECURSOR SIGNAL ENGINE
 *
 * Scans chronological atmospheric observation trajectories to detect early pre-convective precursors.
 *
 * SCIENTIFIC INTEGRITY RULE:
 * Never claims causal proof or physical certainty.
 * Uses honest scientific terminology: "signal detected", "consistent with increasing convective potential",
 * "experimental precursor", never "this caused the storm".
 */

import { NormalizedObservation } from '../data-sources/types.js';
import { ConvectiveFeatureEngine } from './convectiveFeatureEngine.js';

export type PrecursorType =
  | 'MOISTURE_BUILDUP'
  | 'INSTABILITY_GROWTH'
  | 'CIN_EROSION'
  | 'SHEAR_ORGANIZATION'
  | 'CLOUD_TOP_COOLING'
  | 'PRECIPITATION_ACCELERATION'
  | 'PRESSURE_CHANGE'
  | 'UPDRAFT_SIGNAL'
  | 'CONVERGENCE_SIGNAL'
  | 'OBSERVATIONAL_GAP';

export interface PrecursorSignal {
  id: string;
  type: PrecursorType;
  detectedAt: string; // ISO 8601
  strength: number;   // 0.0 to 1.0 (magnitude of anomaly)
  confidence: number; // 0.0 to 1.0 (evidence reliability)
  leadTimeMinutes?: number;
  supportingVariables: string[];
  sourceObservations: string[];
  description: string;
  scientificContext: string;
}

export class PrecursorSignalEngine {
  /**
   * Scans observation history up to replayTime T for emergent precursors
   */
  public static detectPrecursors(
    observations: NormalizedObservation[],
    replayTime: Date,
    lat: number,
    lon: number,
    lookbackMinutes: number = 120
  ): PrecursorSignal[] {
    const replayMs = replayTime.getTime();
    const lookbackMs = lookbackMinutes * 60 * 1000;
    const windowStartMs = replayMs - lookbackMs;

    // Filter strictly available observations in the window
    const windowObs = observations.filter(
      (o) =>
        o.availableAt.getTime() <= replayMs &&
        o.observedAt.getTime() >= windowStartMs &&
        o.observedAt.getTime() <= replayMs
    );

    const signals: PrecursorSignal[] = [];

    // Helper: sort observation list chronologically
    const getVarSeries = (varName: string) =>
      windowObs
        .filter((o) => o.variable === varName && o.value !== null)
        .sort((a, b) => a.observedAt.getTime() - b.observedAt.getTime());

    // 1. MOISTURE_BUILDUP (Precipitable water or dew point trend)
    const pwSeries = getVarSeries('precipitable_water');
    if (pwSeries.length >= 2) {
      const first = pwSeries[0].value as number;
      const last = pwSeries[pwSeries.length - 1].value as number;
      const delta = last - first;
      const percentGain = (delta / first) * 100;

      if (last > 50 && delta > 4) {
        signals.push({
          id: `pre-moisture-${replayMs}`,
          type: 'MOISTURE_BUILDUP',
          detectedAt: pwSeries[pwSeries.length - 1].observedAt.toISOString(),
          strength: Math.min(1.0, parseFloat((last / 75).toFixed(2))),
          confidence: 0.88,
          supportingVariables: ['precipitable_water'],
          sourceObservations: [pwSeries[0].id, pwSeries[pwSeries.length - 1].id],
          description: `Experimental signal detected: Column precipitable water increased by ${delta.toFixed(1)} mm (+${percentGain.toFixed(0)}%) reaching ${last.toFixed(1)} mm.`,
          scientificContext: 'Consistent with rapid pre-convective moisture advection and boundary layer convergence necessary for torrential precipitation.',
        });
      }
    }

    // 2. INSTABILITY_GROWTH (CAPE evolution)
    const capeSeries = getVarSeries('cape');
    if (capeSeries.length >= 2) {
      const first = capeSeries[0].value as number;
      const last = capeSeries[capeSeries.length - 1].value as number;
      const delta = last - first;

      if (last >= 2000 && delta > 400) {
        signals.push({
          id: `pre-cape-${replayMs}`,
          type: 'INSTABILITY_GROWTH',
          detectedAt: capeSeries[capeSeries.length - 1].observedAt.toISOString(),
          strength: Math.min(1.0, parseFloat((last / 4000).toFixed(2))),
          confidence: 0.85,
          supportingVariables: ['cape'],
          sourceObservations: [capeSeries[0].id, capeSeries[capeSeries.length - 1].id],
          description: `Instability growth observed: Convective Available Potential Energy (CAPE) surged +${delta.toFixed(0)} J/kg to ${last.toFixed(0)} J/kg.`,
          scientificContext: 'Indicates high thermodynamic buoyancy. The atmosphere exhibits strong thermodynamic destabilization.',
        });
      }
    }

    // 3. CLOUD_TOP_COOLING (Infrared brightness temperature plunge)
    const cttSeries = getVarSeries('cloud_top_temperature');
    if (cttSeries.length >= 2) {
      const first = cttSeries[0].value as number;
      const last = cttSeries[cttSeries.length - 1].value as number;
      const dtMin = Math.max(1, (cttSeries[cttSeries.length - 1].observedAt.getTime() - cttSeries[0].observedAt.getTime()) / 60000);
      const coolingRateKMin = (first - last) / dtMin; // positive = cooling

      if (coolingRateKMin > 0.4 && last < -35) {
        signals.push({
          id: `pre-ctt-${replayMs}`,
          type: 'CLOUD_TOP_COOLING',
          detectedAt: cttSeries[cttSeries.length - 1].observedAt.toISOString(),
          strength: Math.min(1.0, parseFloat((coolingRateKMin / 1.5).toFixed(2))),
          confidence: 0.92,
          supportingVariables: ['cloud_top_temperature'],
          sourceObservations: [cttSeries[0].id, cttSeries[cttSeries.length - 1].id],
          description: `Vigorous cloud summit ascent: Infrared cloud top cooled at ${coolingRateKMin.toFixed(2)} K/min, reaching ${last.toFixed(1)}°C.`,
          scientificContext: 'Consistent with rapid vertical updraft penetration reaching upper tropospheric equilibrium levels.',
        });
      }
    }

    // 4. UPDRAFT_SIGNAL (Radar Doppler radial velocity or vertical velocity surge)
    const wSeries = getVarSeries('vertical_velocity');
    if (wSeries.length > 0) {
      const maxW = Math.max(...wSeries.map((s) => s.value as number));
      if (maxW >= 8.0) {
        signals.push({
          id: `pre-updraft-${replayMs}`,
          type: 'UPDRAFT_SIGNAL',
          detectedAt: wSeries[wSeries.length - 1].observedAt.toISOString(),
          strength: Math.min(1.0, parseFloat((maxW / 20.0).toFixed(2))),
          confidence: 0.82,
          supportingVariables: ['vertical_velocity'],
          sourceObservations: [wSeries[wSeries.length - 1].id],
          description: `Intense updraft core detected: Maximum vertical velocity reached ${maxW.toFixed(1)} m/s.`,
          scientificContext: 'Strong vertical updraft pulses support high hydrometeor suspension, a primary precursor to cloudburst release.',
        });
      }
    }

    // 5. PRECIPITATION_ACCELERATION (Radar reflectivity surge aloft)
    const refSeries = getVarSeries('reflectivity');
    if (refSeries.length >= 2) {
      const first = refSeries[0].value as number;
      const last = refSeries[refSeries.length - 1].value as number;
      const delta = last - first;

      if (last >= 45 && delta >= 15) {
        signals.push({
          id: `pre-ref-${replayMs}`,
          type: 'PRECIPITATION_ACCELERATION',
          detectedAt: refSeries[refSeries.length - 1].observedAt.toISOString(),
          strength: Math.min(1.0, parseFloat((last / 65).toFixed(2))),
          confidence: 0.94,
          supportingVariables: ['reflectivity'],
          sourceObservations: [refSeries[0].id, refSeries[refSeries.length - 1].id],
          description: `Rapid radar echo intensification: Core reflectivity grew by +${delta.toFixed(0)} dBZ to ${last.toFixed(1)} dBZ.`,
          scientificContext: 'Marks rapid cloud droplet coalescence and hail/graupel loading aloft prior to downburst collapse.',
        });
      }
    }

    // 6. OBSERVATIONAL_GAP (Identifies missing high-impact sensors)
    const hasRadar = windowObs.some((o) => o.variable === 'reflectivity' && o.value !== null);
    const hasSat = windowObs.some((o) => o.variable === 'cloud_top_temperature' && o.value !== null);

    if (!hasRadar) {
      signals.push({
        id: `pre-gap-radar-${replayMs}`,
        type: 'OBSERVATIONAL_GAP',
        detectedAt: replayTime.toISOString(),
        strength: 0.75,
        confidence: 0.95,
        supportingVariables: ['reflectivity'],
        sourceObservations: [],
        description: 'Observational gap detected: Doppler radar volume scans unavailable at target coordinates.',
        scientificContext: 'Absence of radar volumetric backscatter limits near-surface downburst lead-time assessment.',
      });
    }

    return signals;
  }
}
