import { UnitConversion } from '../src/server/science/unitConversion.js';
import { ConvectiveFeatureEngine } from '../src/server/science/convectiveFeatureEngine.js';
import { PrecursorSignalEngine } from '../src/server/science/precursorSignalEngine.js';
import { SpatiotemporalAlignment } from '../src/server/science/spatiotemporalAlignment.js';
import { NormalizedObservation } from '../src/server/data-sources/types.js';

console.log('====================================================');
console.log('PRAGYA SCIENTIFIC PIPELINE & UNIT VERIFICATION TEST');
console.log('====================================================');

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✓ PASSED: ${msg}`);
    passed++;
  } else {
    console.error(`✗ FAILED: ${msg}`);
    failed++;
  }
}

// 1. Temperature Conversion
const c = UnitConversion.kelvinToCelsius(300.15);
assert(c === 27.0, `300.15 K converts to 27.0 °C (got: ${c})`);

const k = UnitConversion.celsiusToKelvin(25.0);
assert(k === 298.15, `25.0 °C converts to 298.15 K (got: ${k})`);

// 2. Pressure Conversion
const hpa = UnitConversion.pascalsToHectopascals(101325);
assert(hpa === 1013.25, `101325 Pa converts to 1013.25 hPa (got: ${hpa})`);

// 3. Wind Speed Conversion
const kmh = UnitConversion.metersPerSecondToKmPerHour(10);
assert(kmh === 36.0, `10 m/s converts to 36.0 km/h (got: ${kmh})`);

// 4. Geopotential to Height
const z = UnitConversion.geopotentialToHeightMeters(9806.65);
assert(z === 1000.0, `9806.65 m^2/s^2 geopotential converts to 1000.0 gpm (got: ${z})`);

// 5. Convective Features - Dew Point
const dp = ConvectiveFeatureEngine.calculateDewPoint(30.0, 70.0);
assert(dp.value !== null && dp.value > 23 && dp.value < 25, `30°C at 70% RH gives dew point ~23.9°C (got: ${dp.value})`);

// 6. Convective Features - Missing Variable Honesty (Never Fabricate!)
const missingDp = ConvectiveFeatureEngine.calculateDewPoint(null, 70.0);
assert(missingDp.value === null && missingDp.qualityStatus === 'MISSING', 'Missing temperature produces null dew point with qualityStatus = MISSING');

// 7. Spatiotemporal Alignment - Time Gating Guard
const now = new Date('2023-07-09T12:00:00Z');
const futureObs: NormalizedObservation = {
  id: 'future-1',
  dataSourceId: 'src-test',
  observedAt: new Date('2023-07-09T11:50:00Z'),
  availableAt: new Date('2023-07-09T12:15:00Z'), // Arrives at 12:15!
  latitude: 28.59,
  longitude: 77.16,
  variable: 'temperature',
  value: 35.0,
  unit: 'degC',
  qualityStatus: 'VALID',
  observationType: 'POINT',
  isDerived: false,
  provenance: {
    provider: 'Test',
    source: 'Test',
    dataset: 'Test',
    originalVariable: 't',
    retrievedAt: now.toISOString(),
    processingLevel: 'L1',
    qualityStatus: 'VALID',
    licenseOrCitation: 'Test',
  },
};

const nearest = SpatiotemporalAlignment.findNearestTime([futureObs], 'temperature', now, 30);
assert(nearest === null, 'Observation arriving at 12:15 cannot be queried at targetTime 12:00 (Future Leakage Guarded)');

console.log('====================================================');
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('====================================================');

if (failed > 0) process.exit(1);
