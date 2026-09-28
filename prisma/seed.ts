import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('[PRAGYA SEED] DATABASE_URL is missing!');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('--- PRAGYA SCIENTIFIC DATABASE SEED ---');
  console.log('Connecting to Neon PostgreSQL...');

  // 1. Data Sources
  console.log('Seeding Data Sources...');
  const radarSource = await prisma.dataSource.upsert({
    where: { id: 'src-imd-radar-delhi' },
    update: {},
    create: {
      id: 'src-imd-radar-delhi',
      name: 'IMD Doppler Weather Radar (Delhi / Palam)',
      provider: 'India Meteorological Department (IMD)',
      sourceType: 'RADAR',
      description: 'S-band polarimetric Doppler weather radar providing high-resolution volume scans of reflectivity, radial velocity, and differential reflectivity.',
      spatialResolution: '1 km',
      temporalResolution: '10 min',
      accessUrl: 'https://mausam.imd.gov.in/radar/palam',
      isOperational: false,
      metadata: {
        frequency: '2.8 GHz',
        beamWidth: '1.0 deg',
        elevationAngles: [0.5, 1.0, 2.0, 3.5, 5.0, 7.0, 10.0, 15.0],
        maxRangeKm: 250,
        pipelineLatencyMinutes: 6,
      },
    },
  });

  const satSource = await prisma.dataSource.upsert({
    where: { id: 'src-insat-3dr' },
    update: {},
    create: {
      id: 'src-insat-3dr',
      name: 'INSAT-3DR Geostationary Imager & Sounder',
      provider: 'ISRO / IMD',
      sourceType: 'SATELLITE',
      description: 'Multi-spectral meteorological satellite imagery capturing thermal infrared brightness temperature and rapid cloud-top cooling precursor signals.',
      spatialResolution: '4 km (TIR) / 1 km (VIS)',
      temporalResolution: '15 min',
      accessUrl: 'https://mosdac.gov.in/insat-3dr',
      isOperational: false,
      metadata: {
        channels: ['TIR-1 (10.8 µm)', 'TIR-2 (12.0 µm)', 'MIR (3.9 µm)', 'WV (6.8 µm)'],
        pipelineLatencyMinutes: 18,
      },
    },
  });

  const era5Source = await prisma.dataSource.upsert({
    where: { id: 'src-era5-reanalysis' },
    update: {},
    create: {
      id: 'src-era5-reanalysis',
      name: 'ECMWF ERA5 Atmospheric Reanalysis',
      provider: 'ECMWF / Copernicus Climate Change Service',
      sourceType: 'REANALYSIS',
      description: 'Hourly reanalysis combining physical model laws with global in-situ and satellite observations for synoptic thermodynamic environments.',
      spatialResolution: '0.25 deg (~31 km)',
      temporalResolution: '1 hour',
      accessUrl: 'https://cds.climate.copernicus.eu',
      isOperational: false,
      metadata: {
        pressureLevels: 37,
        variables: ['CAPE', 'Total Column Water Vapour', 'Wind Shear 0-6km', 'CIN'],
      },
    },
  });

  const awsSource = await prisma.dataSource.upsert({
    where: { id: 'src-imd-aws-network' },
    update: {},
    create: {
      id: 'src-imd-aws-network',
      name: 'Surface Automatic Weather Station (AWS) Network',
      provider: 'IMD & State Disaster Management',
      sourceType: 'SURFACE_STATION',
      description: 'In-situ automated surface telemetry measuring temperature, dew point, surface pressure, and instantaneous precipitation rate.',
      spatialResolution: 'Point Network (~12 km avg spacing)',
      temporalResolution: '15 min',
      accessUrl: 'https://aws.imd.gov.in',
      isOperational: false,
      metadata: {
        stationDensityNCR: '1 per 140 km²',
        telemetryLatencyMinutes: 5,
      },
    },
  });

  const wrfSource = await prisma.dataSource.upsert({
    where: { id: 'src-wrf-sim-benchmark' },
    update: {},
    create: {
      id: 'src-wrf-sim-benchmark',
      name: 'PRAGYA-WRF Cloud-Resolving Benchmark Simulation',
      provider: 'PRAGYA Atmospheric Core Laboratory',
      sourceType: 'SYNTHETIC',
      description: 'High-resolution WRF-ARW convection-permitting simulation designed as a deterministic control benchmark for predictability research.',
      spatialResolution: '1 km',
      temporalResolution: '5 min',
      accessUrl: null,
      isOperational: false,
      metadata: {
        microphysics: 'Thompson 6-class',
        pblScheme: 'YSU',
        benchmarkRun: true,
      },
    },
  });

  // 2. Model Version
  console.log('Seeding Model Version...');
  const modelVersion = await prisma.modelVersion.upsert({
    where: { version: 'PRAGYA-EXP-0.1' },
    update: {},
    create: {
      name: 'PRAGYA Convective Genesis Predictability Engine',
      version: 'PRAGYA-EXP-0.1',
      description: 'Hybrid hydrodynamic-statistical predictability model evaluating thermodynamic instability, updraft helicity, and radar reflectivity emergence.',
      modelType: 'HYBRID_CONVECTIVE_ENSEMBLE',
      configuration: {
        ensembleMembers: 20,
        perturbationMethod: 'SLA-EnKF',
        defaultThreshold: 0.70,
        defaultPersistenceWindowMinutes: 30,
      },
      featureSet: [
        'cape_j_kg',
        'radar_reflectivity_dbz',
        'vertical_velocity_m_s',
        'precipitable_water_mm',
        'cloud_top_temp_c',
        'bulk_wind_shear_0_6km_m_s',
      ],
    },
  });

  // 3. Historical Events
  console.log('Seeding Historical Events...');
  const eventA = await prisma.historicalEvent.upsert({
    where: { eventCode: 'EVT-2023-DHR' },
    update: {},
    create: {
      id: 'evt-2023-dhr',
      eventCode: 'EVT-2023-DHR',
      name: 'Dhaula Kuan Rapid Convective Genesis & Cloudburst',
      eventType: 'CLOUDBURST',
      eventClass: 'HISTORICAL_RECONSTRUCTION',
      description: 'Extreme localized precipitation event producing >110 mm/hr localized rainfall in South-West Delhi. Preceded by rapid boundary layer moisture convergence and violent reflectivity column growth within 45 minutes.',
      startTime: new Date('2023-07-09T08:00:00Z'),
      peakTime: new Date('2023-07-09T11:45:00Z'),
      endTime: new Date('2023-07-09T14:30:00Z'),
      latitude: 28.5921,
      longitude: 77.1611,
      locationName: 'Dhaula Kuan, South West Delhi',
      stateRegion: 'National Capital Territory of Delhi',
      country: 'India',
      severity: 'SEVERE',
      groundTruthConfidence: 1.0,
      isNearMiss: false,
      groundTruthSource: 'IMD Rain Gauge Network & Doppler Radar Archive',
      metadata: {
        peakRainfallRateMmHr: 114.2,
        totalAccumulationMm: 153.5,
        damageClassification: 'Severe urban inundation, underpass submergence',
      },
    },
  });

  const eventB = await prisma.historicalEvent.upsert({
    where: { eventCode: 'EVT-2024-KLL' },
    update: {},
    create: {
      id: 'evt-2024-kll',
      eventCode: 'EVT-2024-KLL',
      name: 'Kullu Valley Pre-Convective False Surge (Near-Miss)',
      eventType: 'NEAR_MISS',
      eventClass: 'HISTORICAL_RECONSTRUCTION',
      description: 'Severe thermodynamic instability (CAPE >3200 J/kg) and radar echo intensification simulated near-cloudburst conditions, but mid-level dry air entrainment choked updraft cores before catastrophic rainfall materialized.',
      startTime: new Date('2024-08-14T12:00:00Z'),
      peakTime: new Date('2024-08-14T15:30:00Z'),
      endTime: new Date('2024-08-14T18:00:00Z'),
      latitude: 31.9579,
      longitude: 77.1095,
      locationName: 'Kullu Valley, Western Himalaya',
      stateRegion: 'Himachal Pradesh',
      country: 'India',
      severity: 'MODERATE',
      groundTruthConfidence: 0.95,
      isNearMiss: true,
      groundTruthSource: 'Western Himalayan AWS Network & Satellite Imagery',
      metadata: {
        peakRainfallRateMmHr: 28.4,
        suppressionMechanism: '700-500 hPa dry slot intrusion & valley wind decoupling',
      },
    },
  });

  // 4. Experiment Runs
  console.log('Seeding Experiment Runs...');
  const expRunA = await prisma.experimentRun.upsert({
    where: { id: 'run-evt-2023-dhr-baseline' },
    update: {},
    create: {
      id: 'run-evt-2023-dhr-baseline',
      name: 'Dhaula Kuan Baseline Predictability Horizon Run',
      description: 'Standard multi-member ensemble analysis examining the transition from chaotic convective cells to phase-locked cloudburst predictability.',
      historicalEventId: eventA.id,
      modelVersionId: modelVersion.id,
      status: 'COMPLETED',
      startedAt: new Date('2026-09-28T09:00:00Z'),
      completedAt: new Date('2026-09-28T09:12:00Z'),
      predictabilityThreshold: 0.70,
      persistenceMinutes: 30,
      randomSeed: 42,
      configuration: {
        leadTimes: [15, 30, 45, 60, 90, 120],
        noiseLevelPct: 0.05,
      },
      notes: 'Horizon emerged reliably at T-32 min with 0.78 predictability and 0.88 observation confidence.',
    },
  });

  // 5. Prediction Snapshots for Event A
  console.log('Seeding Prediction Snapshots and Ensemble Members...');
  const snapshotSpecs = [
    {
      id: 'snap-dhr-0900',
      time: new Date('2023-07-09T09:00:00Z'),
      leadTimeMinutes: 165,
      risk: 0.14,
      pred: 0.21,
      obsConf: 0.72,
      state: 'INSUFFICIENT_OBSERVATION' as const,
      explanation: 'Dispersed low-level thermal plumes with unorganized radar return (<20 dBZ). Predictability remains below actionable research horizon.',
    },
    {
      id: 'snap-dhr-1015',
      time: new Date('2023-07-09T10:15:00Z'),
      leadTimeMinutes: 90,
      risk: 0.42,
      pred: 0.49,
      obsConf: 0.81,
      state: 'PRE_CONVECTIVE_EMERGENCE' as const,
      explanation: 'Low-level moisture convergence exceeds threshold (2.8 x 10^-4 s^-1). Ensemble begins exhibiting spatial clustering over South-West Delhi.',
    },
    {
      id: 'snap-dhr-1110',
      time: new Date('2023-07-09T11:10:00Z'),
      leadTimeMinutes: 35,
      risk: 0.83,
      pred: 0.78,
      obsConf: 0.89,
      state: 'RAPID_ORGANIZATION' as const,
      explanation: 'PREDICTABILITY HORIZON CROSSED: Vertical velocity >14 m/s and 52 dBZ core established. 18 of 20 ensemble members converge on severe local downburst.',
    },
    {
      id: 'snap-dhr-1135',
      time: new Date('2023-07-09T11:35:00Z'),
      leadTimeMinutes: 10,
      risk: 0.96,
      pred: 0.92,
      obsConf: 0.94,
      state: 'IMMINENT_EVENT' as const,
      explanation: 'Severe convective core locked. Cloud-top cooling rate reaches -1.8 K/min. Cloudburst precipitation onset underway.',
    },
  ];

  for (const s of snapshotSpecs) {
    const snap = await prisma.predictionSnapshot.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        experimentRunId: expRunA.id,
        historicalEventId: eventA.id,
        predictionTime: s.time,
        leadTimeMinutes: s.leadTimeMinutes,
        eventRisk: s.risk,
        predictability: s.pred,
        observationConfidence: s.obsConf,
        predictabilityState: s.state,
        explanation: s.explanation,
        featureContributions: {
          cape: 0.34,
          reflectivity_max: 0.28,
          surface_convergence: 0.21,
          vertical_velocity: 0.17,
        },
      },
    });

    // Seed 20 ensemble members for this snapshot
    const ensembleRows = [];
    for (let m = 0; m < 20; m++) {
      const spreadFactor = (1 - s.pred) * 0.08;
      const memberLat = 28.5921 + (Math.sin(m * 1.3) * spreadFactor);
      const memberLon = 77.1611 + (Math.cos(m * 1.3) * spreadFactor);
      const memberIntensity = Math.max(10, Math.min(120, s.risk * 105 + (Math.sin(m * 2.1) * 15 * (1 - s.pred))));
      const memberProb = Math.max(0.05, Math.min(0.99, s.risk + (Math.cos(m * 0.8) * 0.15 * (1 - s.pred))));

      ensembleRows.push({
        id: `${s.id}-m${m}`,
        predictionSnapshotId: snap.id,
        memberIndex: m,
        futureTimestamp: new Date(s.time.getTime() + s.leadTimeMinutes * 60 * 1000),
        latitude: memberLat,
        longitude: memberLon,
        intensity: memberIntensity,
        probability: memberProb,
        futureState: s.risk > 0.7 ? (m % 3 === 0 ? 'SUPERCELL' : 'INTENSIFICATION') : (m % 2 === 0 ? 'DISSIPATION' : 'SCATTERED_CONVECTION'),
      });
    }

    // Upsert ensemble results safely
    for (const er of ensembleRows) {
      await prisma.ensembleResult.upsert({
        where: { id: er.id },
        update: {},
        create: er,
      });
    }
  }

  // 6. Atmospheric Observations (Time-Gated with Realistic Latency)
  console.log('Seeding Atmospheric Observations (enforcing strict availableAt >= observedAt)...');
  const observationRecords = [];

  // Generate 12 time steps leading up to peak for Event A
  const baseTimeA = new Date('2023-07-09T08:30:00Z').getTime();
  const stepMs = 15 * 60 * 1000; // 15-minute steps

  for (let step = 0; step < 16; step++) {
    const obsTime = new Date(baseTimeA + step * stepMs);
    // Radar telemetry latency is +6 minutes
    const radarAvail = new Date(obsTime.getTime() + 6 * 60 * 1000);
    // Satellite telemetry latency is +18 minutes
    const satAvail = new Date(obsTime.getTime() + 18 * 60 * 1000);
    // AWS surface telemetry latency is +4 minutes
    const awsAvail = new Date(obsTime.getTime() + 4 * 60 * 1000);

    const progress = step / 15; // 0 to 1

    // Reflectivity (dBZ)
    observationRecords.push({
      id: `obs-dhr-ref-${step}`,
      eventId: eventA.id,
      dataSourceId: radarSource.id,
      observedAt: obsTime,
      availableAt: radarAvail,
      latitude: 28.5921,
      longitude: 77.1611,
      altitude: 3500, // 3.5 km
      variable: 'reflectivity',
      value: 18 + Math.pow(progress, 1.8) * 44, // 18 dBZ up to 62 dBZ
      unit: 'dBZ',
      qualityStatus: 'VALID' as const,
      observationType: 'GRID',
      isDerived: false,
    });

    // CAPE (J/kg)
    observationRecords.push({
      id: `obs-dhr-cape-${step}`,
      eventId: eventA.id,
      dataSourceId: era5Source.id,
      observedAt: obsTime,
      availableAt: obsTime, // Reanalysis benchmark available at analysis time
      latitude: 28.5921,
      longitude: 77.1611,
      altitude: 0,
      variable: 'cape',
      value: 2200 + progress * 1650, // 2200 to 3850 J/kg
      unit: 'J/kg',
      qualityStatus: 'VALID' as const,
      observationType: 'GRID',
      isDerived: false,
    });

    // Vertical Velocity (m/s)
    observationRecords.push({
      id: `obs-dhr-w-${step}`,
      eventId: eventA.id,
      dataSourceId: radarSource.id,
      observedAt: obsTime,
      availableAt: radarAvail,
      latitude: 28.5921,
      longitude: 77.1611,
      altitude: 5000,
      variable: 'vertical_velocity',
      value: 1.2 + Math.pow(progress, 2.2) * 16.8, // 1.2 up to 18 m/s
      unit: 'm/s',
      qualityStatus: 'VALID' as const,
      observationType: 'GRID',
      isDerived: true,
    });

    // Cloud Top Temperature (degC)
    observationRecords.push({
      id: `obs-dhr-ctt-${step}`,
      eventId: eventA.id,
      dataSourceId: satSource.id,
      observedAt: obsTime,
      availableAt: satAvail,
      latitude: 28.5921,
      longitude: 77.1611,
      altitude: 12000,
      variable: 'cloud_top_temp',
      value: -12 - progress * 58, // -12 C down to -70 C
      unit: 'degC',
      qualityStatus: 'VALID' as const,
      observationType: 'GRID',
      isDerived: false,
    });

    // Precipitable Water (mm)
    observationRecords.push({
      id: `obs-dhr-pw-${step}`,
      eventId: eventA.id,
      dataSourceId: awsSource.id,
      observedAt: obsTime,
      availableAt: awsAvail,
      latitude: 28.5921,
      longitude: 77.1611,
      altitude: 215, // ground level
      variable: 'precipitable_water',
      value: 48 + progress * 24, // 48 to 72 mm
      unit: 'mm',
      qualityStatus: 'VALID' as const,
      observationType: 'POINT',
      isDerived: false,
    });
  }

  // Add 1 missing observation example to prove strict scientific handling of nulls
  observationRecords.push({
    id: `obs-dhr-sounder-missing-1`,
    eventId: eventA.id,
    dataSourceId: satSource.id,
    observedAt: new Date('2023-07-09T10:00:00Z'),
    availableAt: new Date('2023-07-09T10:20:00Z'),
    latitude: 28.5921,
    longitude: 77.1611,
    altitude: 7000,
    variable: 'radiometer_relative_humidity',
    value: null, // CRITICAL: NEVER zero-fill!
    unit: '%',
    qualityStatus: 'MISSING' as const,
    observationType: 'PROFILE',
    isDerived: false,
  });

  for (const obs of observationRecords) {
    await prisma.atmosphericObservation.upsert({
      where: { id: obs.id },
      update: {},
      create: obs,
    });
  }

  // 7. Observation Gaps
  console.log('Seeding Observation Gaps...');
  await prisma.observationGap.upsert({
    where: { id: 'gap-kll-radar-shadow' },
    update: {},
    create: {
      id: 'gap-kll-radar-shadow',
      historicalEventId: eventB.id,
      experimentRunId: null,
      detectedAt: new Date('2024-08-14T13:00:00Z'),
      gapType: 'RADAR_SILENCE',
      variable: 'reflectivity',
      latitude: 31.9579,
      longitude: 77.1095,
      altitude: 2200,
      severity: 'HIGH',
      description: 'Mountain ridge blockage below 3.5 deg elevation cuts off low-level Doppler beam scan in Upper Beas Basin.',
      impactOnConfidence: -0.28,
      recommendedObservation: 'Deploy X-band micro-radar node on southern valley crest (2,400 m a.s.l.)',
    },
  });

  await prisma.observationGap.upsert({
    where: { id: 'gap-dhr-sat-latency' },
    update: {},
    create: {
      id: 'gap-dhr-sat-latency',
      historicalEventId: eventA.id,
      experimentRunId: expRunA.id,
      detectedAt: new Date('2023-07-09T10:30:00Z'),
      gapType: 'SATELLITE_LATENCY',
      variable: 'cloud_top_temp',
      latitude: 28.5921,
      longitude: 77.1611,
      altitude: 12000,
      severity: 'MEDIUM',
      description: 'INSAT-3DR rapid-scan dissemination lag of 18 minutes obscures earliest 5-minute updraft pulse detection.',
      impactOnConfidence: -0.15,
      recommendedObservation: 'Subscribe to high-frequency 5-min rapid scan sub-sector direct readout broadcast',
    },
  });

  // 8. Alerts
  console.log('Seeding Research Alerts...');
  await prisma.alert.upsert({
    where: { id: 'alert-dhr-watch-01' },
    update: {},
    create: {
      id: 'alert-dhr-watch-01',
      historicalEventId: eventA.id,
      createdAt: new Date('2023-07-09T10:45:00Z'),
      alertType: 'PRE_CONVECTIVE_WATCH',
      severity: 'MODERATE',
      title: 'Pre-Convective Genesis Watch — South-West NCT',
      message: 'Thermodynamic boundary layer saturation and moisture convergence indicate elevated probability of rapid organization within 45–60 minutes.',
      language: 'en',
      latitude: 28.5921,
      longitude: 77.1611,
      status: 'EXPIRED',
    },
  });

  await prisma.alert.upsert({
    where: { id: 'alert-dhr-warning-02' },
    update: {},
    create: {
      id: 'alert-dhr-warning-02',
      historicalEventId: eventA.id,
      createdAt: new Date('2023-07-09T11:15:00Z'),
      alertType: 'CLOUDBURST_IMMINENT',
      severity: 'SEVERE',
      title: 'Cloudburst Genesis Horizon Confirmed — Dhaula Kuan Corridor',
      message: 'PRAGYA Predictability Horizon crossed at 11:10 UTC (confidence 0.89, risk 0.83). High probability of localized precipitation exceeding 80 mm/hr.',
      language: 'en',
      latitude: 28.5921,
      longitude: 77.1611,
      status: 'ACTIVE',
    },
  });

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

seed()
  .catch((e) => {
    console.error('SEEDING FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
