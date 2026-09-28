/**
 * PRAGYA CLIENT API SERVICE
 *
 * Lightweight, type-safe frontend client for PRAGYA's scientific backend.
 * All communication happens over standard HTTP (/api/*), ensuring zero server/database
 * dependencies or secrets are bundled into client-side JavaScript.
 */

export interface DatabaseHealthInfo {
  status: string;
  service: string;
  database: {
    provider: string;
    status: string;
    eventsInStore: number;
    observationsInStore: number;
  };
  operationalPipeline: {
    status: string;
    liveNowcastingActive: boolean;
    message: string;
  };
  timestamp: string;
}

export interface ApiSourceReport {
  id: string;
  name: string;
  provider: string;
  category: string;
  dataMode: 'REAL' | 'REANALYSIS' | 'DERIVED' | 'SIMULATED';
  status: 'CONNECTED' | 'CREDENTIALS_REQUIRED' | 'AVAILABLE_NOT_CONFIGURED' | 'UNAVAILABLE' | 'ERROR' | 'SIMULATED';
  message: string;
  spatialResolution: string;
  temporalResolution: string;
  latencyMinutes: number;
  authRequired: boolean;
  requiredEnvVars: string[];
  variablesSupported: string[];
  lastTested: string;
  accessUrl?: string;
  limitations: string[];
  details?: Record<string, any>;
}

export class ApiClient {
  private static instance: ApiClient;

  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public async getHealth(): Promise<DatabaseHealthInfo | null> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async getSources(): Promise<ApiSourceReport[]> {
    try {
      const res = await fetch('/api/sources');
      if (!res.ok) return [];
      const data = await res.json();
      return data.sources || [];
    } catch {
      return [];
    }
  }

  public async getEvents(): Promise<any[]> {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) return [];
      const data = await res.json();
      return data.events || [];
    } catch {
      return [];
    }
  }

  public async getObservations(params: { eventId?: string; variable?: string; replayTime?: string }): Promise<any[]> {
    try {
      const sp = new URLSearchParams();
      if (params.eventId) sp.set('eventId', params.eventId);
      if (params.variable) sp.set('variable', params.variable);
      if (params.replayTime) sp.set('replayTime', params.replayTime);

      const res = await fetch(`/api/observations?${sp.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.observations || [];
    } catch {
      return [];
    }
  }

  public async getFeatures(params: { eventId?: string; replayTime?: string }): Promise<any | null> {
    try {
      const sp = new URLSearchParams();
      if (params.eventId) sp.set('eventId', params.eventId);
      if (params.replayTime) sp.set('replayTime', params.replayTime);

      const res = await fetch(`/api/features?${sp.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async getPrecursors(params: { eventId?: string; replayTime?: string }): Promise<any[]> {
    try {
      const sp = new URLSearchParams();
      if (params.eventId) sp.set('eventId', params.eventId);
      if (params.replayTime) sp.set('replayTime', params.replayTime);

      const res = await fetch(`/api/precursors?${sp.toString()}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.signals || [];
    } catch {
      return [];
    }
  }

  public async getFingerprint(params: { eventId?: string; replayTime?: string; offsetMin?: number }): Promise<any | null> {
    try {
      const sp = new URLSearchParams();
      if (params.eventId) sp.set('eventId', params.eventId);
      if (params.replayTime) sp.set('replayTime', params.replayTime);
      if (params.offsetMin !== undefined) sp.set('offsetMin', params.offsetMin.toString());

      const res = await fetch(`/api/fingerprint?${sp.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async getNearMissComparison(): Promise<any | null> {
    try {
      const res = await fetch('/api/near-miss');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async getInformationValueReport(replayTime?: string): Promise<any | null> {
    try {
      const sp = new URLSearchParams();
      if (replayTime) sp.set('replayTime', replayTime);
      const res = await fetch(`/api/information-value?${sp.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async getModels(): Promise<any | null> {
    try {
      const res = await fetch('/api/models');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  public async triggerRealSampleDemonstration(): Promise<any | null> {
    try {
      const res = await fetch('/api/demo/real-sample');
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }
}

export const apiClient = ApiClient.getInstance();
