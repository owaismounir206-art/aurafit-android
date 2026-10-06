import { PenaltyStateMachine } from '../core/penaltyStateMachine';

/**
 * DailyDeadlineWorker (Web/Preview & Simulation equivalent of Android WorkManager CoroutineWorker)
 * Scheduled periodically to verify workout completion before 23:59:00.
 */
export class DailyDeadlineWorker {
  public static execute(machine: PenaltyStateMachine) {
    const status = machine.getStatus();
    const result = machine.evaluateDeadline();

    if (result.missed && result.penaltyApplied) {
      // Dispatches simulated Android Notification (CHANNEL_PENALTY_ALERT)
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification('AuraFit: Scadenza 23:59 Eseguita', {
          body: result.penaltyDescription,
          icon: '/favicon.ico',
        });
      }
    }

    return {
      statusBefore: status.state,
      evaluation: result,
    };
  }
}
