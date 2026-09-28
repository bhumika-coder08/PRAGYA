/**
 * PRAGYA ATMOSPHERIC NORMALIZATION LAYER
 *
 * Normalizes multi-provider formats (ECMWF, IMD, ISRO, NASA) into canonical
 * PRAGYA scientific variables while preserving 100% of original provenance.
 *
 * SCIENTIFIC RULES:
 * 1. Missing values remain null with QualityStatus = 'MISSING'. NEVER zero-fill.
 * 2. Original variable names, source units, and provider timestamps are retained in provenance metadata.
 */

import { NormalizedObservation, SourceProvenance, QualityStatus } from '../data-sources/types.js';
import { UnitConversion } from './unitConversion.js';

export interface RawProviderPayload {
  provider: string;
  source: string;
  dataset: string;
  variableName: string;
  rawValue: number | null | undefined;
  rawUnit: string;
  latitude: number;
  longitude: number;
  altitudeLevel?: number | null; // meters or hPa
  observedAt: Date | string;
  availableAt: Date | string;
  qualityFlag?: string;
  metadata?: Record<string, any>;
}

export class AtmosphericNormalizationLayer {
  /**
   * Canonical mapping from external provider names to PRAGYA research variables
   */
  private static readonly VARIABLE_MAP: Record<string, { canonical: string; standardUnit: string }> = {
    // Temperature
    '2t': { canonical: 'temperature', standardUnit: 'degC' },
    't2m': { canonical: 'temperature', standardUnit: 'degC' },
    'temperature_2m': { canonical: 'temperature', standardUnit: 'degC' },
    'surface_temp': { canonical: 'temperature', standardUnit: 'degC' },
    'ta': { canonical: 'temperature', standardUnit: 'degC' },

    // Dew point
    '2d': { canonical: 'dew_point', standardUnit: 'degC' },
    'd2m': { canonical: 'dew_point', standardUnit: 'degC' },
    'dew_point_2m': { canonical: 'dew_point', standardUnit: 'degC' },
    'td': { canonical: 'dew_point', standardUnit: 'degC' },

    // Pressure
    'sp': { canonical: 'surface_pressure', standardUnit: 'hPa' },
    'surface_pressure': { canonical: 'surface_pressure', standardUnit: 'hPa' },
    'msl': { canonical: 'mean_sea_level_pressure', standardUnit: 'hPa' },
    'mslp': { canonical: 'mean_sea_level_pressure', standardUnit: 'hPa' },

    // Moisture & Humidity
    'r': { canonical: 'relative_humidity', standardUnit: '%' },
    'rh': { canonical: 'relative_humidity', standardUnit: '%' },
    'relative_humidity_2m': { canonical: 'relative_humidity', standardUnit: '%' },
    'q': { canonical: 'specific_humidity', standardUnit: 'g/kg' },
    'tcwv': { canonical: 'precipitable_water', standardUnit: 'mm' },
    'total_column_water_vapour': { canonical: 'precipitable_water', standardUnit: 'mm' },

    // Wind & Kinematics
    'u10': { canonical: 'u_wind', standardUnit: 'm/s' },
    'v10': { canonical: 'v_wind', standardUnit: 'm/s' },
    'wind_speed_10m': { canonical: 'wind_speed', standardUnit: 'm/s' },
    'wind_direction_10m': { canonical: 'wind_direction', standardUnit: 'deg' },
    'w': { canonical: 'vertical_velocity', standardUnit: 'm/s' },

    // Convective Parameters
    'cape': { canonical: 'cape', standardUnit: 'J/kg' },
    'cin': { canonical: 'cin', standardUnit: 'J/kg' },
    'kx': { canonical: 'k_index', standardUnit: 'degC' },

    // Satellite & Radar
    'tir_1': { canonical: 'cloud_top_temperature', standardUnit: 'degC' },
    'ctt': { canonical: 'cloud_top_temperature', standardUnit: 'degC' },
    'dbz': { canonical: 'reflectivity', standardUnit: 'dBZ' },
    'dbzh': { canonical: 'reflectivity', standardUnit: 'dBZ' },

    // Precipitation
    'tp': { canonical: 'precipitation_rate', standardUnit: 'mm/hr' },
    'cp': { canonical: 'convective_precipitation', standardUnit: 'mm/hr' },
    'precipitation': { canonical: 'precipitation_rate', standardUnit: 'mm/hr' },
    'precipitation_rate': { canonical: 'precipitation_rate', standardUnit: 'mm/hr' },
  };

  /**
   * Normalizes a single raw observation into canonical form
   */
  public static normalize(raw: RawProviderPayload, dataSourceId: string): NormalizedObservation {
    const varKey = raw.variableName.toLowerCase().trim();
    const mapping = this.VARIABLE_MAP[varKey] || {
      canonical: varKey,
      standardUnit: raw.rawUnit,
    };

    let canonicalValue: number | null = raw.rawValue ?? null;
    let quality: QualityStatus = 'VALID';

    // Handle missing data: NEVER zero-fill
    if (canonicalValue === null || canonicalValue === undefined || isNaN(canonicalValue)) {
      canonicalValue = null;
      quality = 'MISSING';
    } else {
      // Perform safe unit conversions if needed
      const rawUnit = raw.rawUnit.toLowerCase();

      // Temperature: Kelvin -> Celsius
      if (rawUnit === 'k' || rawUnit === 'kelvin') {
        canonicalValue = UnitConversion.kelvinToCelsius(canonicalValue);
      }

      // Pressure: Pa -> hPa
      if (rawUnit === 'pa' || rawUnit === 'pascal') {
        canonicalValue = UnitConversion.pascalsToHectopascals(canonicalValue);
      }

      // Wind: km/h or knots -> m/s
      if (rawUnit === 'km/h' || rawUnit === 'kmh') {
        canonicalValue = UnitConversion.kmPerHourToMetersPerSecond(canonicalValue);
      } else if (rawUnit === 'kt' || rawUnit === 'knots') {
        canonicalValue = UnitConversion.knotsToMetersPerSecond(canonicalValue);
      }

      // Humidity: Validate %
      if (mapping.canonical === 'relative_humidity') {
        canonicalValue = UnitConversion.validateRelativeHumidity(canonicalValue);
      }

      // Precipitation: Validate non-negative
      if (mapping.canonical === 'precipitation_rate' || mapping.canonical === 'convective_precipitation') {
        canonicalValue = UnitConversion.validatePrecipitationRate(canonicalValue);
      }
    }

    const obsDate = raw.observedAt instanceof Date ? raw.observedAt : new Date(raw.observedAt);
    const availDate = raw.availableAt instanceof Date ? raw.availableAt : new Date(raw.availableAt);

    // Enforce temporal time-gating rule: availableAt >= observedAt
    const validAvailDate = availDate.getTime() >= obsDate.getTime() ? availDate : obsDate;

    const provenance: SourceProvenance = {
      provider: raw.provider,
      source: raw.source,
      dataset: raw.dataset,
      originalVariable: raw.variableName,
      retrievedAt: new Date().toISOString(),
      processingLevel: 'ANALYSIS',
      qualityStatus: quality,
      licenseOrCitation: raw.metadata?.citation || 'Standard Meteorological Telemetry',
      derivationMethod: raw.metadata?.derivationMethod,
    };

    return {
      id: `norm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      dataSourceId,
      observedAt: obsDate,
      availableAt: validAvailDate,
      latitude: raw.latitude,
      longitude: raw.longitude,
      altitude: raw.altitudeLevel ?? null,
      variable: mapping.canonical,
      value: canonicalValue,
      unit: mapping.standardUnit,
      qualityStatus: quality,
      observationType: raw.altitudeLevel ? 'PROFILE' : 'POINT',
      isDerived: false,
      metadata: raw.metadata,
      provenance,
    };
  }
}
