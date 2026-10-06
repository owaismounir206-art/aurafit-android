import React from 'react';
import { ClusterId, SportId, DayStatusRecord } from '../core/types';
import { CLUSTERS } from '../core/clusterEngine';
import { ClusterCarousel } from '../components/ClusterCarousel';
import { WorkoutCard } from '../components/WorkoutCard';
import { TelemetryPanel } from '../components/TelemetryPanel';
import { SimulationIntensity } from '../services/HealthConnectService';
import { Snowflake, Bandage, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

interface MissionScreenProps {
  status: DayStatusRecord;
  selectedClusterId: ClusterId;
  selectedSportId: SportId;
  onSelectCluster: (clusterId: ClusterId) => void;
  onSelectSport: (sportId: SportId) => void;
  isStreaming: boolean;
  heartRate: number;
  durationSeconds: number;
  activeCalories: number;
  intensity: SimulationIntensity;
  onChangeIntensity: (intensity: SimulationIntensity) => void;
  onFastForward: (minutes: number) => void;
  onOpenFreezeModal: () => void;
  onOpenInjuryModal: () => void;
  onSimulateDeadline: () => void;
}

export const MissionScreen: React.FC<MissionScreenProps> = ({
  status,
  selectedClusterId,
  selectedSportId,
  onSelectCluster,
  onSelectSport,
  isStreaming,
  heartRate,
  durationSeconds,
  activeCalories,
  intensity,
  onChangeIntensity,
  onFastForward,
  onOpenFreezeModal,
  onOpenInjuryModal,
  onSimulateDeadline,
}) => {
  const currentCluster = CLUSTERS[selectedClusterId];

  const getStatusBadge = () => {
    switch (status.state) {
      case 'VERIFIED':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-m3-full bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>SESSIONE CERTIFICATA HEALTH CONNECT</span>
          </div>
        );
      case 'FROZEN':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-m3-full bg-m3-tertiary-container text-m3-on-tertiary-container font-black text-xs border border-m3-tertiary/30">
            <Snowflake className="w-4 h-4 text-sky-400" />
            <span>FREEZE DAY ATTIVO (STREAK AL SICURO)</span>
          </div>
        );
      case 'INJURED':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-m3-full bg-amber-500/20 text-amber-400 font-black text-xs border border-amber-500/30">
            <Bandage className="w-4 h-4 text-amber-400" />
            <span>MODALITÀ INFORTUNIO ATTIVA</span>
          </div>
        );
      case 'MISSED':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-m3-full bg-m3-error-container text-m3-on-error-container font-black text-xs border border-m3-error/30">
            <AlertOctagon className="w-4 h-4 text-m3-error" />
            <span>SESSIONE SCADUTA — PENITENZA ATTIVA</span>
          </div>
        );
      case 'IN_PROGRESS':
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container font-black text-xs border border-m3-primary/30">
            <span className="w-2.5 h-2.5 rounded-full bg-m3-primary animate-ping" />
            <span>STREAMING TELEMETRICO IN CORSO</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-m3-full bg-m3-surface-container-high text-m3-on-surface font-black text-xs border border-m3-outline-variant/40">
            <Clock className="w-4 h-4 text-m3-primary" />
            <span>IN ATTESA DI VERIFICA (DEADLINE 23:59)</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Daily State Pill */}
      <div className="flex items-center justify-between">
        {getStatusBadge()}

        {/* Quick Safeguard Actions */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onOpenFreezeModal}
            title="Freeze Day"
            className="p-1.5 rounded-m3-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-sky-400 m3-ripple border border-m3-outline-variant/30"
          >
            <Snowflake className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenInjuryModal}
            title="Injury Mode"
            className="p-1.5 rounded-m3-full bg-m3-surface-container-high hover:bg-m3-surface-container-highest text-amber-400 m3-ripple border border-m3-outline-variant/30"
          >
            <Bandage className="w-4 h-4" />
          </button>
          <button
            onClick={onSimulateDeadline}
            title="Simula 23:59 Deadline"
            className="px-2 py-1 rounded-m3-md bg-m3-error-container/30 hover:bg-m3-error-container text-m3-error font-mono text-[10px] font-black border border-m3-error/30 m3-ripple"
          >
            23:59
          </button>
        </div>
      </div>

      {/* Biomechanical Cluster Selector */}
      <ClusterCarousel
        selectedClusterId={selectedClusterId}
        selectedSportId={selectedSportId}
        onSelectCluster={onSelectCluster}
        onSelectSport={onSelectSport}
      />

      {/* Live Wearable Telemetry HUD (Health Connect) */}
      <TelemetryPanel
        isStreaming={isStreaming}
        heartRate={heartRate}
        targetBpm={currentCluster.minBpmTarget}
        durationSeconds={durationSeconds}
        activeCalories={activeCalories}
        intensity={intensity}
        onChangeIntensity={onChangeIntensity}
        onFastForward={onFastForward}
      />

      {/* Workout Routine Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-base font-black text-m3-on-surface">
            Micro-Conditioning Odierno
          </h3>
          <p className="text-xs text-m3-outline font-medium">
            20-30 min mirati alla longevità atletica
          </p>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-m3-full bg-m3-surface-container text-m3-on-surface-variant">
          {currentCluster.sampleRoutine.length} esercizi
        </span>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-2.5">
        {currentCluster.sampleRoutine.map((exercise, idx) => (
          <WorkoutCard
            key={exercise.id}
            exercise={exercise}
            index={idx}
            isActive={isStreaming && idx === 0}
          />
        ))}
      </div>
    </div>
  );
};
