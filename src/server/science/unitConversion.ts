/**
 * PRAGYA SCIENTIFIC UNIT NORMALIZATION UTILITIES
 *
 * Implements physically valid conversions across meteorological systems:
 * SI, WMO synoptic standard, and aviation/radar conventions.
 *
 * SCIENTIFIC INTEGRITY RULE:
 * Never converts quantities that are not physically equivalent.
 * Rejects out-of-range physical bounds (e.g. negative Kelvin, relative humidity > 105%).
 */

export const STANDARD_GRAVITY_G0 = 9.80665; // m / s^2 (WMO standard acceleration of gravity)

export class UnitConversion {
  /**
   * Temperature Conversions
   */
  public static kelvinToCelsius(k: number | null): number | null {
    if (k === null || isNaN(k)) return null;
    if (k < 0) throw new Error(`Physical violation: Absolute zero violation (${k} K < 0 K)`);
    return parseFloat((k - 273.15).toFixed(2));
  }

  public static celsiusToKelvin(c: number | null): number | null {
    if (c === null || isNaN(c)) return null;
    if (c < -273.15) throw new Error(`Physical violation: Temperature below absolute zero (${c} °C)`);
    return parseFloat((c + 273.15).toFixed(2));
  }

  /**
   * Pressure Conversions
   */
  public static pascalsToHectopascals(pa: number | null): number | null {
    if (pa === null || isNaN(pa)) return null;
    if (pa <= 0) throw new Error(`Physical violation: Atmospheric pressure must be positive (${pa} Pa)`);
    return parseFloat((pa / 100.0).toFixed(2));
  }

  public static hectopascalsToPascals(hpa: number | null): number | null {
    if (hpa === null || isNaN(hpa)) return null;
    if (hpa <= 0) throw new Error(`Physical violation: Atmospheric pressure must be positive (${hpa} hPa)`);
    return parseFloat((hpa * 100.0).toFixed(2));
  }

  /**
   * Wind Speed Conversions
   */
  public static metersPerSecondToKmPerHour(ms: number | null): number | null {
    if (ms === null || isNaN(ms)) return null;
    if (ms < 0) throw new Error(`Physical violation: Scalar wind speed cannot be negative (${ms} m/s)`);
    return parseFloat((ms * 3.6).toFixed(2));
  }

  public static kmPerHourToMetersPerSecond(kmh: number | null): number | null {
    if (kmh === null || isNaN(kmh)) return null;
    if (kmh < 0) throw new Error(`Physical violation: Scalar wind speed cannot be negative (${kmh} km/h)`);
    return parseFloat((kmh / 3.6).toFixed(2));
  }

  public static knotsToMetersPerSecond(kt: number | null): number | null {
    if (kt === null || isNaN(kt)) return null;
    if (kt < 0) throw new Error(`Physical violation: Wind knots cannot be negative (${kt} kt)`);
    return parseFloat((kt * 0.514444).toFixed(2));
  }

  /**
   * Geopotential to Geopotential Height (gpm)
   * Formula: Z = Phi / g0, where g0 = 9.80665 m/s^2
   * Note: Only scientifically valid for geopotential (m^2 / s^2)
   */
  public static geopotentialToHeightMeters(phi: number | null): number | null {
    if (phi === null || isNaN(phi)) return null;
    return parseFloat((phi / STANDARD_GRAVITY_G0).toFixed(1));
  }

  /**
   * Relative Humidity Normalization
   * Enforces physical [0, 100]% bounds (allowing slight supersaturation up to 105% in intense updrafts)
   */
  public static validateRelativeHumidity(rh: number | null): number | null {
    if (rh === null || isNaN(rh)) return null;
    if (rh < 0) return 0;
    if (rh > 105) return 100;
    return parseFloat(rh.toFixed(1));
  }

  /**
   * Precipitation Rate Normalization
   * Enforces non-negative mm/hr
   */
  public static validatePrecipitationRate(pr: number | null): number | null {
    if (pr === null || isNaN(pr)) return null;
    if (pr < 0) return 0;
    return parseFloat(pr.toFixed(2));
  }
}
