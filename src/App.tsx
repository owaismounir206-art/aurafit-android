import React, { useState, useRef } from 'react';
import { PenaltyStateMachine } from './core/penaltyStateMachine';
import { HealthConnectService, SimulationIntensity } from './services/HealthConnectService';
import { DailyDeadlineWorker } from './services/DailyDeadlineWorker';
import { ClusterId, SportId, DayStatusRecord, SquadPost } from './core/types';
import { CLUSTERS } from './core/clusterEngine';
import { M3SystemBar } from './components/M3SystemBar';
import { M3TopAppBar } from './components/M3TopAppBar';
import { M3BottomNav, NavTab } from './components/M3BottomNav';
import { M3Fab } from './components/M3Fab';
import { FreezeModal } from './components/FreezeModal';
import { InjuryModal } from './components/InjuryModal';
import { MissionScreen } from './screens/MissionScreen';
import { PenaltiesScreen } from './screens/PenaltiesScreen';
import { SquadFeedScreen } from './screens/SquadFeedScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const INITIAL_SQUAD_POSTS: SquadPost[] = [
  {
    id: 'post-1',
    athleteName: 'Marco Brambilla',
    athleteAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    timestamp: '28 min fa',
    cluster: 'CLUSTER_A',
    type: 'VERIFICATION',
    message: 'Completato micro-conditioning Calcio: focus decelerazione anti-valgismo ginocchio e balzi a 90°. BPM medi 134 per 24 min.',
    streak: 19,
    proofBadge: 'PoW Convalidata (Health Connect)',
    highFives: 6,
    hasHighFived: true,
  },
  {
    id: 'post-2',
    athleteName: 'Sara De Luca',
    athleteAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    timestamp: '2 ore fa',
    cluster: 'CLUSTER_C',
    type: 'FREEZE',
    message: 'Attivato Freeze Day dopo il triathlon sprint. Giorno di recupero criogenico, streak al sicuro a 42 giorni!',
    streak: 42,
    highFives: 9,
    hasHighFived: false,
  },
  {
    id: 'post-3',
    athleteName: 'Davide Leone',
    athleteAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    timestamp: 'Ieri alle 23:59',
    cluster: 'CLUSTER_B',
    type: 'INFRACTION',
    message: '🚨 PENITENZA SOCIALE: Ha saltato il condizionamento scapolare senza Freeze Day! Assegnato debito di +50 Burpees e streak azzerata.',
    streak: 0,
    penaltyDebt: '+50 Burpees Obbligatori',
    highFives: 3,
    hasHighFived: false,
  },
];

export const App: React.FC = () => {
  // Domain State Machine instance
  const stateMachineRef = useRef<PenaltyStateMachine>(
    new PenaltyStateMachine({
      currentStreak: 14,
      bestStreak: 18,
      activeBurpeesDebt: 0,
      financialJarTotal: 10,
    })
  );

  const [status, setStatus] = useState<DayStatusRecord>(stateMachineRef.current.getStatus());
  const [activeTab, setActiveTab] = useState<NavTab>('mission');
  const [selectedClusterId, setSelectedClusterId] = useState<ClusterId>('CLUSTER_A');
  const [selectedSportId, setSelectedSportId] = useState<SportId>('soccer');

  // Telemetry stream state
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [heartRate, setHeartRate] = useState<number>(85);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [activeCalories, setActiveCalories] = useState<number>(0);
  const [intensity, setIntensity] = useState<SimulationIntensity>('OPTIMAL');

  // Modals state
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState<boolean>(false);
  const [isInjuryModalOpen, setIsInjuryModalOpen] = useState<boolean>(false);

  // Squad Posts Feed
  const [squadPosts, setSquadPosts] = useState<SquadPost[]>(INITIAL_SQUAD_POSTS);

  // Toast notification banner
  const [alertBanner, setAlertBanner] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const healthService = HealthConnectService.getInstance();
  const currentCluster = CLUSTERS[selectedClusterId];

  // Refresh status state helper
  const syncStatus = () => {
    setStatus(stateMachineRef.current.getStatus());
  };

  const showBanner = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertBanner({ message, type });
    setTimeout(() => setAlertBanner(null), 4000);
  };

  // Start Telemetry Session
  const handleStartSession = () => {
    stateMachineRef.current.startSession();
    syncStatus();
    setIsStreaming(true);

    healthService.startStreaming((sample) => {
      setHeartRate(sample.heartRate);
      setDurationSeconds(sample.durationSeconds);
      setActiveCalories(sample.activeCalories);
    });

    showBanner('Telemetria Health Connect avviata. In ascolto dei sensori cardiaci...', 'info');
  };

  // Stop / Pause Telemetry Session
  const handleStopSession = () => {
    healthService.stopStreaming();
    setIsStreaming(false);
    showBanner('Telemetria in pausa.', 'info');
  };

  // Change simulation intensity
  const handleChangeIntensity = (newIntensity: SimulationIntensity) => {
    setIntensity(newIntensity);
    healthService.setIntensity(newIntensity);
  };

  // Fast forward simulation for testing
  const handleFastForward = (minutes: number) => {
    healthService.fastForwardMinutes(minutes, currentCluster.minBpmTarget + 8);
    const last = healthService.getTelemetryHistory().slice(-1)[0];
    if (last) {
      setDurationSeconds(last.durationSeconds);
      setHeartRate(last.heartRate);
      setActiveCalories(last.activeCalories);
    }
    showBanner(`Simulati +${minutes} minuti con successo!`, 'success');
  };

  // Verify Proof of Work
  const handleVerifyProof = () => {
    const proof = healthService.verifyProofOfWork({
      minDurationMinutes: 15,
      minAverageBpm: currentCluster.minBpmTarget,
    });

    const verificationResult = stateMachineRef.current.verifySession(proof);

    if (verificationResult.success) {
      syncStatus();
      handleStopSession();
      showBanner(verificationResult.message, 'success');

      // Add verification post to squad feed
      const newPost: SquadPost = {
        id: `proof-${Date.now()}`,
        athleteName: 'Tu (Alex Rossi)',
        athleteAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        timestamp: 'Proprio ora',
        cluster: selectedClusterId,
        type: 'VERIFICATION',
        message: `Completato e certificato allenamento ${currentCluster.name}! ${proof.actualDurationMinutes} min a ${proof.actualAverageBpm} BPM medi.`,
        streak: stateMachineRef.current.getStatus().currentStreak,
        proofBadge: 'Proof of Work Certificata ✓',
        highFives: 1,
        hasHighFived: true,
      };
      setSquadPosts([newPost, ...squadPosts]);
    } else {
      showBanner(verificationResult.message, 'error');
    }
  };

  // Activate Freeze Day
  const handleConfirmFreeze = () => {
    const res = stateMachineRef.current.activateFreezeDay();
    if (res.success) {
      syncStatus();
      showBanner(res.message, 'success');

      const freezePost: SquadPost = {
        id: `freeze-${Date.now()}`,
        athleteName: 'Tu (Alex Rossi)',
        athleteAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        timestamp: 'Proprio ora',
        cluster: selectedClusterId,
        type: 'FREEZE',
        message: '❄️ Freeze Day criogenico attivato! Nessuna penitenza per oggi, streak intatta.',
        streak: stateMachineRef.current.getStatus().currentStreak,
        highFives: 2,
      };
      setSquadPosts([freezePost, ...squadPosts]);
    } else {
      showBanner(res.message, 'error');
    }
  };

  // Toggle Injury Mode
  const handleConfirmInjury = () => {
    if (status.state === 'INJURED') {
      stateMachineRef.current.resetNewDay();
      syncStatus();
      showBanner('Modalità infortunio disattivata. Tornato al programma ordinario.', 'info');
    } else {
      const res = stateMachineRef.current.activateInjuryMode();
      if (res.success) {
        syncStatus();
        showBanner(res.message, 'info');
      }
    }
  };

  // Settle Burpees debt
  const handleSettleBurpees = (count: number) => {
    const res = stateMachineRef.current.settleBurpees(count);
    syncStatus();
    if (res.cleared) {
      showBanner('Grande! Tutto il debito di burpees è stato estinto.', 'success');
    }
  };

  // Simulate 23:59 Deadline (Android WorkManager)
  const handleTriggerDeadlineTest = () => {
    const result = DailyDeadlineWorker.execute(stateMachineRef.current);
    syncStatus();

    if (result.evaluation.missed) {
      showBanner(result.evaluation.penaltyDescription, 'error');
      if (result.evaluation.squadAlert) {
        setSquadPosts([result.evaluation.squadAlert, ...squadPosts]);
      }
    } else {
      showBanner(result.evaluation.penaltyDescription, 'success');
    }
  };

  const durationMinutes = Math.floor(durationSeconds / 60);
  const canVerify = durationMinutes >= 15 && heartRate >= currentCluster.minBpmTarget && status.state !== 'VERIFIED';
  const isVerified = status.state === 'VERIFIED';

  return (
    <div className="min-h-screen bg-m3-surface text-m3-on-surface flex justify-center selection:bg-m3-primary selection:text-m3-on-primary font-sans antialiased">
      {/* Mobile Frame Container (Simulates Android 14 Smartphone Viewport) */}
      <div className="w-full max-w-md min-h-screen bg-m3-surface flex flex-col relative shadow-2xl border-x border-m3-outline-variant/30">
        {/* Android Top System Bar */}
        <M3SystemBar />

        {/* Material 3 Top App Bar */}
        <M3TopAppBar currentStreak={status.currentStreak} />

        {/* Global Alert Notification Toast */}
        {alertBanner && (
          <div
            className={`mx-4 mt-2 p-3 rounded-m3-md text-xs font-black shadow-m3-3 transition-all animate-bounce z-40 ${
              alertBanner.type === 'success'
                ? 'bg-emerald-600 text-white'
                : alertBanner.type === 'error'
                ? 'bg-m3-error text-m3-on-error'
                : 'bg-m3-primary text-m3-on-primary'
            }`}
          >
            {alertBanner.message}
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 px-4 pt-3 overflow-y-auto no-scrollbar">
          {activeTab === 'mission' && (
            <MissionScreen
              status={status}
              selectedClusterId={selectedClusterId}
              selectedSportId={selectedSportId}
              onSelectCluster={setSelectedClusterId}
              onSelectSport={setSelectedSportId}
              isStreaming={isStreaming}
              heartRate={heartRate}
              durationSeconds={durationSeconds}
              activeCalories={activeCalories}
              intensity={intensity}
              onChangeIntensity={handleChangeIntensity}
              onFastForward={handleFastForward}
              onOpenFreezeModal={() => setIsFreezeModalOpen(true)}
              onOpenInjuryModal={() => setIsInjuryModalOpen(true)}
              onSimulateDeadline={handleTriggerDeadlineTest}
            />
          )}

          {activeTab === 'penalties' && (
            <PenaltiesScreen
              status={status}
              onUpdateContractCategory={(cat) => {
                stateMachineRef.current.updateContract({ category: cat });
                syncStatus();
                showBanner(`Patto aggiornato a: ${cat}`, 'info');
              }}
              onSettleBurpees={handleSettleBurpees}
              onTriggerDeadlineTest={handleTriggerDeadlineTest}
            />
          )}

          {activeTab === 'squad' && <SquadFeedScreen posts={squadPosts} />}

          {activeTab === 'profile' && (
            <ProfileScreen
              status={status}
              selectedClusterId={selectedClusterId}
              onOpenFreezeModal={() => setIsFreezeModalOpen(true)}
              onOpenInjuryModal={() => setIsInjuryModalOpen(true)}
            />
          )}
        </main>

        {/* Extended Floating Action Button (Only on Mission Screen) */}
        {activeTab === 'mission' && (
          <M3Fab
            isStreaming={isStreaming}
            canVerify={canVerify}
            isVerified={isVerified}
            onStartSession={handleStartSession}
            onStopSession={handleStopSession}
            onVerifyProof={handleVerifyProof}
          />
        )}

        {/* Bottom Navigation Bar */}
        <M3BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          burpeesDebtCount={status.activeBurpeesDebt}
          remainingFreezeDays={status.penaltyContract.remainingFreezeDays}
        />

        {/* Freeze Day Modal */}
        <FreezeModal
          isOpen={isFreezeModalOpen}
          onClose={() => setIsFreezeModalOpen(false)}
          onConfirm={handleConfirmFreeze}
          remainingFreezeDays={status.penaltyContract.remainingFreezeDays}
          currentStreak={status.currentStreak}
        />

        {/* Injury Mode Modal */}
        <InjuryModal
          isOpen={isInjuryModalOpen}
          onClose={() => setIsInjuryModalOpen(false)}
          onConfirm={handleConfirmInjury}
          isInjured={status.state === 'INJURED'}
        />
      </div>
    </div>
  );
};
