import { describe, it, expect } from 'vitest';
import { PenaltyStateMachine } from '../src/core/penaltyStateMachine';
import { ProofOfWorkResult } from '../src/core/types';

describe('PenaltyStateMachine - Daily Lifecycle & Loss Aversion', () => {
  it('should initialize with SCHEDULED state and 0 streak by default', () => {
    const machine = new PenaltyStateMachine();
    const status = machine.getStatus();

    expect(status.state).toBe('SCHEDULED');
    expect(status.currentStreak).toBe(0);
    expect(status.penaltyContract.remainingFreezeDays).toBe(2);
    expect(status.activeBurpeesDebt).toBe(0);
  });

  it('should transition SCHEDULED -> IN_PROGRESS on startSession', () => {
    const machine = new PenaltyStateMachine();
    expect(machine.startSession()).toBe(true);
    expect(machine.getStatus().state).toBe('IN_PROGRESS');
  });

  it('should increment streak when session is verified via Proof of Work', () => {
    const machine = new PenaltyStateMachine({ currentStreak: 5, bestStreak: 5 });
    machine.startSession();

    const validProof: ProofOfWorkResult = {
      verified: true,
      actualDurationMinutes: 22,
      actualAverageBpm: 138,
      actualCalories: 180,
      durationMet: true,
      bpmMet: true,
      message: 'Verified',
    };

    const res = machine.verifySession(validProof);
    expect(res.success).toBe(true);

    const updated = machine.getStatus();
    expect(updated.state).toBe('VERIFIED');
    expect(updated.currentStreak).toBe(6);
    expect(updated.bestStreak).toBe(6);
  });

  it('should zero the streak and accumulate physical debt (Burpees) on 23:59 missed session', () => {
    const machine = new PenaltyStateMachine({
      currentStreak: 12,
      activeBurpeesDebt: 0,
      penaltyContract: {
        category: 'PHYSICAL',
        physicalDebtIncrement: 50,
        financialPenaltyAmount: 5,
        socialSquadAlertEnabled: true,
        monthlyFreezeDaysQuota: 2,
        remainingFreezeDays: 2,
      },
    });

    const result = machine.evaluateDeadline();

    expect(result.missed).toBe(true);
    expect(result.penaltyApplied).toBe(true);

    const status = machine.getStatus();
    expect(status.state).toBe('MISSED');
    expect(status.currentStreak).toBe(0); // Streak destroyed
    expect(status.activeBurpeesDebt).toBe(50); // Debt added
  });

  it('should preserve streak and apply no penalty when Freeze Day is active', () => {
    const machine = new PenaltyStateMachine({ currentStreak: 14 });
    const freezeRes = machine.activateFreezeDay();

    expect(freezeRes.success).toBe(true);
    expect(machine.getStatus().state).toBe('FROZEN');
    expect(machine.getStatus().penaltyContract.remainingFreezeDays).toBe(1);

    // Run 23:59 deadline evaluation
    const deadlineRes = machine.evaluateDeadline();
    expect(deadlineRes.missed).toBe(false);
    expect(deadlineRes.penaltyApplied).toBe(false);

    const status = machine.getStatus();
    expect(status.currentStreak).toBe(14); // Streak preserved!
    expect(status.activeBurpeesDebt).toBe(0);
  });

  it('should deny Freeze Day activation when monthly quota (2 days) is exhausted', () => {
    const machine = new PenaltyStateMachine();
    // Use first freeze day
    expect(machine.activateFreezeDay().success).toBe(true);

    // Simulate next day
    machine.resetNewDay();
    // Use second freeze day
    expect(machine.activateFreezeDay().success).toBe(true);

    // Simulate third day
    machine.resetNewDay();
    // Attempt third freeze day
    const thirdAttempt = machine.activateFreezeDay();
    expect(thirdAttempt.success).toBe(false);
    expect(thirdAttempt.message).toContain('esauriti');
  });

  it('should preserve streak and freeze penalties when Injury Mode is active', () => {
    const machine = new PenaltyStateMachine({ currentStreak: 8 });
    const injuryRes = machine.activateInjuryMode();

    expect(injuryRes.success).toBe(true);
    expect(machine.getStatus().state).toBe('INJURED');

    const deadlineRes = machine.evaluateDeadline();
    expect(deadlineRes.missed).toBe(false);
    expect(deadlineRes.penaltyApplied).toBe(false);
    expect(machine.getStatus().currentStreak).toBe(8);
  });

  it('should generate social infraction alert when contract category is SOCIAL', () => {
    const machine = new PenaltyStateMachine({
      currentStreak: 4,
      penaltyContract: {
        category: 'SOCIAL',
        physicalDebtIncrement: 50,
        financialPenaltyAmount: 5,
        socialSquadAlertEnabled: true,
        monthlyFreezeDaysQuota: 2,
        remainingFreezeDays: 2,
      },
    });

    const evalResult = machine.evaluateDeadline();
    expect(evalResult.missed).toBe(true);
    expect(evalResult.squadAlert).toBeDefined();
    expect(evalResult.squadAlert?.type).toBe('INFRACTION');
    expect(machine.getStatus().socialInfractionsCount).toBe(1);
  });

  it('should allow settling burpees debt incrementally', () => {
    const machine = new PenaltyStateMachine({ activeBurpeesDebt: 100 });
    const settlement1 = machine.settleBurpees(40);
    expect(settlement1.remainingDebt).toBe(60);
    expect(settlement1.cleared).toBe(false);

    const settlement2 = machine.settleBurpees(60);
    expect(settlement2.remainingDebt).toBe(0);
    expect(settlement2.cleared).toBe(true);
  });
});
