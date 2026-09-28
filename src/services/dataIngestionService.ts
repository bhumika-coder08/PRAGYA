/**
 * PRAGYA DATA INGESTION & ADAPTER REGISTRY SERVICE
 * Standardized adapter interfaces for authoritative meteorological sources:
 * Satellite, Radar, Lightning, Surface AWS, Upper-Air Sounding, NWP, and Terrain.
 *
 * Enforces scientific transparency:
 * Displays DATABASE CONNECTION: NOT CONFIGURED (INTENTIONAL)
 * and validates local testbed file preview formats without fake persistence.
 */

import {
  DataSourceAdapterMetadata,
  DataSourcePlatformCategory,
  AtmosphericObservation
} from '../types/observation';

export interface FileValidationResult {
  isValid: boolean;
  filename: string;
  format: 'JSON' | 'CSV' | 'NETCDF' | 'UNKNOWN';
  recordCount: number;
  detectedVariables: string[];
  missingMandatoryVariables: string[];
  samplePreview: any[];
  error?: string;
}

export class DataIngestionService {
  private static instance: DataIngestionService;

  private constructor() {}

  public static getInstance(): DataIngestionService {
    if (!DataIngestionService.instance) {
      DataIngestionService.instance = new DataIngestionService();
    }
    return DataIngestionService.instance;
  }

  // --------------------------------------------------------------------------
  // 1. AUTHORITATIVE METEOROLOGICAL ADAPTER REGISTRY
  // --------------------------------------------------------------------------
  public getRegisteredAdapters(): DataSourceAdapterMetadata[] {
    return [
      {
        id: 'ADAPTER-SAT-01',
        name: 'INSAT-3DR / 3DS Multi-Spectral Imager',
        category: 'SATELLITE',
        agency: 'ISRO / IMD Space Meteorological Cell',
        operationalStatus: 'OPERATIONAL',
        ingestionCadence: '15 min (Full Disk) / 4 min (Rapid Scan)',
        latencyMinutes: 12,
        coverageDomain: 'Indian Ocean Basin & Subcontinent (45°E - 105°E)',
        formatSpecification: 'HDF5 Level-1B / GeoTIFF Brightness Temp',
        authRequired: true
      },
      {
        id: 'ADAPTER-RADAR-01',
        name: 'Doppler Weather Radar (DWR) Coastal Network',
        category: 'RADAR',
        agency: 'India Meteorological Department (IMD)',
        operationalStatus: 'OPERATIONAL',
        ingestionCadence: '10 min (Volume Scan Strategy)',
        latencyMinutes: 4,
        coverageDomain: 'Mumbai, Goa, Kochi, Chennai (250 km Radial Coverage)',
        formatSpecification: 'IRIS RAW / NetCDF-4 Dual-Pol Radial Reflectivity (Z, ZDR, KDP)',
        authRequired: true
      },
      {
        id: 'ADAPTER-LTG-01',
        name: 'ISRO / IITM Total Lightning Detection Network',
        category: 'LIGHTNING',
        agency: 'Indian Institute of Tropical Meteorology (IITM)',
        operationalStatus: 'OPERATIONAL',
        ingestionCadence: 'Real-time (1 second event packets)',
        latencyMinutes: 1,
        coverageDomain: 'Pan-India Lightning Locating Sensor Grid',
        formatSpecification: 'JSON Stream / ASCII Flash Strokes (IC + CG)',
        authRequired: true
      },
      {
        id: 'ADAPTER-AWS-01',
        name: 'State Surface AWS & High-Resolution Disdrometers',
        category: 'SURFACE_AWS',
        agency: 'IMD / State Disaster Management Authorities',
        operationalStatus: 'OPERATIONAL',
        ingestionCadence: '15 min reporting interval',
        latencyMinutes: 8,
        coverageDomain: 'Ghats Micro-Basin Telemetric Stations',
        formatSpecification: 'WMO BUFR / REST JSON Telemetry',
        authRequired: true
      },
      {
        id: 'ADAPTER-SOUNDING-01',
        name: 'Upper-Air GPS Radiosonde Sounding Network',
        category: 'UPPER_AIR',
        agency: 'India Meteorological Department (IMD)',
        operationalStatus: 'OPERATIONAL',
        ingestionCadence: '00:00 & 12:00 UTC (Bi-Daily)',
        latencyMinutes: 45,
        coverageDomain: 'Operational Synoptic Sounding Stations',
        formatSpecification: 'TEMP / BUFR / ASCII Skew-T Sounding Levels',
        authRequired: false
      },
      {
        id: 'ADAPTER-NWP-01',
        name: 'NCUM-R 4km Convection-Permitting Regional Forecast',
        category: 'MODEL_NWP',
        agency: 'National Centre for Medium Range Weather Forecasting (NCMRWF)',
        operationalStatus: 'OPERATIONAL',
        ingestionCadence: '00, 06, 12, 18 UTC cycles',
        latencyMinutes: 90,
        coverageDomain: 'South Asian Regional Domain (4km grid)',
        formatSpecification: 'GRIB2 / NetCDF-4 3D Diagnostic Grids',
        authRequired: false
      },
      {
        id: 'ADAPTER-TERRAIN-01',
        name: 'SRTM 30m / CartoDEM High-Res Orography',
        category: 'TERRAIN',
        agency: 'NRSC / USGS',
        operationalStatus: 'OPERATIONAL',
        ingestionCadence: 'Static Baseline',
        latencyMinutes: 0,
        coverageDomain: 'Western Ghats Orographic Escarpment (18.5°N - 19.5°N)',
        formatSpecification: 'GeoTIFF 1-ArcSecond Digital Elevation Model',
        authRequired: false
      }
    ];
  }

  // --------------------------------------------------------------------------
  // 2. LOCAL FILE PREVIEW & FORMAT VALIDATOR
  // --------------------------------------------------------------------------
  public validateObservationDataset(fileContent: string, fileName: string): FileValidationResult {
    const isJson = fileName.endsWith('.json');
    const isCsv = fileName.endsWith('.csv');

    if (isJson) {
      try {
        const parsed = JSON.parse(fileContent);
        const records = Array.isArray(parsed) ? parsed : [parsed];

        const mandatory = ['timestamp', 'latitude', 'longitude', 'temperature', 'relativeHumidity'];
        const firstRecord = records[0] || {};
        const detected = Object.keys(firstRecord);
        const missing = mandatory.filter(m => !detected.includes(m));

        return {
          isValid: missing.length === 0,
          filename: fileName,
          format: 'JSON',
          recordCount: records.length,
          detectedVariables: detected,
          missingMandatoryVariables: missing,
          samplePreview: records.slice(0, 3),
          error: missing.length > 0 ? `Missing mandatory meteorological fields: ${missing.join(', ')}` : undefined
        };
      } catch (err: any) {
        return {
          isValid: false,
          filename: fileName,
          format: 'JSON',
          recordCount: 0,
          detectedVariables: [],
          missingMandatoryVariables: [],
          samplePreview: [],
          error: `JSON parse error: ${err.message}`
        };
      }
    } else if (isCsv) {
      const lines = fileContent.trim().split('\n');
      if (lines.length < 2) {
        return {
          isValid: false,
          filename: fileName,
          format: 'CSV',
          recordCount: 0,
          detectedVariables: [],
          missingMandatoryVariables: [],
          samplePreview: [],
          error: 'CSV contains no data rows.'
        };
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
      const mandatory = ['timestamp', 'latitude', 'longitude', 'temperature', 'relativeHumidity'];
      const missing = mandatory.filter(m => !headers.includes(m));

      const sampleRows = lines.slice(1, 4).map(l => {
        const values = l.split(',').map(v => v.trim());
        const rowObj: Record<string, string> = {};
        headers.forEach((h, idx) => {
          rowObj[h] = values[idx] || '';
        });
        return rowObj;
      });

      return {
        isValid: missing.length === 0,
        filename: fileName,
        format: 'CSV',
        recordCount: lines.length - 1,
        detectedVariables: headers,
        missingMandatoryVariables: missing,
        samplePreview: sampleRows,
        error: missing.length > 0 ? `Missing mandatory CSV columns: ${missing.join(', ')}` : undefined
      };
    } else {
      return {
        isValid: false,
        filename: fileName,
        format: 'UNKNOWN',
        recordCount: 0,
        detectedVariables: [],
        missingMandatoryVariables: [],
        samplePreview: [],
        error: 'Unsupported file extension. Please provide standard JSON or CSV observation files.'
      };
    }
  }
}

export const dataIngestionService = DataIngestionService.getInstance();
