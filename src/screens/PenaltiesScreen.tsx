import React, { useState } from 'react';
import { DayStatusRecord, PenaltyCategory } from '../core/types';
import { ShieldAlert, Dumbbell, Users, Coins, CheckCircle, AlertTriangle, Play, Sparkles } from 'lucide-react';

interface PenaltiesScreenProps {
  status: DayStatusRecord;
  onUpdateContractCategory: (category: PenaltyCategory) => void;
  onSettleBurpees: (count: number) => void;
  onTriggerDeadlineTest: () => void;
}

export const PenaltiesScreen: React.FC<PenaltiesScreenProps> = ({
  status,
  onUpdateContractCategory,
  onSettleBurpees,
  onTriggerDeadlineTest,
}) => {
  const [burpeesInput, setBurpeesInput] = useState<number>(25);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const contract = status.penaltyContract;

  const handleSettle = () => {
    if (burpeesInput <= 0) return;
    onSettleBurpees(burpeesInput);
    setToastMessage(`Registrati ${burpeesInput} Burpees completati!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Header Banner */}
      <div className="p-4 rounded-m3-xl bg-m3-error-container/20 border border-m3-error/30 space-y-2">
        <div className="flex items-center space-x-2 text-m3-error font-black text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>Loss Aversion & Patto d&apos;Impegno</span>
        </div>
        <p className="text-xs text-m3-on-surface-variant leading-relaxed">
          Il 70% degli atleti abbandona nei primi 90 giorni. AuraFit sostituisce la debole motivazione con la forza della perdita: ogni giorno non certificato entro le 23:59 comporta una conseguenza immediata.
        </p>
      </div>

      {/* Active Debt Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Physical Debt: Burpees */}
        <div className="p-4 rounded-m3-lg bg-m3-surface-container-high border border-m3-outline-variant/40 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-m3-outline font-bold">
            <Dumbbell className="w-4 h-4 text-m3-primary" />
            <span>Debito Burpees</span>
          </div>
          <div className="text-3xl font-black text-m3-on-surface">
            {status.activeBurpeesDebt}
          </div>
          <span className="text-[11px] font-semibold text-m3-error block">
            {status.activeBurpeesDebt > 0 ? 'Da completare' : 'Nessun debito pendente'}
          </span>
        </div>

        {/* Financial Debt: Group Jar */}
        <div className="p-4 rounded-m3-lg bg-m3-surface-container-high border border-m3-outline-variant/40 space-y-1">
          <div className="flex items-center space-x-1.5 text-xs text-m3-outline font-bold">
            <Coins className="w-4 h-4 text-amber-500" />
            <span>Salvadanaio Penali</span>
          </div>
          <div className="text-3xl font-black text-m3-on-surface">
            €{status.financialJarTotal}
          </div>
          <span className="text-[11px] font-semibold text-m3-outline block">
            Destinato alla squadra
          </span>
        </div>
      </div>

      {/* Interactive Burpees Settlement Card */}
      {status.activeBurpeesDebt > 0 && (
        <div className="p-4 rounded-m3-xl bg-m3-surface-container-high border border-m3-primary/30 space-y-3 shadow-m3-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-m3-primary" />
              <h4 className="text-sm font-black text-m3-on-surface">Estingui Debito Fisico</h4>
            </div>
            <span className="text-xs font-mono font-bold text-m3-primary">
              Rimangono: {status.activeBurpeesDebt}
            </span>
          </div>

          <p className="text-xs text-m3-on-surface-variant">
            Esegui i burpees in qualsiasi momento per ripulire la tua fedina atletica:
          </p>

          <div className="flex items-center space-x-2">
            {[10, 25, 50].map((count) => (
              <button
                key={count}
                onClick={() => setBurpeesInput(count)}
                className={`flex-1 py-1.5 rounded-m3-md text-xs font-bold transition-all m3-ripple ${
                  burpeesInput === count
                    ? 'bg-m3-primary text-m3-on-primary'
                    : 'bg-m3-surface-container text-m3-on-surface hover:bg-m3-surface-container-highest'
                }`}
              >
                +{count}
              </button>
            ))}
          </div>

          <button
            onClick={handleSettle}
            className="w-full py-2.5 rounded-m3-md bg-m3-primary text-m3-on-primary font-bold text-xs flex items-center justify-center space-x-2 shadow-sm m3-ripple"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Conferma Esecuzione ({burpeesInput} Burpees)</span>
          </button>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-m3-md bg-emerald-500 text-white font-bold text-xs text-center animate-fade-in shadow-m3-2">
          {toastMessage}
        </div>
      )}

      {/* Contract Settings Section */}
      <div className="p-4 rounded-m3-xl bg-m3-surface-container-low border border-m3-outline-variant/40 space-y-3">
        <h4 className="text-sm font-black text-m3-on-surface">
          Configurazione Patto di Impegno Attivo
        </h4>
        <p className="text-xs text-m3-outline">
          Scegli la conseguenza da applicare se salti una sessione senza un Freeze Day:
        </p>

        <div className="space-y-2">
          {/* Physical Contract Option */}
          <button
            onClick={() => onUpdateContractCategory('PHYSICAL')}
            className={`w-full p-3 rounded-m3-lg text-left transition-all m3-ripple border ${
              contract.category === 'PHYSICAL'
                ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary font-bold shadow-sm'
                : 'bg-m3-surface-container text-m3-on-surface border-transparent hover:border-m3-outline-variant'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-bold">
                <Dumbbell className="w-4 h-4" />
                <span>Penitenza Fisica (+50 Burpees)</span>
              </span>
              {contract.category === 'PHYSICAL' && <span className="text-xs font-black">ATTIVO ✓</span>}
            </div>
            <p className="text-[11px] opacity-80 mt-1">
              Accumulo automatico di debito motorio da scontare prima della prossima settimana.
            </p>
          </button>

          {/* Social Contract Option */}
          <button
            onClick={() => onUpdateContractCategory('SOCIAL')}
            className={`w-full p-3 rounded-m3-lg text-left transition-all m3-ripple border ${
              contract.category === 'SOCIAL'
                ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary font-bold shadow-sm'
                : 'bg-m3-surface-container text-m3-on-surface border-transparent hover:border-m3-outline-variant'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>Penitenza Sociale (Squad Wall)</span>
              </span>
              {contract.category === 'SOCIAL' && <span className="text-xs font-black">ATTIVO ✓</span>}
            </div>
            <p className="text-[11px] opacity-80 mt-1">
              Pubblicazione automatica dell&apos;infrazione sulla bacheca pubblica con badge di inadempienza.
            </p>
          </button>

          {/* Financial Contract Option */}
          <button
            onClick={() => onUpdateContractCategory('FINANCIAL')}
            className={`w-full p-3 rounded-m3-lg text-left transition-all m3-ripple border ${
              contract.category === 'FINANCIAL'
                ? 'bg-m3-primary-container text-m3-on-primary-container border-m3-primary font-bold shadow-sm'
                : 'bg-m3-surface-container text-m3-on-surface border-transparent hover:border-m3-outline-variant'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-2 text-xs font-bold">
                <Coins className="w-4 h-4" />
                <span>Penitenza Finanziaria (€5 Salvadanaio)</span>
              </span>
              {contract.category === 'FINANCIAL' && <span className="text-xs font-black">ATTIVO ✓</span>}
            </div>
            <p className="text-[11px] opacity-80 mt-1">
              Addebito simbolico devoluto al fondo cassa della squadra o pizza comune.
            </p>
          </button>
        </div>
      </div>

      {/* WorkManager Simulation Trigger */}
      <div className="p-4 rounded-m3-xl bg-m3-surface-container-high border border-m3-outline-variant/40 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-m3-outline uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Simulazione Android WorkManager</span>
        </div>
        <p className="text-xs text-m3-on-surface-variant">
          Esegui istantaneamente il worker schedulato alle ore 23:59:00 per testare il meccanismo di azzeramento streak e applicazione sanzione.
        </p>
        <button
          onClick={onTriggerDeadlineTest}
          className="w-full py-2.5 rounded-m3-md bg-m3-error text-m3-on-error font-black text-xs flex items-center justify-center space-x-2 shadow-m3-2 hover:bg-m3-error/90 m3-ripple"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Forza Scadenza Ore 23:59 (Test DailyDeadlineWorker)</span>
        </button>
      </div>
    </div>
  );
};
