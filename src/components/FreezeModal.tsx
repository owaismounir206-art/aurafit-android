import React from 'react';
import { Snowflake, AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface FreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  remainingFreezeDays: number;
  currentStreak: number;
}

export const FreezeModal: React.FC<FreezeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  remainingFreezeDays,
  currentStreak,
}) => {
  if (!isOpen) return null;

  const canFreeze = remainingFreezeDays > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-m3-xl bg-m3-surface-container-high border border-m3-outline-variant/40 shadow-m3-4 p-5 space-y-4">
        {/* Header Icon & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-m3-full bg-m3-tertiary-container flex items-center justify-center text-m3-on-tertiary-container shadow-sm">
              <Snowflake className="w-5 h-5 text-sky-400 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-black text-m3-on-surface">Freeze Day Criogenico</h3>
              <span className="text-[11px] font-semibold text-m3-outline">Clausola di Salvaguardia M3</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-m3-full text-m3-outline hover:text-m3-on-surface hover:bg-m3-surface-container-highest transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Callout */}
        <div className="p-3.5 rounded-m3-lg bg-m3-surface-container border border-m3-outline-variant/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-m3-outline">Jolly mensili rimanenti:</span>
            <span className="px-2 py-0.5 rounded-m3-full bg-m3-tertiary-container text-m3-on-tertiary-container font-black">
              {remainingFreezeDays} / 2 rimasti
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs text-m3-on-surface">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Preserva la tua streak attiva di <strong>{currentStreak} giorni</strong> senza azzerarla.</span>
          </div>
        </div>

        {/* Warning if no days left */}
        {!canFreeze ? (
          <div className="p-3 rounded-m3-md bg-m3-error-container/30 border border-m3-error/40 flex items-start space-x-2 text-xs text-m3-on-error-container">
            <AlertTriangle className="w-4 h-4 text-m3-error flex-shrink-0 mt-0.5" />
            <p>
              Hai già esaurito i tuoi 2 Freeze Days per questo mese solare. Se salti la sessione odierna entro le 23:59, si attiverà il protocollo di Loss Aversion.
            </p>
          </div>
        ) : (
          <p className="text-xs text-m3-on-surface-variant leading-relaxed">
            Attivando il Freeze Day oggi, l&apos;algoritmo congela il daily deadline worker delle 23:59. Non riceverai penitenze n&eacute; debiti fisici, e la streak rimarr&agrave; al sicuro.
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-m3-full text-xs font-bold text-m3-on-surface-variant hover:bg-m3-surface-container-highest transition-colors m3-ripple"
          >
            Annulla
          </button>
          <button
            disabled={!canFreeze}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-m3-full text-xs font-black transition-all m3-ripple ${
              canFreeze
                ? 'bg-m3-tertiary text-m3-on-tertiary shadow-m3-2 hover:shadow-m3-3'
                : 'bg-m3-outline/20 text-m3-outline cursor-not-allowed'
            }`}
          >
            Attiva Freeze Day ❄️
          </button>
        </div>
      </div>
    </div>
  );
};
