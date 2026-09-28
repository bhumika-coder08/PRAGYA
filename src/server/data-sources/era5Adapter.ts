/**
 * PRAGYA DATA ADAPTER: COPERNICUS ECMWF ERA5 REANALYSIS
 *
 * Source: ECMWF / Copernicus Climate Change Service (C3S)
 * Products: ERA5 hourly data on single levels & pressure levels (1940 to present)
 *
 * Scientific Status:
 * Reanalysis synthesizes physical model physics with global observations via 4D-Var data assimilation.
 * STRICT SCIENTIFIC RULE:
 * ERA5 is strictly a retrospective research and baseline reconstruction source.
 * It is NEVER described or presented as a real-time operational nowcasting observation.
 * Requires CDS API key (UID:Key) for retrieval.
 */

import {
  IScientificSourceAdapter,
  SourceMetadata,
  DataSourceStatus,
  NormalizedObservation,
  TimeWindow,
  BoundingBox,
} from './types.js';

export class Era5Adapter implements IScientificSourceAdapter {
  public readonly metadata: SourceMetadata = {
    id: 'src-copernicus-era5',
    name: 'Copernicus ECMWF ERA5 Atmospheric Reanalysis',
    provider: 'European Centre for Medium-Range Weather Forecasts (ECMWF) / C3S',
    category: 'REANALYSIS',
    dataMode: 'REANALYSIS',
    spatialResolution: '0.25 deg x 0.25 deg (~31 km globally)',
    temporalResolution: '1 hour synoptic intervals',
    latencyMinutes: 7200, // ~5 days for ERA5T, ~2-3 months for quality-assured ERA5
    authRequired: true,
    requiredEnvVars: ['CDS_API_KEY'],
    variablesSupported: [
      'temperature_2m',
      'dew_point_2m',
      'surface_pressure',
      'mean_sea_level_pressure',
      'u_component_of_wind_10m',
      'v_component_of_wind_10m',
      'vertical_velocity', // Pa/s on pressure levels
      'geopotential',
      'relative_humidity',
      'specific_humidity',
      'convective_available_potential_energy', // CAPE (J/kg)
      'convective_inhibition',                 // CIN (J/kg)
      'total_precipitation',
      'convective_precipitation',
      'total_column_water_vapour',
    ],
    description:
      'Fifth-generation ECMWF global atmospheric reanalysis providing comprehensive 3D thermodynamic and kinematic variables across 37 pressure levels from 1000 hPa to 1 hPa.',
    accessUrl: 'https://cds.climate.copernicus.eu',
    limitations: [
      'RETROSPECTIVE REANALYSIS ONLY: In accordance with scientific integrity rules, ERA5 is never classified as a live or real-time nowcast stream',
      'Spatial resolution of 31 km smoothes localized convective micro-cores and steep Himalayan valley topography',
      'Requires Copernicus Climate Data Store (CDS) API key configuration',
    ],
  };

  public async checkStatus(): Promise<{
    status: DataSourceStatus;
    message: string;
    lastTested: string;
    details?: Record<string, any>;
  }> {
    const apiKey = process.env.CDS_API_KEY;
    const now = new Date().toISOString();

    if (!apiKey || apiKey.trim() === '') {
      return {
        status: 'AVAILABLE_NOT_CONFIGURED',
        message: 'Copernicus CDS API key (CDS_API_KEY) not configured. ERA5 reanalysis ingestion is in offline research archive mode.',
        lastTested: now,
        details: {
          documentationUrl: 'https://cds.climate.copernicus.eu/how-to-api',
          product: 'reanalysis-era5-pressure-levels',
          configured: false,
        },
      };
    }

    try {
      const response = await fetch('https://cds.climate.copernicus.eu/api/v2', {
        headers: { Authorization: `Basic ${Buffer.from(apiKey).toString('base64')}` },
        signal: AbortSignal.timeout(5000),
      }).catch(() => null);

      if (!response || !response.ok) {
        return {
          status: 'CREDENTIALS_REQUIRED',
          message: 'Copernicus CDS authentication failed or portal under maintenance.',
          lastTested: now,
          details: { configured: true, httpStatus: response?.status ?? 'TIMEOUT' },
        };
      }

      return {
        status: 'CONNECTED',
        message: 'Connected to Copernicus Climate Data Store (CDS) API.',
        lastTested: now,
      };
    } catch (err: any) {
      return {
        status: 'ERROR',
        message: `CDS API connection error: ${err.message}`,
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
        `[ERA5 Ingestion] Cannot fetch reanalysis data: Status is ${status.status} (${status.message})`
      );
    }
    return [];
  }
}
