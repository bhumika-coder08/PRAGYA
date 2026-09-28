/**
 * PRAGYA FUTURE DATA LEAKAGE TEST RUNNER
 * Automated verification suite ensuring that no future observations
 * can ever leak into prior-time analytical evaluations or state inferences.
 *
 * Requirements:
 * - At T-120, data from T-60 cannot be retrieved.
 * - At T-30, data from T0 cannot be retrieved.
 * - At T0, all allowed historical observations become available.
 * - If leakage occurs, test must fail with an explicit violation report.
 */

import { replayClock } from './replayClockService';
import { predictabilityEngine } from './predictabilityEngine';

export interface LeakageTestCaseResult {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  timeContext: string;
  assertion: string;
  details: string;
}

export interface LeakageTestSuiteSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  allPassed: boolean;
  executionTimestamp: string;
  results: LeakageTestCaseResult[];
}

export class LeakageTestRunner {
  public static runAllTests(): LeakageTestSuiteSummary {
    const results: LeakageTestCaseResult[] = [];
    const originalTime = replayClock.getCurrentMinute();

    try {
      // ----------------------------------------------------------------------
      // TEST 1: At T-120, data from T-60 cannot be retrieved
      // ----------------------------------------------------------------------
      replayClock.setTime(-120);
      const obsT60AtT120 = replayClock.getObservationAtOffset(-60);
      const isLockedT60 = replayClock.isOffsetLocked(-60);
      const accessibleObsT120 = replayClock.getAccessibleObservations(-120);
      const hasT60InList = accessibleObsT120.some(o => o.minuteOffset === -60);

      const test1Passed = obsT60AtT120 === null && isLockedT60 && !hasT60InList;
      results.push({
        id: 'LEAK-TEST-01',
        name: 'T-120 to T-60 Future Observation Barrier',
        description: 'Verify that when ReplayClock is at T-120m, observation from T-60m is strictly inaccessible.',
        passed: test1Passed,
        timeContext: 'ReplayClock = T-120m',
        assertion: 'getObservationAtOffset(-60) === null && isOffsetLocked(-60) === true',
        details: test1Passed
          ? 'Passed: T-60 observation was properly blocked and locked. No future data leaked.'
          : 'FAILED: T-60 observation was retrieved or listed under T-120 time context!'
      });

      // ----------------------------------------------------------------------
      // TEST 2: At T-30, data from T0 cannot be retrieved
      // ----------------------------------------------------------------------
      replayClock.setTime(-30);
      const obsT0AtT30 = replayClock.getObservationAtOffset(0);
      const isLockedT0 = replayClock.isOffsetLocked(0);
      const accessibleObsT30 = replayClock.getAccessibleObservations(-30);
      const hasT0InList = accessibleObsT30.some(o => o.minuteOffset === 0);

      const test2Passed = obsT0AtT30 === null && isLockedT0 && !hasT0InList;
      results.push({
        id: 'LEAK-TEST-02',
        name: 'T-30 to T0 Onset Observation Barrier',
        description: 'Verify that when ReplayClock is at T-30m, initiation onset data (T0) is strictly locked.',
        passed: test2Passed,
        timeContext: 'ReplayClock = T-30m',
        assertion: 'getObservationAtOffset(0) === null && isOffsetLocked(0) === true',
        details: test2Passed
          ? 'Passed: T0 onset data was securely locked at T-30m. Causal boundary held.'
          : 'FAILED: T0 onset observation leaked into T-30m window!'
      });

      // ----------------------------------------------------------------------
      // TEST 3: At T0, all allowed historical observations become available
      // ----------------------------------------------------------------------
      replayClock.setTime(0);
      const accessibleObsT0 = replayClock.getAccessibleObservations(0);
      const obsT180AtT0 = replayClock.getObservationAtOffset(-180);
      const obsT47AtT0 = replayClock.getObservationAtOffset(-47);
      const obsT0AtT0 = replayClock.getObservationAtOffset(0);

      const allPresent = obsT180AtT0 !== null && obsT47AtT0 !== null && obsT0AtT0 !== null;
      const test3Passed = accessibleObsT0.length >= 8 && allPresent;

      results.push({
        id: 'LEAK-TEST-03',
        name: 'T0 Cumulative Historical Sequence Retrieval',
        description: 'Verify that once ReplayClock reaches T0, all prior historical timesteps become accessible.',
        passed: test3Passed,
        timeContext: 'ReplayClock = T0',
        assertion: 'accessibleObservations.length >= 8 && obsT0 !== null',
        details: test3Passed
          ? `Passed: All ${accessibleObsT0.length} historical observations successfully available at onset.`
          : 'FAILED: Some prior historical observations were missing at T0.'
      });

      // ----------------------------------------------------------------------
      // TEST 4: Predictability Horizon calculation at T-47 has no future bias
      // ----------------------------------------------------------------------
      replayClock.setTime(-47);
      const horizon = predictabilityEngine.detectPredictabilityHorizon('CX-017', 70, 2);
      const isStillLockedFuture = replayClock.isOffsetLocked(-30) && replayClock.isOffsetLocked(0);

      const test4Passed = horizon.firstCrossingMinute === -47 && isStillLockedFuture;
      results.push({
        id: 'LEAK-TEST-04',
        name: 'Predictability Engine Independent Horizon Verification',
        description: 'Verify that Predictability Horizon is established strictly at T-47m while T-30m and T0 remain locked.',
        passed: test4Passed,
        timeContext: 'ReplayClock = T-47m',
        assertion: 'horizon.firstCrossingMinute === -47 && isOffsetLocked(-30) === true',
        details: test4Passed
          ? 'Passed: Horizon verified at T-47m without accessing downstream storm intensification data.'
          : 'FAILED: Predictability Engine accessed or required future state at T-47m!'
      });

    } finally {
      // Restore original clock position
      replayClock.setTime(originalTime);
    }

    const passedCount = results.filter(r => r.passed).length;

    return {
      totalTests: results.length,
      passedTests: passedCount,
      failedTests: results.length - passedCount,
      allPassed: passedCount === results.length,
      executionTimestamp: new Date().toISOString(),
      results
    };
  }
}
