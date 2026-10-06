import React from 'react';
import { DayStatusRecord, ClusterId } from '../core/types';
import { CLUSTERS } from '../core/clusterEngine';
import { Snowflake, Bandage, Activity, Award, CheckCircle } from 'lucide-react';

interface ProfileScreenProps {
  status: DayStatusRecord;
  selectedClusterId: ClusterId;
  onOpenFreezeModal: () => void;
  onOpenInjuryModal: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  status,
  selectedClusterId,
  onOpenFreezeModal,
  onOpenInjuryModal,
}) => {
  const currentCluster = CLUSTERS[selectedClusterId];

  return (
    <div className="space-y-4 pb-28">
      {/* Athlete Profile Header Card */}
      <div className="p-4 rounded-m3-xl bg-m3-surface-container-high border border-m3-outline-variant/40 flex items-center space-x-3.5 shadow-m3-1">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            alt="Profile Avatar"
            className="w-16 h-16 rounded-m3-xl object-cover border-2 border-m3-primary"
          />
          <span className="absolute -bottom-1 -right-1 p-1 rounded-m3-full bg-m3-primary text-m3-on-primary text-[10px]">
            ⚡
          </span>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-black text-m3-on-surface">Alex Rossi</h3>
            <span className="px-2 py-0.2 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container text-[10px] font-black">
              PRO
            </span>
          </div>
          <p className="text-xs text-m3-outline font-semibold">
            Atleta Ibrido • {currentCluster.name}
          </p>
          <div className="flex items-center space-x-2 text-xs font-bold text-m3-primary pt-0.5">
            <Award className="w-3.5 h-3.5" />
            <span>Best Streak: {status.bestStreak} Giorni</span>
          </div>
        </div>
      </div>

      {/* Safeguards / Jolly Status Section */}
      <div className="p-4 rounded-m3-xl bg-m3-surface-container-low border border-m3-outline-variant/40 space-y-3">
        <h4 className="text-sm font-black text-m3-on-surface">
          Clausole di Salvaguardia Mensile
        </h4>

        {/* Freeze Day Card */}
        <div className="p-3 rounded-m3-lg bg-m3-surface-container flex items-center justify-between border border-m3-outline-variant/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-m3-full bg-m3-tertiary-container flex items-center justify-center text-m3-on-tertiary-container">
              <Snowflake className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-m3-on-surface">Freeze Days Criogenici</h5>
              <span className="text-[11px] text-m3-outline font-medium">
                {status.penaltyContract.remainingFreezeDays} di 2 jolly rimanenti questo mese
              </span>
            </div>
          </div>

          <button
            onClick={onOpenFreezeModal}
            className="px-3 py-1.5 rounded-m3-full bg-m3-tertiary text-m3-on-tertiary text-xs font-bold m3-ripple shadow-sm"
          >
            Gestisci
          </button>
        </div>

        {/* Injury Mode Card */}
        <div className="p-3 rounded-m3-lg bg-m3-surface-container flex items-center justify-between border border-m3-outline-variant/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-m3-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Bandage className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-m3-on-surface">Modalità Infortunio</h5>
              <span className="text-[11px] text-m3-outline font-medium">
                {status.state === 'INJURED' ? 'Attiva (Penitenze congelate)' : 'Disattiva (Programma pieno)'}
              </span>
            </div>
          </div>

          <button
            onClick={onOpenInjuryModal}
            className="px-3 py-1.5 rounded-m3-full bg-amber-600 text-white text-xs font-bold m3-ripple shadow-sm"
          >
            {status.state === 'INJURED' ? 'Modifica' : 'Segnala'}
          </button>
        </div>
      </div>

      {/* Biomechanical Cluster Card */}
      <div className="p-4 rounded-m3-xl bg-m3-surface-container-high border border-m3-outline-variant/40 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-m3-on-surface">Cluster Biomeccanico</h4>
          <span className="px-2 py-0.5 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container text-xs font-bold">
            {currentCluster.name}
          </span>
        </div>
        <p className="text-xs text-m3-on-surface-variant leading-relaxed">
          {currentCluster.description}
        </p>

        <div className="pt-2 border-t border-m3-outline-variant/30 space-y-1.5">
          <span className="text-[11px] font-bold text-m3-outline uppercase tracking-wider block">
            Pilastri di Prevenzione:
          </span>
          {currentCluster.biomechanicalPillars.map((p, i) => (
            <div key={i} className="flex items-center space-x-2 text-xs text-m3-on-surface font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-m3-primary flex-shrink-0" />
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Android & Google Health Connect Info */}
      <div className="p-4 rounded-m3-xl bg-m3-surface-container-low border border-m3-outline-variant/40 space-y-2 text-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-m3-primary uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Specifiche Tecniche Android</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="p-2 rounded-m3-md bg-m3-surface-container">
            <span className="text-m3-outline block">SDK Target</span>
            <span className="font-bold text-m3-on-surface">Android 14 (API 34)</span>
          </div>
          <div className="p-2 rounded-m3-md bg-m3-surface-container">
            <span className="text-m3-outline block">SDK Minimo</span>
            <span className="font-bold text-m3-on-surface">Android 8.0 (API 26)</span>
          </div>
          <div className="p-2 rounded-m3-md bg-m3-surface-container">
            <span className="text-m3-outline block">Health Connect</span>
            <span className="font-bold text-emerald-500">v1.1.0-alpha10 (Attivo)</span>
          </div>
          <div className="p-2 rounded-m3-md bg-m3-surface-container">
            <span className="text-m3-outline block">WorkManager</span>
            <span className="font-bold text-m3-primary">23:59 Daily Deadline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
