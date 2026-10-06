import { DayStatusRecord, PenaltyContract, ProofOfWorkResult, SquadPost } from './types';

export class PenaltyStateMachine {
  private status: DayStatusRecord;

  constructor(initialStatus?: Partial<DayStatusRecord>) {
    const defaultContract: PenaltyContract = {
      category: 'PHYSICAL',
      physicalDebtIncrement: 50,
      financialPenaltyAmount: 5,
      socialSquadAlertEnabled: true,
      monthlyFreezeDaysQuota: 2,
      remainingFreezeDays: 2,
    };

    this.status = {
      date: new Date().toISOString().split('T')[0],
      state: 'SCHEDULED',
      currentStreak: 0,
      bestStreak: 0,
      penaltyContract: defaultContract,
      activeBurpeesDebt: 0,
      financialJarTotal: 0,
      socialInfractionsCount: 0,
      ...initialStatus,
    };
  }

  public getStatus(): DayStatusRecord {
    return { ...this.status };
  }

  public updateContract(partialContract: Partial<PenaltyContract>): PenaltyContract {
    this.status.penaltyContract = {
      ...this.status.penaltyContract,
      ...partialContract,
    };
    return this.status.penaltyContract;
  }

  /**
   * Starts a workout session (transitions SCHEDULED -> IN_PROGRESS)
   */
  public startSession(): boolean {
    if (this.status.state === 'SCHEDULED') {
      this.status.state = 'IN_PROGRESS';
      return true;
    }
    return false;
  }

  /**
   * Health Connect Proof of Work verification
   * Requires duration >= 15 min and average BPM >= Target
   */
  public verifySession(proof: ProofOfWorkResult): { success: boolean; message: string } {
    if (this.status.state === 'VERIFIED') {
      return { success: true, message: 'La sessione odierna è già stata certificata.' };
    }

    if (this.status.state === 'FROZEN') {
      return { success: false, message: 'Hai già utilizzato un Freeze Day per questa giornata.' };
    }

    if (!proof.verified) {
      return {
        success: false,
        message: `Proof of Work rifiutata: ${proof.message}`,
      };
    }

    // Success: State becomes VERIFIED and streak increases
    this.status.state = 'VERIFIED';
    this.status.currentStreak += 1;
    if (this.status.currentStreak > this.status.bestStreak) {
      this.status.bestStreak = this.status.currentStreak;
    }

    this.status.verifiedBiometrics = {
      durationMinutes: proof.actualDurationMinutes,
      averageBpm: proof.actualAverageBpm,
      activeCalories: proof.actualCalories,
      timestamp: new Date().toISOString(),
    };

    return {
      success: true,
      message: `Allenamento certificato con successo! Streak aumentata a ${this.status.currentStreak} giorni.`,
    };
  }

  /**
   * Activates a cryogenic Freeze Day (Safeguard clause)
   * Max 2 per month. Keeps streak intact without penalties.
   */
  public activateFreezeDay(): { success: boolean; message: string } {
    if (this.status.state === 'VERIFIED') {
      return { success: false, message: 'Non puoi usare un Freeze Day: la sessione è già certificata!' };
    }

    if (this.status.state === 'FROZEN') {
      return { success: false, message: 'Freeze Day già attivo per la giornata odierna.' };
    }

    if (this.status.penaltyContract.remainingFreezeDays <= 0) {
      return {
        success: false,
        message: 'Jolly Freeze Days esauriti per questo mese (massimo 2 utilizzabili).',
      };
    }

    this.status.state = 'FROZEN';
    this.status.penaltyContract.remainingFreezeDays -= 1;

    return {
      success: true,
      message: `Freeze Day attivato con successo! Streak di ${this.status.currentStreak} giorni preservata. Jolly rimanenti: ${this.status.penaltyContract.remainingFreezeDays}.`,
    };
  }

  /**
   * Activates Injury Mode (Safeguard clause)
   * Freezes penalties and swaps routine with passive stretching/recovery.
   */
  public activateInjuryMode(): { success: boolean; message: string } {
    if (this.status.state === 'VERIFIED') {
      return { success: false, message: 'Sessione già certificata.' };
    }

    this.status.state = 'INJURED';
    return {
      success: true,
      message: 'Injury Mode attivata. La scheda è convertita in mobilità passiva e le penitenze sono congelate.',
    };
  }

  /**
   * 23:59 Deadline Evaluation (Triggered by Android WorkManager DailyDeadlineWorker)
   */
  public evaluateDeadline(): {
    missed: boolean;
    penaltyApplied: boolean;
    penaltyDescription: string;
    squadAlert?: SquadPost;
  } {
    // If verified, frozen, or injured, no penalty is applied
    if (this.status.state === 'VERIFIED' || this.status.state === 'FROZEN' || this.status.state === 'INJURED') {
      return {
        missed: false,
        penaltyApplied: false,
        penaltyDescription: `Stato ${this.status.state}: Nessuna penitenza applicata.`,
      };
    }

    // Workout was SCHEDULED or IN_PROGRESS at 23:59
    this.status.state = 'MISSED';
    const oldStreak = this.status.currentStreak;
    this.status.currentStreak = 0; // Loss Aversion: Streak destroyed

    let penaltyDesc = '';
    let squadAlert: SquadPost | undefined;

    switch (this.status.penaltyContract.category) {
      case 'PHYSICAL': {
        const added = this.status.penaltyContract.physicalDebtIncrement || 50;
        this.status.activeBurpeesDebt += added;
        penaltyDesc = `Streak azzerata (era ${oldStreak}). Penitenza fisica applicata: +${added} Burpees di debito (Totale: ${this.status.activeBurpeesDebt}).`;
        break;
      }
      case 'SOCIAL': {
        this.status.socialInfractionsCount += 1;
        penaltyDesc = `Streak azzerata (era ${oldStreak}). Infrazione sociale pubblicata sullo Squad Wall per mancato impegno.`;
        squadAlert = {
          id: `infraction-${Date.now()}`,
          athleteName: 'Tu (Aura Athlete)',
          athleteAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          timestamp: 'Oggi alle 23:59',
          cluster: 'CLUSTER_A',
          type: 'INFRACTION',
          message: '🚨 PENITENZA SOCIALE: Ha saltato il micro-conditioning giornaliero senza Freeze Day! Streak azzerata a 0.',
          streak: 0,
          penaltyDebt: '+50 Burpees o Vergogna Sociale',
          highFives: 0,
        };
        break;
      }
      case 'FINANCIAL': {
        const amount = this.status.penaltyContract.financialPenaltyAmount || 5;
        this.status.financialJarTotal += amount;
        penaltyDesc = `Streak azzerata (era ${oldStreak}). Penitenza finanziaria: +€${amount} addebitati nel salvadanaio di gruppo (Totale: €${this.status.financialJarTotal}).`;
        break;
      }
    }

    return {
      missed: true,
      penaltyApplied: true,
      penaltyDescription: penaltyDesc,
      squadAlert,
    };
  }

  /**
   * Settle physical burpees debt
   */
  public settleBurpees(count: number): { remainingDebt: number; cleared: boolean } {
    if (count <= 0) return { remainingDebt: this.status.activeBurpeesDebt, cleared: false };
    this.status.activeBurpeesDebt = Math.max(0, this.status.activeBurpeesDebt - count);
    return {
      remainingDebt: this.status.activeBurpeesDebt,
      cleared: this.status.activeBurpeesDebt === 0,
    };
  }

  /**
   * Reset day for simulation or next calendar morning
   */
  public resetNewDay(): void {
    this.status.state = 'SCHEDULED';
    this.status.verifiedBiometrics = undefined;
  }
}
