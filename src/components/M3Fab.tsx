import React from 'react';
import { Play, CheckCircle2, Square, ShieldCheck } from 'lucide-react';

interface M3FabProps {
  isStreaming: boolean;
  canVerify: boolean;
  isVerified: boolean;
  onStartSession: () => void;
  onStopSession: () => void;
  onVerifyProof: () => void;
}

export const M3Fab: React.FC<M3FabProps> = ({
  isStreaming,
  canVerify,
  isVerified,
  onStartSession,
  onStopSession,
  onVerifyProof,
}) => {
  if (isVerified) {
    return (
      <div className="fixed bottom-20 right-4 z-30">
        <div className="flex items-center space-x-2 px-4 py-3 rounded-m3-xl bg-m3-primary-container text-m3-on-primary-container shadow-m3-3 border border-m3-primary/30">
          <ShieldCheck className="w-5 h-5 text-m3-primary" />
          <span className="text-xs font-bold tracking-tight">Sessione Certificata ✓</span>
        </div>
      </div>
    );
  }

  if (canVerify) {
    return (
      <button
        onClick={onVerifyProof}
        className="fixed bottom-20 right-4 z-30 flex items-center space-x-2.5 px-5 py-3.5 rounded-m3-xl bg-m3-primary text-m3-on-primary shadow-m3-4 hover:shadow-m3-5 m3-ripple transition-all duration-200"
      >
        <CheckCircle2 className="w-5 h-5 text-m3-on-primary animate-bounce" />
        <span className="text-sm font-black tracking-tight">Certifica Proof of Work</span>
      </button>
    );
  }

  if (isStreaming) {
    return (
      <button
        onClick={onStopSession}
        className="fixed bottom-20 right-4 z-30 flex items-center space-x-2.5 px-5 py-3.5 rounded-m3-xl bg-m3-error-container text-m3-on-error-container shadow-m3-3 hover:shadow-m3-4 m3-ripple transition-all duration-200"
      >
        <Square className="w-4 h-4 fill-current" />
        <span className="text-sm font-bold tracking-tight">Pausa Telemetria</span>
      </button>
    );
  }

  return (
    <button
      onClick={onStartSession}
      className="fixed bottom-20 right-4 z-30 flex items-center space-x-2.5 px-5 py-3.5 rounded-m3-xl bg-m3-primary text-m3-on-primary shadow-m3-3 hover:shadow-m3-4 m3-ripple transition-all duration-200"
    >
      <Play className="w-5 h-5 fill-current" />
      <span className="text-sm font-black tracking-tight">Avvia Telemetria M3</span>
    </button>
  );
};
