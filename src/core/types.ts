/**
 * AuraFit - Domain Types
 * Biomechanical Multi-Sport Clusters, Loss Aversion & Biometrics
 */

export type ClusterId = 'CLUSTER_A' | 'CLUSTER_B' | 'CLUSTER_C' | 'CLUSTER_D';

export type SportId =
  // Cluster A - Situazionali & Squadra
  | 'soccer'
  | 'basketball'
  | 'padel'
  | 'volleyball'
  // Cluster B - Forza & Skill
  | 'gym'
  | 'calisthenics'
  | 'powerlifting'
  // Cluster C - Endurance & Ciclici
  | 'running'
  | 'cycling'
  | 'swimming'
  // Cluster D - Combat & Reattività
  | 'boxing'
  | 'mma'
  | 'bjj';

export interface BiomechanicalExercise {
  id: string;
  name: string;
  durationSeconds: number;
  sets?: number;
  reps?: string;
  biomechanicalFocus: string; // e.g. "Prevenzione LCA & Decelerazione Eccentrica"
  targetJoints: string[];
  injuryPreventionTarget: string; // e.g. "Legamento Crociato Anteriore (LCA), Pubalgia"
  instructions: string;
}

export interface BiomechanicalCluster {
  id: ClusterId;
  name: string;
  tagline: string;
  colorToken: string; // CSS variable or M3 dynamic color key
  minBpmTarget: number; // Target average BPM required for Proof of Work
  sports: SportId[];
  biomechanicalPillars: string[];
  description: string;
  sampleRoutine: BiomechanicalExercise[];
}

export type DayState =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'VERIFIED'
  | 'FROZEN'
  | 'INJURED'
  | 'MISSED';

export type PenaltyCategory = 'PHYSICAL' | 'SOCIAL' | 'FINANCIAL';

export interface PenaltyContract {
  category: PenaltyCategory;
  physicalDebtIncrement: number; // Burpees: 50, 100, or 150
  financialPenaltyAmount: number; // €2, €5, or €10
  socialSquadAlertEnabled: boolean;
  monthlyFreezeDaysQuota: number; // Max 2 per calendar month
  remainingFreezeDays: number;
}

export interface DayStatusRecord {
  date: string; // YYYY-MM-DD
  state: DayState;
  currentStreak: number;
  bestStreak: number;
  penaltyContract: PenaltyContract;
  activeBurpeesDebt: number;
  financialJarTotal: number;
  socialInfractionsCount: number;
  verifiedBiometrics?: {
    durationMinutes: number;
    averageBpm: number;
    activeCalories: number;
    timestamp: string;
  };
}

export interface TelemetrySample {
  timestamp: number;
  heartRate: number;
  activeCalories: number;
  durationSeconds: number;
}

export interface ProofOfWorkCriteria {
  minDurationMinutes: number; // >= 15 min
  minAverageBpm: number;      // >= Target Cluster
}

export interface ProofOfWorkResult {
  verified: boolean;
  actualDurationMinutes: number;
  actualAverageBpm: number;
  actualCalories: number;
  durationMet: boolean;
  bpmMet: boolean;
  message: string;
}

export interface SquadPost {
  id: string;
  athleteName: string;
  athleteAvatar: string;
  timestamp: string;
  cluster: ClusterId;
  type: 'VERIFICATION' | 'INFRACTION' | 'FREEZE' | 'DEBT_SETTLED';
  message: string;
  streak: number;
  proofBadge?: string;
  penaltyDebt?: string;
  highFives: number;
  hasHighFived?: boolean;
}
