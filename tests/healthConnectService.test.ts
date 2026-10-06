import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { HealthConnectService } from '../src/services/HealthConnectService';

describe('HealthConnectService - Biometric Proof of Work', () => {
  let service: HealthConnectService;

  beforeEach(() => {
    service = HealthConnectService.getInstance();
    service.stopStreaming();
  });

  afterEach(() => {
    service.stopStreaming();
  });

  it('should initialize with mock mode and permission list', () => {
    const status = service.getStatus();
    expect(status.isAvailable).toBe(true);
    expect(service.getPermissionsList().length).toBeGreaterThan(0);
  });

  it('should reject Proof of Work when duration is under 15 minutes', () => {
    service.startStreaming(() => {});
    // Simulate 10 minutes at high intensity (150 BPM)
    service.fastForwardMinutes(10, 150);

    const result = service.verifyProofOfWork({
      minDurationMinutes: 15,
      minAverageBpm: 130,
    });

    expect(result.verified).toBe(false);
    expect(result.durationMet).toBe(false);
    expect(result.bpmMet).toBe(true);
    expect(result.actualDurationMinutes).toBe(10);
    expect(result.message).toContain('Durata insufficiente');
  });

  it('should reject Proof of Work when average BPM is below cluster target threshold', () => {
    service.startStreaming(() => {});
    // Simulate 20 minutes at low resting intensity (85 BPM)
    service.fastForwardMinutes(20, 85);

    const result = service.verifyProofOfWork({
      minDurationMinutes: 15,
      minAverageBpm: 130, // Cluster A requires >= 130 BPM
    });

    expect(result.verified).toBe(false);
    expect(result.durationMet).toBe(true);
    expect(result.bpmMet).toBe(false);
    expect(result.actualAverageBpm).toBeLessThan(130);
    expect(result.message).toContain('Intensità insufficiente');
  });

  it('should validate Proof of Work when both duration and BPM criteria are met', () => {
    service.startStreaming(() => {});
    // Simulate 25 minutes at 145 BPM
    service.fastForwardMinutes(25, 145);

    const result = service.verifyProofOfWork({
      minDurationMinutes: 15,
      minAverageBpm: 130,
    });

    expect(result.verified).toBe(true);
    expect(result.durationMet).toBe(true);
    expect(result.bpmMet).toBe(true);
    expect(result.actualDurationMinutes).toBe(25);
    expect(result.actualAverageBpm).toBeGreaterThanOrEqual(130);
    expect(result.message).toContain('Convalidata');
  });
});
