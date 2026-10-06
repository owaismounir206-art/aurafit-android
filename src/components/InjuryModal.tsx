import React from 'react';
import { Bandage, Shield, HeartPulse, X } from 'lucide-react';

interface InjuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isInjured: boolean;
}

export const InjuryModal: React.FC<InjuryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isInjured,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-m3-xl bg-m3-surface-container-high border border-m3-outline-variant/40 shadow-m3-4 p-5 space-y-4">
        {/* Header Icon & Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-m3-full bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-sm">
              <Bandage className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-m3-on-surface">Modalità Infortunio</h3>
              <span className="text-[11px] font-semibold text-m3-outline">Protocollo di Recupero e Tutela</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-m3-full text-m3-outline hover:text-m3-on-surface hover:bg-m3-surface-container-highest transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Benefits list */}
        <div className="p-3.5 rounded-m3-lg bg-m3-surface-container border border-m3-outline-variant/30 space-y-2 text-xs">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-m3-on-surface font-medium">
              <strong>Penitenze Congelate:</strong> Nessuna sanzione fisica o finanziaria applicata alle 23:59.
            </span>
          </div>

          <div className="flex items-start space-x-2">
            <HeartPulse className="w-4 h-4 text-m3-primary flex-shrink-0 mt-0.5" />
            <span className="text-m3-on-surface font-medium">
              <strong>Scheda Rigenerativa:</strong> Il conditioning ad alto impatto viene convertito in decompressione passiva e mobilità articolare a bassa intensità.
            </span>
          </div>
        </div>

        <p className="text-xs text-m3-on-surface-variant leading-relaxed">
          {isInjured
            ? 'La modalità infortunio è attualmente attiva. Desideri disattivarla e tornare alla programmazione atletica ordinaria?'
            : 'Se hai subito un trauma muscolare o articolare, attiva questa modalità per curare il tuo corpo senza compromettere lo storico della tua streak.'}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-m3-full text-xs font-bold text-m3-on-surface-variant hover:bg-m3-surface-container-highest transition-colors m3-ripple"
          >
            Chiudi
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-m3-full text-xs font-black transition-all m3-ripple ${
              isInjured
                ? 'bg-m3-primary text-m3-on-primary'
                : 'bg-amber-600 text-white shadow-m3-2 hover:bg-amber-700'
            }`}
          >
            {isInjured ? 'Disattiva Infortunio' : 'Conferma Infortunio 🩹'}
          </button>
        </div>
      </div>
    </div>
  );
};
