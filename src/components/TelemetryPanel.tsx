import React from 'react';
import { Heart, Flame, Timer, Activity, FastForward, CheckCircle2, XCircle } from 'lucide-react';
import { SimulationIntensity } from '../services/HealthConnectService';

interface TelemetryPanelProps {
  isStreaming: boolean;
  heartRate: number;
  targetBpm: number;
  durationSeconds: number;
  activeCalories: number;
  intensity: SimulationIntensity;
  onChangeIntensity: (intensity: SimulationIntensity) => void;
  onFastForward: (minutes: number) => void;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({
  isStreaming,
  heartRate,
  targetBpm,
  durationSeconds,
  activeCalories,
  intensity,
  onChangeIntensity,
  onFastForward,
}) => {
  const durationMinutes = Math.floor(durationSeconds / 60);
  const remainingSecs = durationSeconds % 60;
  const formattedTime = `${String(durationMinutes).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

  const isBpmValid = heartRate >= targetBpm;
  const isDurationValid = durationMinutes >= 15;
  const progressPercent = Math.min(100, Math.round((durationMinutes / 15) * 100));

  return (
    <div className="w-full rounded-m3-xl bg-m3-surface-container-high border border-m3-outline-variant/40 p-4 shadow-m3-2 space-y-4">
      {/* Top Header: Telemetry Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            {isStreaming ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-m3-outline"></span>
            )}
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-m3-on-surface">
            {isStreaming ? 'Google Health Connect Live' : 'Telemetria in Standby'}
          </span>
        </div>

        {/* Target BPM Chip */}
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container">
          Target: &gt;={targetBpm} BPM
        </span>
      </div>

      {/* Main 3 Biometric Tiles */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        {/* Heart Rate Tile */}
        <div
          className={`p-3 rounded-m3-lg transition-colors ${
            isBpmValid
              ? 'bg-emerald-500/10 border border-emerald-500/30'
              : 'bg-m3-surface-container-low border border-m3-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-center space-x-1 text-xs text-m3-outline font-semibold mb-1">
            <Heart className={`w-3.5 h-3.5 text-rose-500 ${isStreaming ? 'animate-heartbeat' : ''}`} />
            <span>Frequenza</span>
          </div>
          <div className="text-2xl font-black tracking-tight text-m3-on-surface">
            {isStreaming ? heartRate : '--'}
          </div>
          <div className="text-[10px] font-bold mt-0.5">
            {isStreaming ? (
              isBpmValid ? (
                <span className="text-emerald-500">Zona Target OK</span>
              ) : (
                <span className="text-amber-500">Sotto Soglia</span>
              )
            ) : (
              <span className="text-m3-outline">BPM</span>
            )}
          </div>
        </div>

        {/* Duration Timer Tile */}
        <div
          className={`p-3 rounded-m3-lg transition-colors ${
            isDurationValid
              ? 'bg-emerald-500/10 border border-emerald-500/30'
              : 'bg-m3-surface-container-low border border-m3-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-center space-x-1 text-xs text-m3-outline font-semibold mb-1">
            <Timer className="w-3.5 h-3.5 text-m3-primary" />
            <span>Durata</span>
          </div>
          <div className="text-2xl font-black tracking-tight text-m3-on-surface font-mono">
            {formattedTime}
          </div>
          <div className="text-[10px] font-bold mt-0.5">
            {isDurationValid ? (
              <span className="text-emerald-500">&gt;= 15 min OK</span>
            ) : (
              <span className="text-m3-outline">min. 15:00</span>
            )}
          </div>
        </div>

        {/* Calories Tile */}
        <div className="p-3 rounded-m3-lg bg-m3-surface-container-low border border-m3-outline-variant/30">
          <div className="flex items-center justify-center space-x-1 text-xs text-m3-outline font-semibold mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Calorie</span>
          </div>
          <div className="text-2xl font-black tracking-tight text-m3-on-surface">
            {activeCalories}
          </div>
          <div className="text-[10px] font-bold text-m3-outline mt-0.5">kcal attive</div>
        </div>
      </div>

      {/* Proof of Work Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-m3-outline">
          <span>Requisito Proof of Work (Min. 15 min in zona)</span>
          <span className="font-mono text-m3-on-surface">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-m3-full bg-m3-surface-container-lowest overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isDurationValid && isBpmValid ? 'bg-emerald-500' : 'bg-m3-primary'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Proof of Work Checklist Pills */}
      <div className="flex items-center justify-between pt-1 border-t border-m3-outline-variant/30 text-xs">
        <div className="flex items-center space-x-1.5">
          {isDurationValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-m3-outline" />
          )}
          <span className={isDurationValid ? 'font-bold text-emerald-500' : 'text-m3-outline'}>
            Durata &gt;= 15 min ({durationMinutes}/15)
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {isBpmValid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <XCircle className="w-4 h-4 text-m3-outline" />
          )}
          <span className={isBpmValid ? 'font-bold text-emerald-500' : 'text-m3-outline'}>
            BPM &gt;= {targetBpm} ({isStreaming ? heartRate : 0})
          </span>
        </div>
      </div>

      {/* Wearable Simulation & Debug Toolbar */}
      <div className="p-2.5 rounded-m3-lg bg-m3-surface-container-low border border-m3-outline-variant/30 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-m3-outline uppercase tracking-wider">
          <span className="flex items-center space-x-1">
            <Activity className="w-3 h-3 text-m3-primary" />
            <span>Sensore Wearable (Mock Telemetria)</span>
          </span>
          <span className="text-[10px] text-m3-primary lowercase font-mono">live-mock</span>
        </div>

        {/* Intensity Presets */}
        <div className="flex items-center space-x-1.5">
          {(
            [
              { id: 'REST', label: 'Riposo (85 BPM)' },
              { id: 'OPTIMAL', label: 'Cluster (142 BPM)' },
              { id: 'HIGH', label: 'Sprint (168 BPM)' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeIntensity(item.id)}
              className={`flex-1 py-1.5 px-1 rounded-m3-md text-[10px] font-bold transition-all m3-ripple ${
                intensity === item.id
                  ? 'bg-m3-primary text-m3-on-primary shadow-sm'
                  : 'bg-m3-surface-container text-m3-on-surface-variant hover:bg-m3-surface-container-high'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Fast-Forward Simulation Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-m3-outline font-medium">Test rapido convalida:</span>
          <button
            onClick={() => onFastForward(15)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-m3-md bg-m3-secondary-container text-m3-on-secondary-container text-[11px] font-bold hover:bg-m3-secondary/20 transition-all m3-ripple"
          >
            <FastForward className="w-3 h-3" />
            <span>Simula +15 min</span>
          </button>
        </div>
      </div>
    </div>
  );
};
