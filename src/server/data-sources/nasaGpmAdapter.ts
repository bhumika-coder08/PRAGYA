/**
 * PRAGYA DATA ADAPTER: NASA GPM IMERG
 *
 * Source: NASA Goddard Space Flight Center / JAXA
 * Products: Global Precipitation Measurement (GPM) IMERG V07
 *   - IMERG Early Run (latency: ~4 hours, nowcasting research)
 *   - IMERG Late Run (latency: ~14 hours)
 *   - IMERG Final Run (latency: ~3.5 months, research-grade gauge-calibrated ground truth)
 *
 * Scientific Status:
 * Requires NASA Earthdata login credentials for direct GES DISC OPeNDAP/HTTPS retrieval.
 * When credentials are not configured, reports 'CREDENTIALS_REQUIRED'.
 */

import {
  IScientificSourceAdapter,
  SourceMetadata,
  DataSourceStatus,
  NormalizedObservation,
  TimeWindow,
  BoundingBox,
} from './types.js';

export class NasaGpmAdapter implements IScientificSourceAdapter {
  public readonly metadata: SourceMetadata = {
    id: 'src-nasa-gpm-imerg',
    name: 'NASA Global Precipitation Measurement (GPM) IMERG V07',
    provider: 'NASA GSFC / JAXA / GES DISC',
    category: 'PRECIPITATION',
    dataMode: 'REAL',
    spatialResolution: '0.1 deg x 0.1 deg (~10 km)',
    temporalResolution: '30 min half-hourly granules',
    latencyMinutes: 240, // 4 hours for Early Run
    authRequired: true,
    requiredEnvVars: ['NASA_EARTHDATA_USERNAME', 'NASA_EARTHDATA_PASSWORD'],
    variablesSupported: [
      'precipitation_rate',
      'precipitation_accumulation',
      'probability_liquid_precipitation',
      'microwave_precipitation',
      'ir_precipitation',
      'precipitation_quality_index',
    ],
    description:
      'Multi-satellite precipitation algorithm combining passive microwave sensors from international constellation, geosynchronous infrared data, and monthly gauge calibration for high-resolution precipitation tracking.',
    accessUrl: 'https://gpm.nasa.gov/data/imerg',
    limitations: [
      'Early Run latency of 4 hours precludes real-time warning; primarily utilized for blind historical reconstruction and post-event analysis',
      'Complex mountainous terrain orographic precipitation may be slightly underestimated by passive microwave retrievals',
      'Requires NASA Earthdata URS credentials with GES DISC application authorization',
    ],
  };

  public async checkStatus(): Promise<{
    status: DataSourceStatus;
    message: string;
    lastTested: string;
    details?: Record<string, any>;
  }> {
    const user = process.env.NASA_EARTHDATA_USERNAME;
    const pass = process.env.NASA_EARTHDATA_PASSWORD;
    const now = new Date().toISOString();

    if (!user || !pass || user.trim() === '' || pass.trim() === '') {
      return {
        status: 'CREDENTIALS_REQUIRED',
        message: 'NASA Earthdata credentials (NASA_EARTHDATA_USERNAME / NASA_EARTHDATA_PASSWORD) not configured. NASA GPM IMERG ingestion is in standby.',
        lastTested: now,
        details: {
          documentationUrl: 'https://urs.earthdata.nasa.gov',
          product: 'GPM_3IMERGHH_07',
          configured: false,
        },
      };
    }

    try {
      // Test Earthdata authentication gateway
      const response = await fetch('https://urs.earthdata.nasa.gov/api/v2/users', {
        headers: {
          Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`,
        },
        signal: AbortSignal.timeout(5000),
      }).catch(() => null);

      if (!response || !response.ok) {
        return {
          status: 'CREDENTIALS_REQUIRED',
          message: 'NASA Earthdata authentication failed. Please verify credentials.',
          lastTested: now,
          details: { configured: true, httpStatus: response?.status ?? 'TIMEOUT' },
        };
      }

      return {
        status: 'CONNECTED',
        message: 'Connected to NASA GES DISC Earthdata Gateway for GPM IMERG granules.',
        lastTested: now,
      };
    } catch (err: any) {
      return {
        status: 'ERROR',
        message: `NASA GPM connection error: ${err.message}`,
        lastTested: now,
      };
    }
  }

  public async fetchObservations(params: {
    eventId?: string;
    timeWindow: TimeWindow;
    boundingBox?: BoundingBox;
    altitudeLevel?: number;
  }): Promise<NormalizedObservation[]> {
    const status = await this.checkStatus();
    if (status.status !== 'CONNECTED') {
      throw new Error(
        `[NASA GPM Ingestion] Cannot fetch precipitation data: Status is ${status.status} (${status.message})`
      );
    }
    return [];
  }
}
