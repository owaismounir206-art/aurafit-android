import React from 'react';
import { ClusterId, SportId } from '../core/types';
import { CLUSTERS, SPORT_LABELS } from '../core/clusterEngine';
import { ShieldAlert, Zap, Compass, HeartPulse } from 'lucide-react';

interface ClusterCarouselProps {
  selectedClusterId: ClusterId;
  selectedSportId: SportId;
  onSelectCluster: (clusterId: ClusterId) => void;
  onSelectSport: (sportId: SportId) => void;
}

export const ClusterCarousel: React.FC<ClusterCarouselProps> = ({
  selectedClusterId,
  selectedSportId,
  onSelectCluster,
  onSelectSport,
}) => {
  const clusters = Object.values(CLUSTERS);
  const activeCluster = CLUSTERS[selectedClusterId];

  const clusterIcons: Record<ClusterId, React.FC<{ className?: string }>> = {
    CLUSTER_A: Zap,
    CLUSTER_B: ShieldAlert,
    CLUSTER_C: Compass,
    CLUSTER_D: HeartPulse,
  };

  return (
    <div className="w-full space-y-3">
      {/* Cluster Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 px-1">
        {clusters.map((c) => {
          const isSelected = selectedClusterId === c.id;
          const Icon = clusterIcons[c.id];

          return (
            <button
              key={c.id}
              onClick={() => {
                onSelectCluster(c.id);
                // Also default to first sport of this cluster
                if (!c.sports.includes(selectedSportId)) {
                  onSelectSport(c.sports[0]);
                }
              }}
              className={`flex-shrink-0 flex items-center space-x-2 px-3.5 py-2 rounded-m3-full text-xs font-bold transition-all duration-200 m3-ripple ${
                isSelected
                  ? 'bg-m3-primary text-m3-on-primary shadow-m3-2 scale-100'
                  : 'bg-m3-surface-container-high text-m3-on-surface hover:bg-m3-surface-container-highest border border-m3-outline-variant/40 scale-95'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{c.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-m3-full font-black ${
                  isSelected ? 'bg-m3-on-primary/20 text-m3-on-primary' : 'bg-m3-surface text-m3-outline'
                }`}
              >
                {c.minBpmTarget} BPM
              </span>
            </button>
          );
        })}
      </div>

      {/* Sub-Sport Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar px-1">
        {activeCluster.sports.map((sportKey) => {
          const isSportActive = selectedSportId === sportKey;
          const sportMeta = SPORT_LABELS[sportKey] || { name: sportKey, icon: '⚡' };

          return (
            <button
              key={sportKey}
              onClick={() => onSelectSport(sportKey)}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-m3-md text-xs font-semibold transition-all m3-ripple ${
                isSportActive
                  ? 'bg-m3-secondary-container text-m3-on-secondary-container border border-m3-secondary/30'
                  : 'bg-m3-surface-container-low text-m3-on-surface-variant hover:bg-m3-surface-container border border-transparent'
              }`}
            >
              <span>{sportMeta.icon}</span>
              <span>{sportMeta.name}</span>
            </button>
          );
        })}
      </div>

      {/* Biomechanical Tagline Banner */}
      <div className="px-3.5 py-2 rounded-m3-md bg-m3-surface-container-low border-l-4 border-m3-primary text-xs">
        <span className="font-bold text-m3-primary uppercase text-[10px] tracking-wider block">
          Focus Biomeccanico Obbligatorio
        </span>
        <p className="text-m3-on-surface font-medium mt-0.5 leading-snug">
          {activeCluster.tagline}
        </p>
      </div>
    </div>
  );
};
