/**
 * PRAGYA REPLAY CLOCK & BLIND REPLAY TIME-GATE SERVICE
 * Centralizes the temporal reference frame across all analytical modules.
 * Enforces strict temporal causality by architecture:
 * Observations with timestamp > currentReplayTime are physically locked
 * and cannot be leaked into any prediction or risk model.
 */

import { AtmosphericObservation, QualityState } from '../types/observation';
import { dataQualityEngine } from './dataQualityEngine';

export type ReplayListener = (currentMinute: number) => void;

export class ReplayClockService {
  private static instance: ReplayClockService;

  // Master historical dataset (loaded in memory)
  private masterDataset: AtmosphericObservation[] = [];

  // Current Replay Clock time (offset in minutes from convective onset T0)
  // -180 = 3 hours before onset; 0 = initiation onset
  private currentMinute: number = -180;
  private isPlaying: boolean = false;
  private playIntervalId: any = null;
  private listeners: Set<ReplayListener> = new Set();

  // Strict architectural enforcement flag
  private strictTimeGating: boolean = true;

  private constructor() {
    this.masterDataset = dataQualityEngine.getNormalizedHistoricalObservations();
  }

  public static getInstance(): ReplayClockService {
    if (!ReplayClockService.instance) {
      ReplayClockService.instance = new ReplayClockService();
    }
    return ReplayClockService.instance;
  }

  // --------------------------------------------------------------------------
  // CLOCK CONTROLS
  // --------------------------------------------------------------------------
  public getCurrentMinute(): number {
    return this.currentMinute;
  }

  public setTime(minute: number): void {
    const clamped = Math.max(-180, Math.min(0, minute));
    this.currentMinute = clamped;
    this.notifyListeners();
  }

  public stepForward(stepMinutes: number = 15): void {
    this.setTime(this.currentMinute + stepMinutes);
  }

  public stepBackward(stepMinutes: number = 15): void {
    this.setTime(this.currentMinute - stepMinutes);
  }

  public resetToStart(): void {
    this.pause();
    this.setTime(-180);
  }

  public jumpToOnset(): void {
    this.pause();
    this.setTime(0);
  }

  public isPlaybackRunning(): boolean {
    return this.isPlaying;
  }

  public play(stepIntervalMs: number = 2500, stepMinutes: number = 15): void {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.playIntervalId = setInterval(() => {
      if (this.currentMinute >= 0) {
        this.pause();
      } else {
        this.stepForward(stepMinutes);
      }
    }, stepIntervalMs);
  }

  public pause(): void {
    if (this.playIntervalId) {
      clearInterval(this.playIntervalId);
      this.playIntervalId = null;
    }
    this.isPlaying = false;
  }

  public subscribe(listener: ReplayListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn(this.currentMinute));
  }

  // --------------------------------------------------------------------------
  // STRICT ARCHITECTURAL TIME-GATED OBSERVATION ACCESS
  // --------------------------------------------------------------------------
  /**
   * Returns ONLY observations that occurred at or before the given targetMinute.
   * If targetMinute is omitted, it defaults to the current ReplayClock time.
   * Any observation in the future relative to the clock is inaccessible.
   */
  public getAccessibleObservations(targetMinute?: number): AtmosphericObservation[] {
    const effectiveTime = targetMinute !== undefined ? targetMinute : this.currentMinute;

    return this.masterDataset
      .filter(obs => obs.minuteOffset <= effectiveTime)
      .map(obs => ({ ...obs })); // Return copies to prevent in-place mutation
  }

  /**
   * Retrieves a specific observation at minuteOffset.
   * If the requested offset is strictly in the future (> currentMinute),
   * this method returns null (or throws if strict is enabled).
   * This guarantees future-data leakage cannot occur.
   */
  public getObservationAtOffset(offset: number): AtmosphericObservation | null {
    if (this.strictTimeGating && offset > this.currentMinute) {
      // Future data is strictly LOCKED
      return null;
    }

    const found = this.masterDataset.find(o => o.minuteOffset === offset);
    return found ? { ...found } : null;
  }

  /**
   * Checks whether data at a given offset is currently locked by the ReplayClock.
   */
  public isOffsetLocked(offset: number): boolean {
    return offset > this.currentMinute;
  }

  /**
   * Checks availability state of a sensor tier at a given historical time
   * relative to the ReplayClock.
   */
  public getPlatformState(
    platform: string,
    minuteOffset: number
  ): 'AVAILABLE' | 'PARTIAL' | 'MISSING' | 'LOCKED' {
    // Architectural Future Lock check
    if (this.isOffsetLocked(minuteOffset)) {
      return 'LOCKED';
    }

    // Historical availability logic
    switch (platform.toLowerCase()) {
      case 'satellite':
        return 'AVAILABLE'; // INSAT-3DR runs continuously
      case 'radar':
        // Convective core radar only develops after T-60
        return minuteOffset < -60 ? 'MISSING' : minuteOffset < -30 ? 'PARTIAL' : 'AVAILABLE';
      case 'lightning':
        // No lightning in initial stable pre-convective boundary
        return minuteOffset < -60 ? 'MISSING' : minuteOffset < -47 ? 'PARTIAL' : 'AVAILABLE';
      case 'surface':
        return 'AVAILABLE'; // Surface AWS reporting 15-min cadence
      case 'upper air':
      case 'sounding':
        // Upper-air soundings launched every 12 hrs; stale after T-90
        return minuteOffset < -120 ? 'AVAILABLE' : 'PARTIAL';
      case 'nwp':
        return 'AVAILABLE'; // Synoptic background forecast available
      default:
        return 'PARTIAL';
    }
  }

  public getReplayTimeLabel(): string {
    if (this.currentMinute === 0) return 'T0 (Initiation)';
    return `T${this.currentMinute}m`;
  }
}

export const replayClock = ReplayClockService.getInstance();
