/**
 * PRAGYA CONVECTIVE FEATURE ENGINE
 *
 * Derives fundamental convective, thermodynamic, and kinematic features from normalized observations.
 *
 * STRICT SCIENTIFIC RULE:
 * NEVER fabricate a feature when required source variables are missing.
 * If an input is missing, the feature returns { value: null, qualityStatus: 'MISSING', confidence: 0 }.
 * Always records derivationMethod, sourceVariables, and confidence.
 */

import { NormalizedObservation, QualityStatus } from '../data-sources/types.js';

export interface ConvectiveFeatureResult {
  featureName: string;
  value: number | null;
  unit: string;
  confidence: number; // 0.0 to 1.0
  sourceVariables: string[];
  derivationMethod: string;
  qualityStatus: QualityStatus;
  physicalSignificance: string;
}

export interface AtmosphericStateFeatures {
  timestamp: string;
  latitude: number;
  longitude: number;
  features: Record<string, ConvectiveFeatureResult>;
  summary: {
    totalFeaturesEvaluated: number;
    availableFeaturesCount: number;
    completenessRatio: number;
  };
}

export class ConvectiveFeatureEngine {
  /**
   * Magnus-Tetens formula for saturation vapour pressure over liquid water
   * Es(T) = 6.112 * exp((17.67 * T) / (T + 243.5))  [hPa, T in C]
   */
  public static calculateDewPoint(temperatureC: number | null, rhPercent: number | null): ConvectiveFeatureResult {
    if (temperatureC === null || rhPercent === null || rhPercent <= 0) {
      return {
        featureName: 'dew_point',
        value: null,
        unit: 'degC',
        confidence: 0,
        sourceVariables: ['temperature', 'relative_humidity'],
        derivationMethod: 'Magnus-Tetens psychrometric formulation',
        qualityStatus: 'MISSING',
        physicalSignificance: 'Measure of atmospheric water vapour content; critical for boundary layer saturation.',
      };
    }

    const a = 17.27;
    const b = 237.7;
    const alpha = (a * temperatureC) / (b + temperatureC) + Math.log(rhPercent / 100.0);
    const td = (b * alpha) / (a - alpha);

    return {
      featureName: 'dew_point',
      value: parseFloat(td.toFixed(2)),
      unit: 'degC',
      confidence: 0.95,
      sourceVariables: ['temperature', 'relative_humidity'],
      derivationMethod: 'Magnus-Tetens saturation psychrometric formula',
      qualityStatus: 'VALID',
      physicalSignificance: 'Surface moisture marker. High dew point (>24°C) fuels intense convective updrafts.',
    };
  }

  /**
   * Water Vapour Mixing Ratio (w in g/kg)
   * w ≈ 622 * e / (p - e)
   */
  public static calculateMixingRatio(
    dewPointC: number | null,
    pressureHpa: number | null
  ): ConvectiveFeatureResult {
    if (dewPointC === null || pressureHpa === null || pressureHpa <= 100) {
      return {
        featureName: 'low_level_moisture_mixing_ratio',
        value: null,
        unit: 'g/kg',
        confidence: 0,
        sourceVariables: ['dew_point', 'surface_pressure'],
        derivationMethod: 'Vapour pressure ideal gas law derivation',
        qualityStatus: 'MISSING',
        physicalSignificance: 'Specific moisture mass per unit dry air mass.',
      };
    }

    const e = 6.112 * Math.exp((17.67 * dewPointC) / (dewPointC + 243.5));
    const w = (622.0 * e) / (pressureHpa - e);

    return {
      featureName: 'low_level_moisture_mixing_ratio',
      value: parseFloat(Math.max(0, w).toFixed(2)),
      unit: 'g/kg',
      confidence: 0.92,
      sourceVariables: ['dew_point', 'surface_pressure'],
      derivationMethod: 'Vapour pressure ideal gas law derivation',
      qualityStatus: 'VALID',
      physicalSignificance: 'Boundary layer moisture payload. Values > 18 g/kg indicate extreme convective precipitable potential.',
    };
  }

  /**
   * Wind Speed and Direction from Orthogonal Components (u, v)
   */
  public static calculateWindComponents(u: number | null, v: number | null): {
    speed: ConvectiveFeatureResult;
    direction: ConvectiveFeatureResult;
  } {
    if (u === null || v === null) {
      return {
        speed: {
          featureName: 'wind_speed',
          value: null,
          unit: 'm/s',
          confidence: 0,
          sourceVariables: ['u_wind', 'v_wind'],
          derivationMethod: 'Euclidean vector magnitude',
          qualityStatus: 'MISSING',
          physicalSignificance: 'Horizontal kinematic transport velocity.',
        },
        direction: {
          featureName: 'wind_direction',
          value: null,
          unit: 'deg',
          confidence: 0,
          sourceVariables: ['u_wind', 'v_wind'],
          derivationMethod: 'Meteorological arctangent vector orientation',
          qualityStatus: 'MISSING',
          physicalSignificance: 'Direction from which wind originates.',
        },
      };
    }

    const speed = Math.hypot(u, v);
    // Meteorological direction: 0 = North, 90 = East, 180 = South, 270 = West
    let dir = (Math.atan2(-u, -v) * 180) / Math.PI;
    if (dir < 0) dir += 360;

    return {
      speed: {
        featureName: 'wind_speed',
        value: parseFloat(speed.toFixed(1)),
        unit: 'm/s',
        confidence: 0.98,
        sourceVariables: ['u_wind', 'v_wind'],
        derivationMethod: 'Euclidean vector magnitude',
        qualityStatus: 'VALID',
        physicalSignificance: 'Wind speed at observation level.',
      },
      direction: {
        featureName: 'wind_direction',
        value: parseFloat(dir.toFixed(0)),
        unit: 'deg',
        confidence: 0.98,
        sourceVariables: ['u_wind', 'v_wind'],
        derivationMethod: 'Meteorological arctangent vector orientation',
        qualityStatus: 'VALID',
        physicalSignificance: 'Compass bearing of source flow.',
      },
    };
  }

  /**
   * 0-6 km Bulk Wind Shear Vector Magnitude (m/s)
   */
  public static calculateBulkWindShear(
    uSurface: number | null,
    vSurface: number | null,
    u6km: number | null,
    v6km: number | null
  ): ConvectiveFeatureResult {
    if (uSurface === null || vSurface === null || u6km === null || v6km === null) {
      return {
        featureName: 'vertical_wind_shear_0_6km',
        value: null,
        unit: 'm/s',
        confidence: 0,
        sourceVariables: ['u_surface', 'v_surface', 'u_6km', 'v_6km'],
        derivationMethod: 'Deep-layer bulk vector difference',
        qualityStatus: 'MISSING',
        physicalSignificance: 'Separates updraft from downdraft, sustaining multicellular and supercellular severe convection.',
      };
    }

    const du = u6km - uSurface;
    const dv = v6km - vSurface;
    const shear = Math.hypot(du, dv);

    return {
      featureName: 'vertical_wind_shear_0_6km',
      value: parseFloat(shear.toFixed(1)),
      unit: 'm/s',
      confidence: 0.90,
      sourceVariables: ['u_surface', 'v_surface', 'u_6km', 'v_6km'],
      derivationMethod: 'Deep-layer bulk vector difference (0-6 km)',
      qualityStatus: 'VALID',
      physicalSignificance: 'Shear > 20 m/s enables sustained storm organization and rotating updrafts.',
    };
  }

  /**
   * Evaluates comprehensive convective features for an atmospheric state at time T
   */
  public static extractFeatures(
    observations: NormalizedObservation[],
    targetTime: Date,
    lat: number,
    lon: number
  ): AtmosphericStateFeatures {
    const obsMap = new Map<string, NormalizedObservation>();

    // Select observations strictly available at or before targetTime
    for (const obs of observations) {
      if (obs.availableAt.getTime() <= targetTime.getTime()) {
        const existing = obsMap.get(obs.variable);
        if (!existing || obs.observedAt.getTime() > existing.observedAt.getTime()) {
          obsMap.set(obs.variable, obs);
        }
      }
    }

    const features: Record<string, ConvectiveFeatureResult> = {};

    // 1. Surface Temperature
    const tObs = obsMap.get('temperature');
    features['surface_temperature'] = {
      featureName: 'surface_temperature',
      value: tObs?.value ?? null,
      unit: 'degC',
      confidence: tObs ? (tObs.qualityStatus === 'VALID' ? 1.0 : 0.7) : 0,
      sourceVariables: tObs ? [tObs.variable] : [],
      derivationMethod: tObs?.isDerived ? 'Derived from surface sensors' : 'Direct in-situ telemetry',
      qualityStatus: tObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Surface sensible heating driving buoyant parcel acceleration.',
    };

    // 2. Relative Humidity
    const rhObs = obsMap.get('relative_humidity');
    features['relative_humidity'] = {
      featureName: 'relative_humidity',
      value: rhObs?.value ?? null,
      unit: '%',
      confidence: rhObs ? (rhObs.qualityStatus === 'VALID' ? 1.0 : 0.7) : 0,
      sourceVariables: rhObs ? [rhObs.variable] : [],
      derivationMethod: rhObs?.isDerived ? 'Derived psychrometrically' : 'Direct capacitive hygrometer',
      qualityStatus: rhObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Fraction of saturation vapour pressure reached in boundary layer.',
    };

    // 3. Dew Point
    const tdDirect = obsMap.get('dew_point');
    if (tdDirect && tdDirect.value !== null) {
      features['dew_point'] = {
        featureName: 'dew_point',
        value: tdDirect.value,
        unit: 'degC',
        confidence: tdDirect.qualityStatus === 'VALID' ? 1.0 : 0.7,
        sourceVariables: ['dew_point'],
        derivationMethod: 'Direct sensor measurement',
        qualityStatus: tdDirect.qualityStatus,
        physicalSignificance: 'Measure of atmospheric water vapour content.',
      };
    } else {
      features['dew_point'] = this.calculateDewPoint(
        features['surface_temperature'].value,
        features['relative_humidity'].value
      );
    }

    // 4. Surface Pressure
    const pObs = obsMap.get('surface_pressure') || obsMap.get('mean_sea_level_pressure');
    features['surface_pressure'] = {
      featureName: 'surface_pressure',
      value: pObs?.value ?? null,
      unit: 'hPa',
      confidence: pObs ? 1.0 : 0,
      sourceVariables: pObs ? [pObs.variable] : [],
      derivationMethod: 'Barometric transducer measurement',
      qualityStatus: pObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Synoptic and mesoscale pressure tendency tracking gust fronts.',
    };

    // 5. Low-Level Mixing Ratio
    features['low_level_moisture'] = this.calculateMixingRatio(
      features['dew_point'].value,
      features['surface_pressure'].value
    );

    // 6. Precipitable Water
    const pwObs = obsMap.get('precipitable_water');
    features['precipitable_water'] = {
      featureName: 'precipitable_water',
      value: pwObs?.value ?? null,
      unit: 'mm',
      confidence: pwObs ? (pwObs.qualityStatus === 'VALID' ? 0.95 : 0.6) : 0,
      sourceVariables: pwObs ? [pwObs.variable] : [],
      derivationMethod: 'Integrated atmospheric column sounding / satellite retrieval',
      qualityStatus: pwObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Total column moisture reservoir. Values > 50 mm indicate high flash-flood potential.',
    };

    // 7. CAPE (Convective Available Potential Energy)
    const capeObs = obsMap.get('cape');
    features['cape'] = {
      featureName: 'cape',
      value: capeObs?.value ?? null,
      unit: 'J/kg',
      confidence: capeObs ? (capeObs.qualityStatus === 'VALID' ? 0.95 : 0.6) : 0,
      sourceVariables: capeObs ? [capeObs.variable] : [],
      derivationMethod: 'Thermodynamic parcel ascent sounding integration',
      qualityStatus: capeObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Integrated buoyant energy. CAPE > 2500 J/kg represents violent convective potential.',
    };

    // 8. CIN (Convective Inhibition)
    const cinObs = obsMap.get('cin');
    features['cin'] = {
      featureName: 'cin',
      value: cinObs?.value ?? null,
      unit: 'J/kg',
      confidence: cinObs ? 0.9 : 0,
      sourceVariables: cinObs ? [cinObs.variable] : [],
      derivationMethod: 'Negative buoyant parcel work before Level of Free Convection (LFC)',
      qualityStatus: cinObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Inversion cap preventing premature release. Weak CIN (< 30 J/kg) allows explosive breakthrough.',
    };

    // 9. Radar Reflectivity Max
    const refObs = obsMap.get('reflectivity');
    features['radar_reflectivity'] = {
      featureName: 'radar_reflectivity',
      value: refObs?.value ?? null,
      unit: 'dBZ',
      confidence: refObs ? (refObs.qualityStatus === 'VALID' ? 1.0 : 0.6) : 0,
      sourceVariables: refObs ? [refObs.variable] : [],
      derivationMethod: 'Dual-pol Doppler radar volumetric backscatter',
      qualityStatus: refObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Echo intensity indicating hydrometeor size and density. Reflectivity > 50 dBZ indicates torrential rain/hail.',
    };

    // 10. Cloud Top Temperature
    const cttObs = obsMap.get('cloud_top_temperature');
    features['cloud_top_temperature'] = {
      featureName: 'cloud_top_temperature',
      value: cttObs?.value ?? null,
      unit: 'degC',
      confidence: cttObs ? 0.92 : 0,
      sourceVariables: cttObs ? [cttObs.variable] : [],
      derivationMethod: 'Geostationary 10.8 µm thermal infrared brightness temperature',
      qualityStatus: cttObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Cloud summit altitude indicator. Rapid cooling below -60°C signifies intense overshooting tops.',
    };

    // 11. Vertical Velocity (Updraft)
    const wObs = obsMap.get('vertical_velocity');
    features['vertical_velocity'] = {
      featureName: 'vertical_velocity',
      value: wObs?.value ?? null,
      unit: 'm/s',
      confidence: wObs ? 0.88 : 0,
      sourceVariables: wObs ? [wObs.variable] : [],
      derivationMethod: 'Doppler wind profiler / high-resolution hydrodynamic diagnostic',
      qualityStatus: wObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Core updraft speed lifting heavy precipitation mass aloft.',
    };

    // 12. Precipitation Rate
    const prObs = obsMap.get('precipitation_rate') || obsMap.get('convective_precipitation');
    features['precipitation_rate'] = {
      featureName: 'precipitation_rate',
      value: prObs?.value ?? null,
      unit: 'mm/hr',
      confidence: prObs ? 0.95 : 0,
      sourceVariables: prObs ? [prObs.variable] : [],
      derivationMethod: 'Disdrometer / radar QPE precipitation retrieval',
      qualityStatus: prObs?.qualityStatus ?? 'MISSING',
      physicalSignificance: 'Instantaneous rain rate reaching surface.',
    };

    // Completeness calculations
    const allKeys = Object.keys(features);
    const validCount = allKeys.filter((k) => features[k].value !== null).length;

    return {
      timestamp: targetTime.toISOString(),
      latitude: lat,
      longitude: lon,
      features,
      summary: {
        totalFeaturesEvaluated: allKeys.length,
        availableFeaturesCount: validCount,
        completenessRatio: parseFloat((validCount / allKeys.length).toFixed(3)),
      },
    };
  }
}
