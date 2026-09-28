/**
 * PRAGYA SPATIOTEMPORAL ALIGNMENT LAYER
 *
 * Aligns heterogeneous multi-sensor observations across differing space-time grids:
 * - Nearest-time matching with latency guard
 * - Time-window temporal aggregation (mean, max, min)
 * - Nearest-grid-cell spatial selection (Haversine distance)
 * - Bounding-box domain filtering
 * - Altitude / pressure-level vertical column slicing
 *
 * SCIENTIFIC INTEGRITY RULE:
 * Never performs mathematical interpolation and pretends it is directly measured data.
 * When spatial or temporal interpolation is performed, the output observation is
 * explicitly flagged as 'INTERPOLATED' and the derivation method is logged in provenance.
 */

import { NormalizedObservation, BoundingBox } from '../data-sources/types.js';

export interface AlignmentOptions {
  targetTime: Date;
  timeToleranceMinutes?: number; // default: 30 min
  targetCoordinates?: { lat: number; lon: number };
  maxDistanceKm?: number;        // default: 50 km
  targetAltitude?: number;       // meters or hPa
  altitudeTolerance?: number;
}

export class SpatiotemporalAlignment {
  /**
   * Earth's mean radius in kilometers
   */
  private static readonly EARTH_RADIUS_KM = 6371.0;

  /**
   * Computes great-circle Haversine distance in kilometers between two geographic coordinates
   */
  public static haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180.0;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS_KM * c;
  }

  /**
   * Filters observations within a bounding box
   */
  public static filterByBoundingBox(
    observations: NormalizedObservation[],
    box: BoundingBox
  ): NormalizedObservation[] {
    return observations.filter(
      (obs) =>
        obs.latitude >= box.south &&
        obs.latitude <= box.north &&
        obs.longitude >= box.west &&
        obs.longitude <= box.east
    );
  }

  /**
   * Finds the nearest observation in time (strictly respecting availability at targetTime)
   */
  public static findNearestTime(
    observations: NormalizedObservation[],
    variable: string,
    targetTime: Date,
    toleranceMinutes: number = 30
  ): NormalizedObservation | null {
    const targetMs = targetTime.getTime();
    const toleranceMs = toleranceMinutes * 60 * 1000;

    let closest: NormalizedObservation | null = null;
    let minDiffMs = Infinity;

    for (const obs of observations) {
      if (obs.variable !== variable) continue;

      // STRICT TEMPORAL TIME-GATING: Available time must not leak future data!
      if (obs.availableAt.getTime() > targetMs) continue;

      const diffMs = Math.abs(targetMs - obs.observedAt.getTime());
      if (diffMs <= toleranceMs && diffMs < minDiffMs) {
        minDiffMs = diffMs;
        closest = obs;
      }
    }

    return closest;
  }

  /**
   * Finds the nearest grid cell or observation station to target coordinate
   */
  public static findNearestSpatial(
    observations: NormalizedObservation[],
    variable: string,
    targetLat: number,
    targetLon: number,
    maxDistanceKm: number = 50
  ): NormalizedObservation | null {
    let closest: NormalizedObservation | null = null;
    let minDistance = Infinity;

    for (const obs of observations) {
      if (obs.variable !== variable) continue;

      const dist = this.haversineDistanceKm(targetLat, targetLon, obs.latitude, obs.longitude);
      if (dist <= maxDistanceKm && dist < minDistance) {
        minDistance = dist;
        closest = obs;
      }
    }

    return closest;
  }

  /**
   * Time-window aggregation (mean or maximum) over a temporal interval [windowStart, windowEnd]
   */
  public static aggregateTimeWindow(
    observations: NormalizedObservation[],
    variable: string,
    windowStart: Date,
    windowEnd: Date,
    aggregation: 'MEAN' | 'MAX' | 'MIN' | 'SUM' = 'MEAN'
  ): { value: number | null; count: number; quality: 'VALID' | 'INTERPOLATED' | 'MISSING' } {
    const startMs = windowStart.getTime();
    const endMs = windowEnd.getTime();

    const matches = observations.filter(
      (obs) =>
        obs.variable === variable &&
        obs.value !== null &&
        obs.observedAt.getTime() >= startMs &&
        obs.observedAt.getTime() <= endMs
    );

    if (matches.length === 0) {
      return { value: null, count: 0, quality: 'MISSING' };
    }

    const values = matches.map((m) => m.value as number);

    let aggValue: number;
    if (aggregation === 'MAX') {
      aggValue = Math.max(...values);
    } else if (aggregation === 'MIN') {
      aggValue = Math.min(...values);
    } else if (aggregation === 'SUM') {
      aggValue = values.reduce((a, b) => a + b, 0);
    } else {
      aggValue = values.reduce((a, b) => a + b, 0) / values.length;
    }

    return {
      value: parseFloat(aggValue.toFixed(2)),
      count: matches.length,
      quality: 'VALID',
    };
  }

  /**
   * Bilinear spatial interpolation between surrounding 4 grid points.
   * STRICT: Marks quality status as 'INTERPOLATED' and logs derivation method.
   */
  public static interpolateGridCell(
    observations: NormalizedObservation[],
    variable: string,
    targetLat: number,
    targetLon: number,
    targetTime: Date
  ): NormalizedObservation | null {
    const relevant = observations.filter(
      (obs) =>
        obs.variable === variable &&
        obs.value !== null &&
        obs.availableAt.getTime() <= targetTime.getTime() &&
        Math.abs(obs.latitude - targetLat) < 0.5 &&
        Math.abs(obs.longitude - targetLon) < 0.5
    );

    if (relevant.length < 2) {
      // Insufficient points for interpolation; return nearest if available without claiming interpolation
      return this.findNearestSpatial(observations, variable, targetLat, targetLon, 35);
    }

    // Inverse distance weighting interpolation
    let weightedSum = 0;
    let weightTotal = 0;

    for (const pt of relevant) {
      const dist = Math.max(0.1, this.haversineDistanceKm(targetLat, targetLon, pt.latitude, pt.longitude));
      const weight = 1.0 / (dist * dist);
      weightedSum += (pt.value as number) * weight;
      weightTotal += weight;
    }

    const interpolatedVal = parseFloat((weightedSum / weightTotal).toFixed(2));
    const sample = relevant[0];

    return {
      id: `interp-${Date.now()}`,
      eventId: sample.eventId,
      dataSourceId: sample.dataSourceId,
      observedAt: sample.observedAt,
      availableAt: sample.availableAt,
      latitude: targetLat,
      longitude: targetLon,
      altitude: sample.altitude,
      variable,
      value: interpolatedVal,
      unit: sample.unit,
      qualityStatus: 'INTERPOLATED',
      observationType: 'GRID',
      isDerived: true,
      metadata: {
        pointsSampled: relevant.length,
        derivationMethod: 'Inverse Distance Weighted (IDW) spatial interpolation',
      },
      provenance: {
        ...sample.provenance,
        processingLevel: 'L3',
        qualityStatus: 'INTERPOLATED',
        derivationMethod: 'Inverse Distance Weighted (IDW) spatial interpolation',
      },
    };
  }
}
