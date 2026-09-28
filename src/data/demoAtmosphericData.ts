import {
  StormCell,
  PredictabilityState,
  EnsembleFuture,
  HistoricalEvent,
  ObservationGap,
  DifferenceSignal,
  AtmosphericFingerprint,
  WeatherAlert,
  ModelMetricPlaceholder,
  VerticalProfileLevel,
  ConvectiveStage
} from '../types';

export const SIMULATED_DATA_DISCLAIMER = "DEMO / SIMULATED DATA — Research Prototype. Not an official forecast.";

// Central Simulated Storm Cells
export const DEMO_STORM_CELLS: StormCell[] = [
  {
    id: 'CX-017',
    name: 'Cell CX-017 (Primary Focus)',
    region: 'Western Ghats Orographic Interface',
    coordinates: [18.9220, 73.4560],
    status: 'CONVECTIVE DEVELOPMENT',
    eventRisk: 67, // Likelihood of severe convection
    predictability: 31, // Atmospheric confidence distinguishing from alternative futures
    cape: 2480,
    cin: -28,
    relativeHumidity: 79,
    verticalVelocity: 14.8,
    windShear: 22.4,
    moistureConvergence: 4.9,
    cloudTopCooling: -8.6,
    lightningActivity: 44,
    ambiguityAssessment: "Atmosphere remains highly ambiguous. Competing dynamical outcomes share near-identical boundary layer thermodynamic profiles.",
    candidatePrecursorSignals: [
      "Mid-tropospheric dry air slot detected at 600 hPa",
      "Localized convergence spike at orographic inflection notch",
      "Rapid differential cloud-top brightness temperature decay"
    ],
    altitudeRangeKm: [0.8, 11.4],
    observedAt: "2026-09-28 10:15:00 UTC",
    isSimulated: true,
  },
  {
    id: 'CX-012',
    name: 'Cell CX-012 (Inland Flank)',
    region: 'Deccan Plateau Convergence Belt',
    coordinates: [19.2410, 74.1120],
    status: 'INITIATION',
    eventRisk: 42,
    predictability: 18,
    cape: 1820,
    cin: -65,
    relativeHumidity: 68,
    verticalVelocity: 6.4,
    windShear: 14.2,
    moistureConvergence: 2.3,
    cloudTopCooling: -3.2,
    lightningActivity: 8,
    ambiguityAssessment: "Strong convective inhibition (CIN) is suppressing vertical acceleration. High bifurcation risk between decay and pulse convection.",
    candidatePrecursorSignals: [
      "Boundary layer warming exceeding capping inversion threshold",
      "Weak mesoscale vorticity signature"
    ],
    altitudeRangeKm: [0.5, 7.8],
    observedAt: "2026-09-28 10:15:00 UTC",
    isSimulated: true,
  },
  {
    id: 'CX-024',
    name: 'Cell CX-024 (Coastal Confluence)',
    region: 'Konkan Maritime Boundary',
    coordinates: [18.4230, 72.8950],
    status: 'RAPID GENESIS',
    eventRisk: 88,
    predictability: 79,
    cape: 3150,
    cin: -8,
    relativeHumidity: 91,
    verticalVelocity: 21.6,
    windShear: 28.5,
    moistureConvergence: 7.2,
    cloudTopCooling: -14.1,
    lightningActivity: 112,
    ambiguityAssessment: "Predictability threshold crossed. Deep moist convection firmly decoupled from background uncertainty.",
    candidatePrecursorSignals: [
      "Sea-breeze front intersection with orographic gravity wave",
      "Extreme hydrometeor loading in hail-growth layer (-20°C)"
    ],
    altitudeRangeKm: [0.2, 13.6],
    observedAt: "2026-09-28 10:15:00 UTC",
    isSimulated: true,
  },
  {
    id: 'CX-031',
    name: 'Cell CX-031 (Valley Trap)',
    region: 'Khandala Escarpment Micro-basin',
    coordinates: [18.7510, 73.3420],
    status: 'BOUNDARY_LAYER_ACCUMULATION',
    eventRisk: 34,
    predictability: 25,
    cape: 1640,
    cin: -92,
    relativeHumidity: 74,
    verticalVelocity: 3.1,
    windShear: 11.0,
    moistureConvergence: 3.1,
    cloudTopCooling: -1.1,
    lightningActivity: 2,
    ambiguityAssessment: "High CIN cap preventing deep breach. Watch for mechanical lift forcing break within next 45 minutes.",
    candidatePrecursorSignals: [
      "Localized thermal anomaly in mountain valley",
      "Anabatic upslope wind acceleration"
    ],
    altitudeRangeKm: [0.6, 5.2],
    observedAt: "2026-09-28 10:15:00 UTC",
    isSimulated: true,
  }
];

// Predictability vs Risk Timeline (Demonstration Timeline for Cell CX-017)
export const DEMO_PREDICTABILITY_TIMELINE: PredictabilityState[] = [
  {
    timeOffsetMin: -120,
    label: "T-120",
    eventRisk: 24,
    predictability: 22,
    entropyBits: 3.84,
    divergenceIndex: 0.88,
    isThresholdCrossed: false,
    isEarliestDefensibleWarning: false,
    atmosphereStateNote: "High state space dispersion. 82% of ensemble members diverge before deep moist layer formation."
  },
  {
    timeOffsetMin: -90,
    label: "T-90",
    eventRisk: 35,
    predictability: 29,
    entropyBits: 3.42,
    divergenceIndex: 0.79,
    isThresholdCrossed: false,
    isEarliestDefensibleWarning: false,
    atmosphereStateNote: "Moisture pool coalescing along orographic boundary. Thermodynamic signatures remain split."
  },
  {
    timeOffsetMin: -60,
    label: "T-60",
    eventRisk: 51,
    predictability: 44,
    entropyBits: 2.76,
    divergenceIndex: 0.62,
    isThresholdCrossed: false,
    isEarliestDefensibleWarning: false,
    atmosphereStateNote: "CIN erosion accelerating. Updraft helicity begins to cluster into two discrete attractors."
  },
  {
    timeOffsetMin: -47,
    label: "T-47",
    eventRisk: 63,
    predictability: 71,
    entropyBits: 1.48,
    divergenceIndex: 0.31,
    isThresholdCrossed: true,
    isEarliestDefensibleWarning: true,
    atmosphereStateNote: "PREDICTABILITY THRESHOLD CROSSED. Phase space collapses toward sustained supercell evolution."
  },
  {
    timeOffsetMin: -30,
    label: "T-30",
    eventRisk: 74,
    predictability: 86,
    entropyBits: 0.92,
    divergenceIndex: 0.18,
    isThresholdCrossed: true,
    isEarliestDefensibleWarning: false,
    atmosphereStateNote: "Strong radar core genesis confirmed. Model ensemble dispersion minimal."
  },
  {
    timeOffsetMin: -15,
    label: "T-15",
    eventRisk: 89,
    predictability: 93,
    entropyBits: 0.44,
    divergenceIndex: 0.08,
    isThresholdCrossed: true,
    isEarliestDefensibleWarning: false,
    atmosphereStateNote: "Hydrometeor core reaching tropopause. Radar reflectivity exceeding 54 dBZ."
  },
  {
    timeOffsetMin: 0,
    label: "NOW",
    eventRisk: 94,
    predictability: 97,
    entropyBits: 0.12,
    divergenceIndex: 0.03,
    isThresholdCrossed: true,
    isEarliestDefensibleWarning: false,
    atmosphereStateNote: "Mature convective event in progress with localized severe downdrafts."
  }
];

// 16 Visual Ensemble Futures for Cell CX-017
export const DEMO_ENSEMBLE_FUTURES: EnsembleFuture[] = [
  // Dissipation
  {
    id: 'ENS-01',
    memberId: 'PRAGYA-E01',
    category: 'Dissipation',
    probability: 8,
    predictabilityScore: 28,
    peakCape: 1450,
    peakRainfallRate: 4,
    maxVerticalVelocity: 7.2,
    radarReflectivityDbz: 28,
    description: "Dry mid-level air entrainment at 650 hPa cuts off updraft root.",
    divergencePointMin: 32,
    isSimulated: true
  },
  {
    id: 'ENS-02',
    memberId: 'PRAGYA-E02',
    category: 'Dissipation',
    probability: 6,
    predictabilityScore: 30,
    peakCape: 1520,
    peakRainfallRate: 6,
    maxVerticalVelocity: 8.0,
    radarReflectivityDbz: 32,
    description: "Cold pool surges ahead of updraft, severing inflow feeder band.",
    divergencePointMin: 40,
    isSimulated: true
  },
  {
    id: 'ENS-03',
    memberId: 'PRAGYA-E03',
    category: 'Dissipation',
    probability: 4,
    predictabilityScore: 25,
    peakCape: 1390,
    peakRainfallRate: 2,
    maxVerticalVelocity: 5.8,
    radarReflectivityDbz: 24,
    description: "Persistent capping inversion maintains boundary layer suppression.",
    divergencePointMin: 20,
    isSimulated: true
  },
  // Ordinary Convection
  {
    id: 'ENS-04',
    memberId: 'PRAGYA-E04',
    category: 'Ordinary Convection',
    probability: 14,
    predictabilityScore: 48,
    peakCape: 2100,
    peakRainfallRate: 22,
    maxVerticalVelocity: 12.1,
    radarReflectivityDbz: 42,
    description: "Moderate single-cell shower with localized 20-minute downpour.",
    divergencePointMin: 45,
    isSimulated: true
  },
  {
    id: 'ENS-05',
    memberId: 'PRAGYA-E05',
    category: 'Ordinary Convection',
    probability: 12,
    predictabilityScore: 52,
    peakCape: 2250,
    peakRainfallRate: 28,
    maxVerticalVelocity: 13.5,
    radarReflectivityDbz: 45,
    description: "Multi-cell transient cluster with garden-variety lightning.",
    divergencePointMin: 50,
    isSimulated: true
  },
  {
    id: 'ENS-06',
    memberId: 'PRAGYA-E06',
    category: 'Ordinary Convection',
    probability: 9,
    predictabilityScore: 46,
    peakCape: 1980,
    peakRainfallRate: 18,
    maxVerticalVelocity: 11.2,
    radarReflectivityDbz: 39,
    description: "Pulse convection with rapid lifecycle under 35 minutes.",
    divergencePointMin: 35,
    isSimulated: true
  },
  {
    id: 'ENS-07',
    memberId: 'PRAGYA-E07',
    category: 'Ordinary Convection',
    probability: 7,
    predictabilityScore: 50,
    peakCape: 2050,
    peakRainfallRate: 24,
    maxVerticalVelocity: 12.8,
    radarReflectivityDbz: 43,
    description: "Orographic spillover resulting in short-lived valley showers.",
    divergencePointMin: 55,
    isSimulated: true
  },
  // Severe Thunderstorm
  {
    id: 'ENS-08',
    memberId: 'PRAGYA-E08',
    category: 'Severe Thunderstorm',
    probability: 18,
    predictabilityScore: 82,
    peakCape: 2750,
    peakRainfallRate: 64,
    maxVerticalVelocity: 24.5,
    radarReflectivityDbz: 56,
    description: "Supercell split with intense right-moving meso-anticyclone and severe hail.",
    divergencePointMin: 60,
    isSimulated: true
  },
  {
    id: 'ENS-09',
    memberId: 'PRAGYA-E09',
    category: 'Severe Thunderstorm',
    probability: 16,
    predictabilityScore: 78,
    peakCape: 2680,
    peakRainfallRate: 58,
    maxVerticalVelocity: 22.1,
    radarReflectivityDbz: 54,
    description: "Squall-line bow echo with severe straight-line wind gusts (>85 km/h).",
    divergencePointMin: 58,
    isSimulated: true
  },
  {
    id: 'ENS-10',
    memberId: 'PRAGYA-E10',
    category: 'Severe Thunderstorm',
    probability: 15,
    predictabilityScore: 84,
    peakCape: 2890,
    peakRainfallRate: 72,
    maxVerticalVelocity: 26.2,
    radarReflectivityDbz: 58,
    description: "Persistent rotating updraft with intense lightning (>90 flashes/min).",
    divergencePointMin: 62,
    isSimulated: true
  },
  {
    id: 'ENS-11',
    memberId: 'PRAGYA-E11',
    category: 'Severe Thunderstorm',
    probability: 11,
    predictabilityScore: 75,
    peakCape: 2540,
    peakRainfallRate: 48,
    maxVerticalVelocity: 20.4,
    radarReflectivityDbz: 52,
    description: "Cell merger over plateau inducing vortex amplification.",
    divergencePointMin: 52,
    isSimulated: true
  },
  // Extreme Rainfall
  {
    id: 'ENS-12',
    memberId: 'PRAGYA-E12',
    category: 'Extreme Rainfall',
    probability: 8,
    predictabilityScore: 68,
    peakCape: 3200,
    peakRainfallRate: 115,
    maxVerticalVelocity: 29.8,
    radarReflectivityDbz: 62,
    description: "Stationary convective training over steep terrain triggering cloudburst (>100mm/h).",
    divergencePointMin: 65,
    isSimulated: true
  },
  {
    id: 'ENS-13',
    memberId: 'PRAGYA-E13',
    category: 'Extreme Rainfall',
    probability: 6,
    predictabilityScore: 65,
    peakCape: 3350,
    peakRainfallRate: 128,
    maxVerticalVelocity: 31.4,
    radarReflectivityDbz: 64,
    description: "Back-building mesoscale convective system anchored by coastal moisture plume.",
    divergencePointMin: 70,
    isSimulated: true
  },
  {
    id: 'ENS-14',
    memberId: 'PRAGYA-E14',
    category: 'Extreme Rainfall',
    probability: 4,
    predictabilityScore: 62,
    peakCape: 3100,
    peakRainfallRate: 98,
    maxVerticalVelocity: 27.5,
    radarReflectivityDbz: 60,
    description: "High-precipitation supercell with localized catastrophic flash-flood discharge.",
    divergencePointMin: 64,
    isSimulated: true
  },
  {
    id: 'ENS-15',
    memberId: 'PRAGYA-E15',
    category: 'Severe Thunderstorm',
    probability: 3,
    predictabilityScore: 71,
    peakCape: 2600,
    peakRainfallRate: 52,
    maxVerticalVelocity: 21.0,
    radarReflectivityDbz: 53,
    description: "Secondary convective surge along nocturnal drainage flow boundary.",
    divergencePointMin: 75,
    isSimulated: true
  },
  {
    id: 'ENS-16',
    memberId: 'PRAGYA-E16',
    category: 'Ordinary Convection',
    probability: 2,
    predictabilityScore: 40,
    peakCape: 1850,
    peakRainfallRate: 14,
    maxVerticalVelocity: 9.8,
    radarReflectivityDbz: 36,
    description: "Shallow maritime shower cluster dissipating before ridge line.",
    divergencePointMin: 42,
    isSimulated: true
  },
  {
    id: 'ENS-17',
    memberId: 'PRAGYA-E17',
    category: 'Dissipation',
    probability: 3,
    predictabilityScore: 32,
    peakCape: 1350,
    peakRainfallRate: 1,
    maxVerticalVelocity: 4.5,
    radarReflectivityDbz: 20,
    description: "Strong localized subsidence inversion cuts off boundary layer moisture flux.",
    divergencePointMin: 28,
    isSimulated: true
  },
  {
    id: 'ENS-18',
    memberId: 'PRAGYA-E18',
    category: 'Severe Thunderstorm',
    probability: 8,
    predictabilityScore: 76,
    peakCape: 2650,
    peakRainfallRate: 55,
    maxVerticalVelocity: 21.8,
    radarReflectivityDbz: 55,
    description: "Cell interaction along sea-breeze front generates intense localized squall line.",
    divergencePointMin: 54,
    isSimulated: true
  },
  {
    id: 'ENS-19',
    memberId: 'PRAGYA-E19',
    category: 'Extreme Rainfall',
    probability: 5,
    predictabilityScore: 66,
    peakCape: 3250,
    peakRainfallRate: 110,
    maxVerticalVelocity: 28.4,
    radarReflectivityDbz: 61,
    description: "Orographic rain band anchored over valley bottleneck triggering localized flash floods.",
    divergencePointMin: 68,
    isSimulated: true
  },
  {
    id: 'ENS-20',
    memberId: 'PRAGYA-E20',
    category: 'Ordinary Convection',
    probability: 4,
    predictabilityScore: 44,
    peakCape: 1920,
    peakRainfallRate: 16,
    maxVerticalVelocity: 10.5,
    radarReflectivityDbz: 38,
    description: "Isolated afternoon pulse cell decaying within 30 minutes of initiation.",
    divergencePointMin: 38,
    isSimulated: true
  }
];

// Storm Laboratory: Event A (Convective Developed) vs Event B (Convection Failed)
export const DEMO_DIFFERENCE_SIGNALS: DifferenceSignal[] = [
  {
    variable: "0-3 km Moisture Convergence",
    unit: "g/kg/hr",
    eventAValue: 5.4,
    eventBValue: 1.8,
    delta: 3.6,
    candidateDiscriminatingPower: 92,
    physicalContext: "Continuous boundary layer inflow feeding vertical parcel acceleration."
  },
  {
    variable: "CIN Erosion Rate (last 60m)",
    unit: "J/kg/hr",
    eventAValue: 48,
    eventBValue: 12,
    delta: 36,
    candidateDiscriminatingPower: 88,
    physicalContext: "Rapid thermal breaching of the capping inversion lid."
  },
  {
    variable: "Cloud-Top Cooling Rate",
    unit: "°C/15min",
    eventAValue: -9.2,
    eventBValue: -2.1,
    delta: -7.1,
    candidateDiscriminatingPower: 86,
    physicalContext: "Explosive vertical ascent penetrating the equilibrium level."
  },
  {
    variable: "0-6 km Bulk Wind Shear",
    unit: "m/s",
    eventAValue: 24.1,
    eventBValue: 13.8,
    delta: 10.3,
    candidateDiscriminatingPower: 79,
    physicalContext: "Sufficient tilt to decouple updraft core from precipitation downdraft."
  },
  {
    variable: "Surface-based CAPE",
    unit: "J/kg",
    eventAValue: 2650,
    eventBValue: 2480,
    delta: 170,
    candidateDiscriminatingPower: 34, // Note: CAPE alone was near-identical! Great scientific demonstration!
    physicalContext: "CAPE was nearly equal in both events; instability alone was NOT discriminating."
  },
  {
    variable: "700 hPa Relative Humidity",
    unit: "%",
    eventAValue: 84,
    eventBValue: 58,
    delta: 26,
    candidateDiscriminatingPower: 81,
    physicalContext: "Dry air entrainment at 700 hPa suffocated Event B updraft."
  },
  {
    variable: "Orographic Lift Angle",
    unit: "deg relative to ridge",
    eventAValue: 86, // Direct perpendicular flow
    eventBValue: 42, // Glancing oblique flow
    delta: 44,
    candidateDiscriminatingPower: 74,
    physicalContext: "Perpendicular inflow maximized forced mechanical boundary ascent."
  }
];

// Atmospheric Fingerprint (Radar/Normalized Metrics for Cell CX-017)
export const DEMO_CELL_FINGERPRINT: AtmosphericFingerprint = {
  cellId: 'CX-017',
  parameters: [
    {
      key: 'moisture',
      label: 'Moisture Convergence',
      value: 4.9,
      normalized: 82,
      unit: 'g/kg/hr',
      modelContributionWeight: 24,
      physicalMeaning: 'Rate of water vapor accumulation in lowest 1.5 km.'
    },
    {
      key: 'cape',
      label: 'Convective CAPE',
      value: 2480,
      normalized: 76,
      unit: 'J/kg',
      modelContributionWeight: 14,
      physicalMeaning: 'Potential energy available for parcel buoyant acceleration.'
    },
    {
      key: 'cin',
      label: 'CIN Depletion',
      value: 28,
      normalized: 71,
      unit: 'J/kg',
      modelContributionWeight: 18,
      physicalMeaning: 'Weakness of protective capping inversion lid.'
    },
    {
      key: 'shear',
      label: 'Deep-Layer Wind Shear',
      value: 22.4,
      normalized: 78,
      unit: 'm/s',
      modelContributionWeight: 16,
      physicalMeaning: 'Organizing kinematic framework preventing premature cell drowning.'
    },
    {
      key: 'vertical_velocity',
      label: 'Vertical Velocity',
      value: 14.8,
      normalized: 65,
      unit: 'm/s',
      modelContributionWeight: 11,
      physicalMeaning: 'Core updraft speed driving hydrometeor lofting.'
    },
    {
      key: 'cloud_cooling',
      label: 'Cloud-Top Cooling',
      value: 8.6,
      normalized: 74,
      unit: '°C/15m',
      modelContributionWeight: 10,
      physicalMeaning: 'Satellite IR proxy for explosive vertical cloud tower growth.'
    },
    {
      key: 'terrain_forcing',
      label: 'Terrain Forcing',
      value: 88,
      normalized: 88,
      unit: '%',
      modelContributionWeight: 7,
      physicalMeaning: 'Steep topographic gradient forcing parcel lift above LFC.'
    }
  ]
};

// Historical Replay Demo Event
export const DEMO_HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'HIST-2024-05',
    code: 'EVENT-KCB-2024',
    name: 'Konkan Coastal Cloudburst Genesis',
    date: '2024-07-26',
    region: 'Western Ghats Ridge & Mumbai Eastern Flank',
    description: 'Rapidly organizing cloudburst cell delivering 142mm rainfall in 75 minutes. Replay demonstrates when predictability first crossed the defensible threshold.',
    actualOutcome: 'Extreme Rainfall',
    thresholdCrossingMinute: -47,
    leadTimeMinutes: 47,
    steps: [
      {
        minute: -180,
        label: "T-180 min",
        eventRisk: 18,
        predictability: 12,
        radarReflectivity: 12,
        satelliteTempC: 18,
        lightningDetected: 0,
        revealedObservation: "Synoptic AWS reports steady southwesterly monsoon flow. No radar echoes.",
        precursorSignalStatus: "No distinct precursor distinguishable from synoptic baseline noise.",
        isThresholdCrossed: false
      },
      {
        minute: -150,
        label: "T-150 min",
        eventRisk: 22,
        predictability: 16,
        radarReflectivity: 16,
        satelliteTempC: 14,
        lightningDetected: 0,
        revealedObservation: "Subtle convergence corridor begins forming along coastal sea-breeze front.",
        precursorSignalStatus: "Weak boundary layer moisture gradient detected (+1.2 g/kg).",
        isThresholdCrossed: false
      },
      {
        minute: -120,
        label: "T-120 min",
        eventRisk: 28,
        predictability: 24,
        radarReflectivity: 22,
        satelliteTempC: 8,
        lightningDetected: 1,
        revealedObservation: "First cumulus congestus towers resolve on INSAT-3D visible channel.",
        precursorSignalStatus: "CIN reducing from -80 to -42 J/kg at Lonavala AWS.",
        isThresholdCrossed: false
      },
      {
        minute: -90,
        label: "T-90 min",
        eventRisk: 39,
        predictability: 35,
        radarReflectivity: 28,
        satelliteTempC: -4,
        lightningDetected: 6,
        revealedObservation: "Doppler radar shows isolated 30 dBZ core at 4.2 km altitude.",
        precursorSignalStatus: "Updraft helicity signal emerges in experimental wind profiler data.",
        isThresholdCrossed: false
      },
      {
        minute: -60,
        label: "T-60 min",
        eventRisk: 54,
        predictability: 48,
        radarReflectivity: 38,
        satelliteTempC: -19,
        lightningDetected: 19,
        revealedObservation: "Rapid cloud-top cooling accelerates to -7.5°C/15min. Cell merges with secondary updraft.",
        precursorSignalStatus: "Multi-model ensemble bifurcation index drops from 0.72 to 0.44.",
        isThresholdCrossed: false
      },
      {
        minute: -47,
        label: "T-47 min",
        eventRisk: 68,
        predictability: 74,
        radarReflectivity: 48,
        satelliteTempC: -36,
        lightningDetected: 52,
        revealedObservation: "★ PREDICTABILITY THRESHOLD CROSSED. Deep moist convective column locked in phase space.",
        precursorSignalStatus: "EARLIEST DEFENSIBLE WARNING WINDOW. High confidence of severe precipitation arrival.",
        isThresholdCrossed: true
      },
      {
        minute: -30,
        label: "T-30 min",
        eventRisk: 82,
        predictability: 88,
        radarReflectivity: 55,
        satelliteTempC: -52,
        lightningDetected: 84,
        revealedObservation: "Hail growth zone loaded with dense hydrometeors. Intense lightning barrage.",
        precursorSignalStatus: "Mature supercellular structure confirmed by dual-pol ZDR drop.",
        isThresholdCrossed: true
      },
      {
        minute: -15,
        label: "T-15 min",
        eventRisk: 92,
        predictability: 95,
        radarReflectivity: 61,
        satelliteTempC: -66,
        lightningDetected: 126,
        revealedObservation: "Overshooting top penetrates tropopause. Ground AWS reports first severe squalls.",
        precursorSignalStatus: "Extreme localized precipitation imminent.",
        isThresholdCrossed: true
      },
      {
        minute: 0,
        label: "T-0 (Event Genesis)",
        eventRisk: 98,
        predictability: 99,
        radarReflectivity: 65,
        satelliteTempC: -72,
        lightningDetected: 168,
        revealedObservation: "Severe cloudburst in progress: 142 mm/hr instantaneous rate recorded.",
        precursorSignalStatus: "Event fully verified against ground rain gauge network.",
        isThresholdCrossed: true
      }
    ]
  }
];

// Observation Gaps
export const DEMO_OBSERVATION_GAPS: ObservationGap[] = [
  {
    id: 'GAP-01',
    weaklyObservedVariable: 'Vertical Humidity Profile (Moisture Tongue)',
    altitudeRangeKm: [2.1, 3.4],
    spatialRegion: 'Western Ghats Windward Inflow Corridor (40x60 km box)',
    currentUncertainty: '±28% RH uncertainty due to infrared satellite cloud attenuation',
    expectedInformationValue: 'CRITICAL',
    platformLimitation: 'Geostationary IR sounder cannot penetrate mid-level anvil deck; radiosondes launched only 12-hourly.',
    recommendedSensorTarget: 'Ground-based Raman Lidar / Microwave Radiometer Profiler with 10-minute cadence',
    simulationBox: {
      x: [-3, 3],
      y: [2.1, 3.4],
      z: [-2, 2]
    }
  },
  {
    id: 'GAP-02',
    weaklyObservedVariable: 'Boundary Layer Convergence Line Genesis',
    altitudeRangeKm: [0.1, 0.9],
    spatialRegion: 'Coastal Sea-Breeze / Orographic Junction Zone',
    currentUncertainty: 'Wind vector divergence unresolved below Doppler radar radar horizon',
    expectedInformationValue: 'HIGH',
    platformLimitation: 'Radar beam elevation angle overshoots lowest 500m at ranges > 65 km.',
    recommendedSensorTarget: 'Dense Doppler Sodar array or Low-altitude Scanning LiDAR network',
    simulationBox: {
      x: [-4, 4],
      y: [0.1, 0.9],
      z: [1, 4]
    }
  },
  {
    id: 'GAP-03',
    weaklyObservedVariable: 'Ice-Phase Hydrometeor Size Distribution',
    altitudeRangeKm: [5.5, 8.2],
    spatialRegion: 'Convective Core Freezing Layer (-10°C to -35°C)',
    currentUncertainty: 'Hail vs graupel mass fraction ratio uncertain by factor of 3.2x',
    expectedInformationValue: 'HIGH',
    platformLimitation: 'Single-polarization legacy radar lacks differential reflectivity (ZDR) and specific differential phase (KDP).',
    recommendedSensorTarget: 'Dual-polarization X/C-band Radar with dedicated hydrometeor classification algorithms',
    simulationBox: {
      x: [-2, 2],
      y: [5.5, 8.2],
      z: [-3, 1]
    }
  }
];

// Citizen Alerts (Trilingual)
export const DEMO_CITIZEN_ALERT: WeatherAlert = {
  id: 'ALERT-DEMO-2026-09',
  level: 'WATCH',
  title: 'SEVERE WEATHER WATCH',
  eventType: 'Rapidly Developing Thunderstorm & High-Rate Rain',
  arrivalTimeMin: [42, 65],
  confidence: 'MODERATE',
  predictabilityState: 'Earliest Defensible Prediction Window Reached (T-47 min)',
  hazards: [
    'Intense Localized Rainfall (50-80 mm/hr)',
    'Frequent Cloud-to-Ground Lightning',
    'Sudden Gusty Winds (>65 km/h)',
    'Localized Water Accumulation in Low-Lying Crossings'
  ],
  affectedDistricts: ['Lonavala - Khandala Ghats', 'Eastern Raigad Sector', 'Karjat Highland Valley'],
  safetyGuidance: {
    en: [
      'Seek sturdy indoor shelter immediately if thunder is audible.',
      'Stay away from tall isolated trees, utility poles, and open ridge tops.',
      'Avoid driving through waterlogged dips, ghat roads, or low causeways.',
      'Unplug sensitive electrical equipment during active electrical activity.'
    ],
    hi: [
      'यदि गड़गड़ाहट सुनाई दे, तो तुरंत किसी मजबूत पक्के भवन में शरण लें।',
      'ऊंचे अकेले पेड़ों, बिजली के खंभों और खुले पहाड़ी कगारों से दूर रहें।',
      'जलभराव वाले घाट मार्गों और निचले रास्तों पर वाहन चलाने से बचें।',
      'आकाशीय बिजली चमकने के दौरान संवेदनशील बिजली के उपकरणों को अनप्लग करें।'
    ],
    mr: [
      'गडाडाट ऐकू येताच तात्काळ सुरक्षित व पक्क्या इमारतीत आश्रय घ्यावा.',
      'उंच झाडे, विजेचे खांब आणि उघड्या डोंगरमाथ्यांपासून दूर राहा.',
      'पाणी साचलेले घाट रस्ते आणि लहान पुलांवरून वाहन चालवणे टाळा.',
      'विजांचा कडकडाट सुरू असताना घरातील संवेदनशील विद्युत उपकरणे बंद ठेवा.'
    ]
  },
  translations: {
    en: {
      title: 'SEVERE WEATHER WATCH',
      arrival: 'Estimated Arrival Window: 42 – 65 minutes',
      confidence: 'Predictability Confidence: Moderate (Defensible)',
      hazardsText: 'Potential Atmospheric Hazards:',
      guidanceHeader: 'Recommended Precautionary Steps:'
    },
    hi: {
      title: 'गंभीर मौसम निगरानी चेतावनी (WATCH)',
      arrival: 'संभावित आगमन समय: 42 – 65 मिनट',
      confidence: 'पूर्वानुमान विश्वसनीयता: मध्यम (वैज्ञानिक आधार)',
      hazardsText: 'संभावित मौसमी खतरे:',
      guidanceHeader: 'सुझाई गई सुरक्षा सावधानियां:'
    },
    mr: {
      title: 'तीव्र हवामान सतर्कता इशारा (WATCH)',
      arrival: 'अपेक्षित आगमन वेळ: ४२ ते ६५ मिनिटे',
      confidence: 'अंदाज विश्वासार्हता: मध्यम (शास्त्रीय आधार)',
      hazardsText: 'संभाव्य हवामान धोके:',
      guidanceHeader: 'सुरक्षिततेसाठी घ्यावयाची खबरदारी:'
    }
  }
};

// Model Performance Scientific Placeholders
export const DEMO_MODEL_METRICS: ModelMetricPlaceholder[] = [
  {
    id: 'METRIC-POD',
    metric: 'Probability of Detection (POD)',
    abbreviation: 'POD',
    category: 'DETECTION',
    mathematicalDefinition: 'Hits / (Hits + Misses) for severe convective threshold exceedances',
    targetBenchmark: '> 0.78 at 45-minute lead time',
    status: 'AWAITING_EXPERIMENTAL_DATA',
    validationDatasetRequirement: 'Requires 500+ dual-pol radar radar-verified convective events across Indian monsoon regimes'
  },
  {
    id: 'METRIC-FAR',
    metric: 'False Alarm Ratio (FAR)',
    abbreviation: 'FAR',
    category: 'DETECTION',
    mathematicalDefinition: 'False Alarms / (Hits + False Alarms)',
    targetBenchmark: '< 0.22 across operational warm-season domain',
    status: 'AWAITING_EXPERIMENTAL_DATA',
    validationDatasetRequirement: 'Cross-validated against IMD AWS 15-minute gauge records'
  },
  {
    id: 'METRIC-CSI',
    metric: 'Critical Success Index (Threat Score)',
    abbreviation: 'CSI',
    category: 'DETECTION',
    mathematicalDefinition: 'Hits / (Hits + Misses + False Alarms)',
    targetBenchmark: '> 0.65 for >50 dBZ composite reflectivity cores',
    status: 'AWAITING_EXPERIMENTAL_DATA',
    validationDatasetRequirement: 'Multi-radar mosaic testbed with blind retrospective replay'
  },
  {
    id: 'METRIC-BRIER',
    metric: 'Brier Score & Resolution',
    abbreviation: 'BS',
    category: 'PROBABILISTIC',
    mathematicalDefinition: 'Mean squared difference between predicted probabilities and observed binary outcomes',
    targetBenchmark: '< 0.12 with sharp reliability curve calibration',
    status: 'AWAITING_EXPERIMENTAL_DATA',
    validationDatasetRequirement: 'Ensemble reliability diagram over 3 convective seasons'
  },
  {
    id: 'METRIC-LEAD',
    metric: 'Defensible Lead Time Advantage',
    abbreviation: 'DLT',
    category: 'TIMING',
    mathematicalDefinition: 'Time elapsed between earliest defensible predictability crossing and ground event onset',
    targetBenchmark: '35 – 60 minutes prior to severe surface precipitation',
    status: 'AWAITING_EXPERIMENTAL_DATA',
    validationDatasetRequirement: 'High-speed automated disdrometer network validation'
  },
  {
    id: 'METRIC-SPATIAL',
    metric: 'Fractions Skill Score (Spatial Error)',
    abbreviation: 'FSS',
    category: 'SPATIAL',
    mathematicalDefinition: 'Spatial neighborhood scale metric comparing forecast fraction to observed radar echo fraction',
    targetBenchmark: '> 0.5 at 4 km spatial resolution',
    status: 'AWAITING_EXPERIMENTAL_DATA',
    validationDatasetRequirement: 'Gridded QPE comparison at 1 km / 5-minute resolution'
  }
];

// Centralized Vertical Atmospheric Profile Soundings (0-12 km)
export const DEMO_VERTICAL_SOUNDINGS: VerticalProfileLevel[] = [
  {
    altitudeKm: 0,
    pressureHpa: 1004,
    temperatureC: 29.4,
    relativeHumidity: 84,
    dewPointC: 26.2,
    windSpeedMs: 6.8,
    windSpeedKnots: 13.2,
    windDirectionDeg: 245,
    windDirectionText: 'WSW',
    verticalVelocityMs: 0.2,
    potentialTempK: 302.1,
    description: 'Maritime boundary layer with high water vapor mixing ratio (21.4 g/kg). Strong onshore friction.',
    isSimulated: true
  },
  {
    altitudeKm: 1,
    pressureHpa: 902,
    temperatureC: 22.8,
    relativeHumidity: 88,
    dewPointC: 20.6,
    windSpeedMs: 12.4,
    windSpeedKnots: 24.1,
    windDirectionDeg: 250,
    windDirectionText: 'WSW',
    verticalVelocityMs: 1.8,
    potentialTempK: 304.5,
    description: 'Top of convective mixed layer. Moisture flux converging toward orographic barrier.',
    isSimulated: true
  },
  {
    altitudeKm: 2,
    pressureHpa: 805,
    temperatureC: 16.2,
    relativeHumidity: 82,
    dewPointC: 13.1,
    windSpeedMs: 14.8,
    windSpeedKnots: 28.7,
    windDirectionDeg: 260,
    windDirectionText: 'W',
    verticalVelocityMs: 3.5,
    potentialTempK: 307.2,
    description: 'Level of Free Convection (LFC). Low-level jet providing strong moisture convergence.',
    isSimulated: true
  },
  {
    altitudeKm: 3,
    pressureHpa: 715,
    temperatureC: 9.8,
    relativeHumidity: 74,
    dewPointC: 5.3,
    windSpeedMs: 16.5,
    windSpeedKnots: 32.0,
    windDirectionDeg: 265,
    windDirectionText: 'W',
    verticalVelocityMs: 7.2,
    potentialTempK: 310.8,
    description: 'Lower mid-troposphere. Active buoyant parcel acceleration entering the core updraft.',
    isSimulated: true
  },
  {
    altitudeKm: 4,
    pressureHpa: 632,
    temperatureC: 1.2,
    relativeHumidity: 71,
    dewPointC: -3.4,
    windSpeedMs: 18.2,
    windSpeedKnots: 35.3,
    windDirectionDeg: 270,
    windDirectionText: 'W',
    verticalVelocityMs: 11.4,
    potentialTempK: 314.9,
    description: 'Near Freezing Level (0°C isotherm at 4.2 km). Supercooled liquid droplets condensing rapidly.',
    isSimulated: true
  },
  {
    altitudeKm: 6,
    pressureHpa: 498,
    temperatureC: -12.4,
    relativeHumidity: 65,
    dewPointC: -17.8,
    windSpeedMs: 22.0,
    windSpeedKnots: 42.7,
    windDirectionDeg: 280,
    windDirectionText: 'WNW',
    verticalVelocityMs: 16.8,
    potentialTempK: 324.6,
    description: 'Hail Growth Zone base (-10°C). Supercooled water and ice embryo accretion layer.',
    isSimulated: true
  },
  {
    altitudeKm: 8,
    pressureHpa: 382,
    temperatureC: -26.5,
    relativeHumidity: 58,
    dewPointC: -32.1,
    windSpeedMs: 25.4,
    windSpeedKnots: 49.3,
    windDirectionDeg: 285,
    windDirectionText: 'WNW',
    verticalVelocityMs: 19.5,
    potentialTempK: 335.2,
    description: 'Upper Hail Growth Zone (-25°C to -30°C). Graupel recrystalization and charge separation.',
    isSimulated: true
  },
  {
    altitudeKm: 10,
    pressureHpa: 288,
    temperatureC: -43.2,
    relativeHumidity: 46,
    dewPointC: -51.0,
    windSpeedMs: 28.6,
    windSpeedKnots: 55.5,
    windDirectionDeg: 75,
    windDirectionText: 'ENE',
    verticalVelocityMs: 12.0,
    potentialTempK: 347.1,
    description: 'Tropical Easterly Jet interface. Strong directional wind shear spreading anvil cirrus.',
    isSimulated: true
  },
  {
    altitudeKm: 12,
    pressureHpa: 210,
    temperatureC: -58.6,
    relativeHumidity: 32,
    dewPointC: -68.4,
    windSpeedMs: 34.0,
    windSpeedKnots: 66.0,
    windDirectionDeg: 85,
    windDirectionText: 'E',
    verticalVelocityMs: 2.1,
    potentialTempK: 362.4,
    description: 'Tropopause lid (Equilibrium Level). Overshooting dome penetration and radial anvil divergence.',
    isSimulated: true
  }
];

// 3D Scene positions and spatial attributes for Simulated Storm Cells
export const DEMO_CELL_POSITIONS_3D: Record<string, {
  position: [number, number, number];
  baseRadius: number;
  heightKm: number;
  label: string;
  region: string;
}> = {
  'CX-017': {
    position: [1.5, 0, -0.5],
    baseRadius: 2.8,
    heightKm: 11.4,
    label: 'Cell CX-017 (Primary Focus)',
    region: 'Western Ghats Orographic Interface'
  },
  'CX-012': {
    position: [7.2, 0, -3.2],
    baseRadius: 1.8,
    heightKm: 7.8,
    label: 'Cell CX-012 (Inland Flank)',
    region: 'Deccan Plateau Convergence Belt'
  },
  'CX-024': {
    position: [-6.8, 0, 4.2],
    baseRadius: 3.4,
    heightKm: 13.2,
    label: 'Cell CX-024 (Coastal Confluence)',
    region: 'Konkan Maritime Boundary'
  },
  'CX-031': {
    position: [2.8, 0, 5.0],
    baseRadius: 1.4,
    heightKm: 5.2,
    label: 'Cell CX-031 (Valley Trap)',
    region: 'Khandala Escarpment Micro-basin'
  }
};

// Detailed timeline stage and predictability progression
export const DEMO_TIMELINE_METRICS: Record<string, {
  stage: ConvectiveStage;
  stormRisk: number;
  predictability: number;
  observationConfidence: number;
  isThresholdCrossed: boolean;
  label: string;
  title: string;
  description: string;
}> = {
  '-3h': {
    stage: 'STABLE',
    stormRisk: 18,
    predictability: 14,
    observationConfidence: 45,
    isThresholdCrossed: false,
    label: '-3h',
    title: 'Boundary Layer Thermodynamic Accumulation',
    description: 'High capping inversion (CIN -92 J/kg). Small shallow cumulus with negligible vertical motion.'
  },
  '-2h': {
    stage: 'INITIATION',
    stormRisk: 32,
    predictability: 25,
    observationConfidence: 54,
    isThresholdCrossed: false,
    label: '-2h',
    title: 'Moisture Convergence & Cap Thinning',
    description: 'Localized convergence corridor forming along mountain base. Cumulus congestus towers reaching 4 km.'
  },
  '-1h': {
    stage: 'DEVELOPING',
    stormRisk: 52,
    predictability: 46,
    observationConfidence: 68,
    isThresholdCrossed: false,
    label: '-1h',
    title: 'Rapid Updraft Core Acceleration',
    description: 'CIN cap perforated. Deep buoyant vertical ascent (>12 m/s) piercing mid-level freezing zone.'
  },
  'NOW': {
    stage: 'MATURE',
    stormRisk: 67,
    predictability: 74,
    observationConfidence: 86,
    isThresholdCrossed: true,
    label: 'NOW',
    title: 'Mature Deep Convective Column',
    description: 'PREDICTABILITY THRESHOLD CROSSED. Intense radar core (>52 dBZ), hail-growth zone, and heavy precipitation.'
  },
  '+30m': {
    stage: 'EXTREME',
    stormRisk: 86,
    predictability: 89,
    observationConfidence: 91,
    isThresholdCrossed: true,
    label: '+30m',
    title: 'Peak Overshooting Top & Cloudburst Genesis',
    description: 'Updraft >24 m/s overshooting tropopause. Severe precipitation shaft (>90 mm/h) with frequent lightning.'
  },
  '+1h': {
    stage: 'EXTREME',
    stormRisk: 92,
    predictability: 94,
    observationConfidence: 94,
    isThresholdCrossed: true,
    label: '+1h',
    title: 'Squall Line Gust Front & Cold Pool Outflow',
    description: 'Bow echo progression. Severe straight-line winds (>75 km/h) expanding across valley floor.'
  },
  '+3h': {
    stage: 'MATURE',
    stormRisk: 48,
    predictability: 82,
    observationConfidence: 88,
    isThresholdCrossed: true,
    label: '+3h',
    title: 'Stratiform Anvil Precipitation & Decay',
    description: 'Updraft root decaying. Extensive cirrus shield with moderate stratiform rain and weak thunder.'
  },
  '+6h': {
    stage: 'STABLE',
    stormRisk: 15,
    predictability: 70,
    observationConfidence: 82,
    isThresholdCrossed: true,
    label: '+6h',
    title: 'Post-Convective Stabilization',
    description: 'Complete cell dissipation. Residual high-level cirrus remnants drifting eastward.'
  }
};

