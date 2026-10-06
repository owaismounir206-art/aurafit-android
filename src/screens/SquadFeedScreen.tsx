import React, { useState } from 'react';
import { SquadPost } from '../core/types';
import { Hand, ShieldAlert, CheckCircle2, Flame, MessageSquare } from 'lucide-react';

interface SquadFeedScreenProps {
  posts: SquadPost[];
}

export const SquadFeedScreen: React.FC<SquadFeedScreenProps> = ({ posts }) => {
  const [feed, setFeed] = useState<SquadPost[]>(posts);

  const toggleHighFive = (postId: string) => {
    setFeed((prev) =>
      prev.map((item) => {
        if (item.id === postId) {
          const isHighFived = item.hasHighFived;
          return {
            ...item,
            highFives: isHighFived ? item.highFives - 1 : item.highFives + 1,
            hasHighFived: !isHighFived,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-m3-on-surface">Squad Wall & Accountability</h3>
          <p className="text-xs text-m3-outline font-medium">
            Feed trasparente del gruppo: successi, jolly e infrazioni
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container text-xs font-bold">
          Team Sparta (12 atleti)
        </span>
      </div>

      {/* Feed Stream */}
      <div className="space-y-3">
        {feed.map((post) => {
          const isInfraction = post.type === 'INFRACTION';
          const isFreeze = post.type === 'FREEZE';

          return (
            <div
              key={post.id}
              className={`p-4 rounded-m3-xl border transition-all ${
                isInfraction
                  ? 'bg-m3-error-container/20 border-m3-error/40 shadow-sm'
                  : isFreeze
                  ? 'bg-m3-tertiary-container/20 border-m3-tertiary/40'
                  : 'bg-m3-surface-container-high border-m3-outline-variant/40'
              }`}
            >
              {/* Post Header: Avatar, Name & Timestamp */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={post.athleteAvatar}
                    alt={post.athleteName}
                    className="w-9 h-9 rounded-m3-full object-cover border border-m3-outline-variant"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-m3-on-surface leading-tight">
                      {post.athleteName}
                    </h4>
                    <span className="text-[10px] text-m3-outline font-medium">
                      {post.timestamp}
                    </span>
                  </div>
                </div>

                {/* Streak Badge */}
                <div
                  className={`flex items-center space-x-1 px-2 py-0.5 rounded-m3-full text-[11px] font-black ${
                    isInfraction
                      ? 'bg-m3-error text-m3-on-error'
                      : 'bg-m3-surface-container text-m3-primary'
                  }`}
                >
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                  <span>{post.streak}d</span>
                </div>
              </div>

              {/* Message Content */}
              <div className="mt-2.5">
                <p className="text-xs text-m3-on-surface font-medium leading-relaxed">
                  {post.message}
                </p>

                {/* Specific Proof Badges */}
                {post.proofBadge && (
                  <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-m3-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{post.proofBadge}</span>
                  </div>
                )}

                {post.penaltyDebt && (
                  <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-m3-full bg-m3-error text-m3-on-error text-[10px] font-black">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Penitenza: {post.penaltyDebt}</span>
                  </div>
                )}
              </div>

              {/* Interactive Footer: High-Fives & Comments */}
              <div className="mt-3 pt-2.5 border-t border-m3-outline-variant/30 flex items-center justify-between text-xs">
                <button
                  onClick={() => toggleHighFive(post.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-m3-full transition-all m3-ripple ${
                    post.hasHighFived
                      ? 'bg-m3-primary text-m3-on-primary font-bold shadow-sm'
                      : 'bg-m3-surface-container text-m3-on-surface-variant hover:bg-m3-surface-container-highest'
                  }`}
                >
                  <Hand className="w-3.5 h-3.5" />
                  <span>Batti 5 ({post.highFives})</span>
                </button>

                <div className="flex items-center space-x-1 text-m3-outline font-medium">
                  <MessageSquare className="w-3 h-3" />
                  <span>Incoraggia</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
