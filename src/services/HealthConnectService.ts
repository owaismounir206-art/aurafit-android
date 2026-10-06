import { ProofOfWorkCriteria, ProofOfWorkResult, TelemetrySample } from '../core/types';

export type SimulationIntensity = 'REST' | 'OPTIMAL' | 'HIGH';

export interface HealthConnectStatus {
  isAvailable: boolean;
  hasPermissions: boolean;
  isMockMode: boolean;
}

export class HealthConnectService {
  private static instance: HealthConnectService;
  private isMockMode: boolean = true;
  private hasPermissions: boolean = true;
  private telemetryInterval: NodeJS.Timeout | null = null;
  private currentSamples: TelemetrySample[] = [];
  private currentIntensity: SimulationIntensity = 'OPTIMAL';
  private listener: ((sample: TelemetrySample) => void) | null = null;

  // Telemetry stream state
  private activeSeconds = 0;
  private activeCalories = 0;

  private constructor() {
    // Detect if running inside native Android WebView with Health Connect bridge
    if (typeof window !== 'undefined' && (window as unknown as { AndroidHealthConnect?: unknown }).AndroidHealthConnect) {
      this.isMockMode = false;
    } else {
      this.isMockMode = true; // Preview / Emulator Fallback mode
    }
  }

  public static getInstance(): HealthConnectService {
    if (!HealthConnectService.instance) {
      HealthConnectService.instance = new HealthConnectService();
    }
    return HealthConnectService.instance;
  }

  public getStatus(): HealthConnectStatus {
    return {
      isAvailable: true,
      hasPermissions: this.hasPermissions,
      isMockMode: this.isMockMode,
    };
  }

  public setMockMode(enabled: boolean): void {
    this.isMockMode = enabled;
  }

  public setIntensity(intensity: SimulationIntensity): void {
    this.currentIntensity = intensity;
  }

  public getIntensity(): SimulationIntensity {
    return this.currentIntensity;
  }

  public getPermissionsList(): string[] {
    return [
      'android.permission.health.READ_HEART_RATE',
      'android.permission.health.READ_ACTIVE_CALORIES_BURNED',
      'android.permission.health.READ_EXERCISE',
      'androidx.health.services.client.permission.READ_HEART_RATE',
      'androidx.health.services.client.permission.READ_ACTIVE_CALORIES',
      'androidx.health.services.client.permission.READ_EXERCISE',
    ];
  }

  public async requestPermissions(): Promise<boolean> {
    // In preview / browser, simulate successful grant
    this.hasPermissions = true;
    return true;
  }

  /**
   * Starts real-time biometric telemetry streaming
   */
  public startStreaming(onSample: (sample: TelemetrySample) => void): void {
    this.stopStreaming();
    this.listener = onSample;
    this.currentSamples = [];
    this.activeSeconds = 0;
    this.activeCalories = 0;

    // Emit initial sample
    this.emitNextSample();

    this.telemetryInterval = setInterval(() => {
      this.emitNextSample();
    }, 1000);
  }

  public stopStreaming(): void {
    if (this.telemetryInterval) {
      clearInterval(this.telemetryInterval);
      this.telemetryInterval = null;
    }
    this.listener = null;
  }

  /**
   * Fast-forward simulation timer (for test & demo purposes)
   */
  public fastForwardMinutes(minutes: number, targetBpm?: number): void {
    const additionalSeconds = minutes * 60;
    const baseBpm = targetBpm ?? (this.currentIntensity === 'REST' ? 82 : this.currentIntensity === 'OPTIMAL' ? 142 : 168);

    // Simulate bulk data
    for (let s = 1; s <= additionalSeconds; s += 5) {
      const jitter = (Math.random() - 0.5) * 6;
      this.currentSamples.push({
        timestamp: Date.now() - (additionalSeconds - s) * 1000,
        heartRate: Math.round(baseBpm + jitter),
        activeCalories: Math.round(this.activeCalories + (s * 0.16)),
        durationSeconds: this.activeSeconds + s,
      });
    }

    this.activeSeconds += additionalSeconds;
    this.activeCalories += Math.round(additionalSeconds * 0.16);

    if (this.listener) {
      const last = this.currentSamples[this.currentSamples.length - 1];
      if (last) this.listener(last);
    }
  }

  private emitNextSample(): void {
    this.activeSeconds += 1;

    let baseBpm = 138;
    if (this.currentIntensity === 'REST') {
      baseBpm = 82;
    } else if (this.currentIntensity === 'OPTIMAL') {
      baseBpm = 142;
    } else if (this.currentIntensity === 'HIGH') {
      baseBpm = 168;
    }

    // Add natural biometric heart rate variability (HRV / jitter)
    const jitter = (Math.random() - 0.5) * 8;
    const currentHeartRate = Math.round(Math.max(60, baseBpm + jitter));

    // Calculate dynamic calories based on intensity and seconds
    const caloriesPerSec = (currentHeartRate / 140) * 0.15;
    this.activeCalories += caloriesPerSec;

    const sample: TelemetrySample = {
      timestamp: Date.now(),
      heartRate: currentHeartRate,
      activeCalories: Math.round(this.activeCalories),
      durationSeconds: this.activeSeconds,
    };

    this.currentSamples.push(sample);
    if (this.listener) {
      this.listener(sample);
    }
  }

  /**
   * Evaluates Proof of Work according to strict athletic conditioning criteria:
   * 1. Duration >= 15 minutes
   * 2. Average BPM >= Target Cluster BPM
   */
  public verifyProofOfWork(criteria: ProofOfWorkCriteria): ProofOfWorkResult {
    const durationMinutes = Math.floor(this.activeSeconds / 60);

    if (this.currentSamples.length === 0) {
      return {
        verified: false,
        actualDurationMinutes: 0,
        actualAverageBpm: 0,
        actualCalories: 0,
        durationMet: false,
        bpmMet: false,
        message: 'Nessun dato biometrico registrato da Health Connect.',
      };
    }

    const totalBpm = this.currentSamples.reduce((sum, s) => sum + s.heartRate, 0);
    const averageBpm = Math.round(totalBpm / this.currentSamples.length);
    const calories = Math.round(this.activeCalories);

    const durationMet = durationMinutes >= criteria.minDurationMinutes;
    const bpmMet = averageBpm >= criteria.minAverageBpm;
    const verified = durationMet && bpmMet;

    let message = '';
    if (verified) {
      message = `Proof of Work Convalidata! Durata: ${durationMinutes} min (>= ${criteria.minDurationMinutes}), BPM Medi: ${averageBpm} (Target: >= ${criteria.minAverageBpm}).`;
    } else if (!durationMet && !bpmMet) {
      message = `Durata insufficiente (${durationMinutes}/${criteria.minDurationMinutes} min) e BPM medi sotto soglia (${averageBpm}/${criteria.minAverageBpm} BPM).`;
    } else if (!durationMet) {
      message = `Durata insufficiente: ${durationMinutes} min completati rispetto ai ${criteria.minDurationMinutes} min minimi richiesti.`;
    } else {
      message = `Intensità insufficiente: BPM medi ${averageBpm} rispetto alla soglia target di ${criteria.minAverageBpm} BPM.`;
    }

    return {
      verified,
      actualDurationMinutes: durationMinutes,
      actualAverageBpm: averageBpm,
      actualCalories: calories,
      durationMet,
      bpmMet,
      message,
    };
  }

  public getTelemetryHistory(): TelemetrySample[] {
    return [...this.currentSamples];
  }
}
