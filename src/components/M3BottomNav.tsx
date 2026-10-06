import React from 'react';
import { Dumbbell, ShieldAlert, Users, User } from 'lucide-react';

export type NavTab = 'mission' | 'penalties' | 'squad' | 'profile';

interface M3BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  burpeesDebtCount: number;
  remainingFreezeDays: number;
}

export const M3BottomNav: React.FC<M3BottomNavProps> = ({
  activeTab,
  onTabChange,
  burpeesDebtCount,
  remainingFreezeDays,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    {
      id: 'mission',
      label: 'Missione',
      icon: Dumbbell,
    },
    {
      id: 'penalties',
      label: 'Penitenze',
      icon: ShieldAlert,
      badge: burpeesDebtCount > 0 ? `${burpeesDebtCount}b` : undefined,
      badgeColor: 'bg-m3-error text-m3-on-error',
    },
    {
      id: 'squad',
      label: 'Squad Wall',
      icon: Users,
    },
    {
      id: 'profile',
      label: 'Profilo',
      icon: User,
      badge: remainingFreezeDays > 0 ? `${remainingFreezeDays}❄️` : undefined,
      badgeColor: 'bg-m3-tertiary-container text-m3-on-tertiary-container',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-m3-surface-container border-t border-m3-outline-variant/30 px-3 py-2 z-40 select-none">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group flex flex-col items-center justify-center py-1 px-3 min-w-[64px] m3-ripple rounded-m3-md focus:outline-none"
            >
              {/* Navigation Pill Container */}
              <div className="relative">
                <div
                  className={`flex items-center justify-center w-14 h-8 rounded-m3-full transition-all duration-300 ${
                    isActive
                      ? 'bg-m3-primary-container text-m3-on-primary-container scale-100 shadow-sm'
                      : 'text-m3-on-surface-variant hover:bg-m3-surface-container-high scale-95'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.5]' : 'stroke-2'}`} />
                </div>

                {/* Badge (e.g. debt or freeze days) */}
                {tab.badge && (
                  <span
                    className={`absolute -top-1 -right-2 px-1.5 py-0.5 rounded-m3-full text-[10px] font-black tracking-tight shadow-sm border border-m3-surface ${
                      tab.badgeColor || 'bg-m3-error text-m3-on-error'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Destination Label */}
              <span
                className={`text-[11px] mt-1 font-medium tracking-tight transition-all ${
                  isActive
                    ? 'text-m3-on-surface font-bold'
                    : 'text-m3-on-surface-variant/80 group-hover:text-m3-on-surface'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
