/**
 * PRAGYA SCIENTIFIC MODEL INTERFACE & TRANSPARENT BASELINES
 *
 * ML-ready architecture for convective predictability research.
 *
 * SCIENTIFIC INTEGRITY RULES:
 * 1. Models that have not been trained on real historical datasets report 'NOT_TRAINED'.
 * 2. Transparent baselines (Persistence, Threshold Rule, Feature Trend, Ensemble Agreement)
 *    provide transparent research comparison points.
 * 3. Never invent fake model coefficients, weights, or ungrounded accuracy metrics.
 */

import { ConvectiveFeatureResult } from '../science/convectiveFeatureEngine.js';

export type ModelStatus = 'TRAINED' | 'NOT_TRAINED' | 'HEURISTIC_BASELINE' | 'EXPERIMENTAL';

export interface ModelPrediction {
  timestamp: string;
  leadTimeMinutes: number;
  eventRisk: number;              // 0.0 to 1.0 (How favorable is the atmosphere?)
  predictability: number;         // 0.0 to 1.0 (How strongly does evidence constrain the future?)
  observationConfidence: number;  // 0.0 to 1.0 (How complete and reliable is evidence?)
  predictabilityHorizonReached: boolean;
  explanation: {
    keyDrivers: string[];
    limitingFactors: string[];
    evidenceSummary: string;
  };
}

export interface IScientificModel {
  name: string;
  version: string;
  modelType: string;
  status: ModelStatus;
  trainingDatasetReference?: string;
  getVersion(): string;
  prepareFeatures(rawFeatures: Record<string, ConvectiveFeatureResult>): Record<string, number | null>;
  predict(features: Record<string, number | null>, leadTimeMinutes: number): Promise<ModelPrediction>;
  explain(prediction: ModelPrediction): string;
}

// -----------------------------------------------------------------------------
// 1. PERSISTENCE BASELINE MODEL
// -----------------------------------------------------------------------------
export class PersistenceBaselineModel implements IScientificModel {
  public readonly name = 'Persistence Baseline (Nowcasting Control)';
  public readonly version = '1.0.0-baseline';
  public readonly modelType = 'PERSISTENCE_HEURISTIC';
  public readonly status: ModelStatus = 'HEURISTIC_BASELINE';

  public getVersion(): string {
    return this.version;
  }

  public prepareFeatures(rawFeatures: Record<string, ConvectiveFeatureResult>): Record<string, number | null> {
    return {
      radar_reflectivity: rawFeatures['radar_reflectivity']?.value ?? null,
      precipitation_rate: rawFeatures['precipitation_rate']?.value ?? null,
    };
  }

  public async predict(features: Record<string, number | null>, leadTimeMinutes: number): Promise<ModelPrediction> {
    const ref = features['radar_reflectivity'];
    // Persistence assumes current radar echo will persist unchanged into future
    const currentRisk = ref !== null ? Math.min(1.0, Math.max(0, (ref - 20) / 40)) : 0.1;
    // Predictability decays rapidly with lead time under pure persistence (decay time constant: ~30 min)
    const decay = Math.exp(-leadTimeMinutes / 30);
    const pred = parseFloat((currentRisk * decay).toFixed(2));

    return {
      timestamp: new Date().toISOString(),
      leadTimeMinutes,
      eventRisk: parseFloat(currentRisk.toFixed(2)),
      predictability: pred,
      observationConfidence: ref !== null ? 0.9 : 0.2,
      predictabilityHorizonReached: pred >= 0.7,
      explanation: {
        keyDrivers: [`Current reflectivity state: ${ref ?? 'unobserved'} dBZ`],
        limitingFactors: ['Persistence assumes zero convective growth or dissipation'],
        evidenceSummary: `Lagrangian persistence assumes echo advection without morphological evolution. Predictability decays at lead time +${leadTimeMinutes}m.`,
      },
    };
  }

  public explain(prediction: ModelPrediction): string {
    return `Baseline assuming atmospheric state remains static. Predictability = ${prediction.predictability} at +${prediction.leadTimeMinutes} min.`;
  }
}

// -----------------------------------------------------------------------------
// 2. THRESHOLD RULE BASELINE MODEL
// -----------------------------------------------------------------------------
export class ThresholdRuleBaselineModel implements IScientificModel {
  public readonly name = 'Physical Thermodynamic Threshold Rule Baseline';
  public readonly version = '1.0.0-rule';
  public readonly modelType = 'EXPERT_RULE_HEURISTIC';
  public readonly status: ModelStatus = 'HEURISTIC_BASELINE';

  public getVersion(): string {
    return this.version;
  }

  public prepareFeatures(rawFeatures: Record<string, ConvectiveFeatureResult>): Record<string, number | null> {
    return {
      cape: rawFeatures['cape']?.value ?? null,
      precipitable_water: rawFeatures['precipitable_water']?.value ?? null,
      radar_reflectivity: rawFeatures['radar_reflectivity']?.value ?? null,
      dew_point: rawFeatures['dew_point']?.value ?? null,
    };
  }

  public async predict(features: Record<string, number | null>, leadTimeMinutes: number): Promise<ModelPrediction> {
    const cape = features['cape'] ?? 0;
    const pw = features['precipitable_water'] ?? 0;
    const ref = features['radar_reflectivity'] ?? 0;

    let satisfiedRules = 0;
    const drivers: string[] = [];

    if (cape >= 2500) {
      satisfiedRules++;
      drivers.push(`High CAPE (${cape.toFixed(0)} J/kg >= 2500 threshold)`);
    }
    if (pw >= 50) {
      satisfiedRules++;
      drivers.push(`High Column Precipitable Water (${pw.toFixed(1)} mm >= 50 threshold)`);
    }
    if (ref >= 45) {
      satisfiedRules++;
      drivers.push(`Radar reflectivity surge (${ref.toFixed(1)} dBZ >= 45 threshold)`);
    }

    const risk = parseFloat((satisfiedRules / 3.0).toFixed(2));
    const pred = satisfiedRules === 3 ? 0.78 : satisfiedRules === 2 ? 0.52 : 0.25;

    return {
      timestamp: new Date().toISOString(),
      leadTimeMinutes,
      eventRisk: risk,
      predictability: pred,
      observationConfidence: 0.85,
      predictabilityHorizonReached: pred >= 0.7,
      explanation: {
        keyDrivers: drivers.length > 0 ? drivers : ['No critical meteorological thresholds exceeded'],
        limitingFactors: ['Static thresholds do not capture dynamic triggers or mid-level dry slots'],
        evidenceSummary: `${satisfiedRules}/3 critical physical thresholds exceeded at lead time +${leadTimeMinutes} min.`,
      },
    };
  }

  public explain(prediction: ModelPrediction): string {
    return `Evaluates classical meteorological thresholds (CAPE, Precipitable Water, Reflectivity). Current score: ${prediction.predictability}.`;
  }
}

// -----------------------------------------------------------------------------
// 3. STATISTICAL / GRADIENT BOOSTED MODEL (ML Interface Ready)
// -----------------------------------------------------------------------------
export class GradientBoostedConvectiveModel implements IScientificModel {
  public readonly name = 'PRAGYA Gradient-Boosted Convective Genesis Model';
  public readonly version = '0.1.0-candidate';
  public readonly modelType = 'GRADIENT_BOOSTED_TREES';
  public readonly status: ModelStatus = 'NOT_TRAINED'; // Transparently un-trained until large dataset assimilated!

  public getVersion(): string {
    return this.version;
  }

  public prepareFeatures(rawFeatures: Record<string, ConvectiveFeatureResult>): Record<string, number | null> {
    const res: Record<string, number | null> = {};
    for (const [k, v] of Object.entries(rawFeatures)) {
      res[k] = v.value;
    }
    return res;
  }

  public async predict(features: Record<string, number | null>, leadTimeMinutes: number): Promise<ModelPrediction> {
    // SCIENTIFIC HONESTY: Model is in architecture-ready stage awaiting historical event training
    return {
      timestamp: new Date().toISOString(),
      leadTimeMinutes,
      eventRisk: 0.0,
      predictability: 0.0,
      observationConfidence: 0.0,
      predictabilityHorizonReached: false,
      explanation: {
        keyDrivers: [],
        limitingFactors: ['Model weights not trained on verified multi-year radar/AWS ground truth'],
        evidenceSummary: 'STATUS: NOT_TRAINED. In accordance with PRAGYA scientific rules, un-trained statistical models will never output fabricated probabilities.',
      },
    };
  }

  public explain(): string {
    return 'Gradient-Boosted Trees architecture interface for future ML training against IMD Doppler archives.';
  }
}
