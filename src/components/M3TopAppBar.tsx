import React from 'react';
import { Flame, Moon, Sun, Palette, HeartPulse } from 'lucide-react';
import { useM3Theme } from '../theme/ThemeProvider';
import { PaletteName } from '../theme/m3Tokens';

interface M3TopAppBarProps {
  currentStreak: number;
  onOpenThemeMenu?: () => void;
}

export const M3TopAppBar: React.FC<M3TopAppBarProps> = ({ currentStreak }) => {
  const { palette, setPalette, isDark, setIsDark } = useM3Theme();
  const [showThemeSelector, setShowThemeSelector] = React.useState(false);

  const palettesList: { id: PaletteName; label: string; dotColor: string }[] = [
    { id: 'forest-teal', label: 'Forest Teal', dotColor: '#006A60' },
    { id: 'deep-violet', label: 'Deep Violet', dotColor: '#6750A4' },
    { id: 'ocean-blue', label: 'Ocean Blue', dotColor: '#006399' },
    { id: 'amber-sunset', label: 'Amber Sunset', dotColor: '#8A5100' },
  ];

  return (
    <header className="relative w-full px-4 py-2.5 bg-m3-surface-container-low border-b border-m3-outline-variant/30 transition-colors duration-200">
      <div className="flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-m3-md bg-m3-primary flex items-center justify-center text-m3-on-primary font-black shadow-m3-1">
            <span className="text-lg tracking-tighter">AF</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight leading-none text-m3-on-surface">
              AuraFit
            </h1>
            <div className="flex items-center space-x-1 mt-0.5">
              <HeartPulse className="w-3 h-3 text-m3-primary animate-pulse" />
              <span className="text-[10px] font-semibold tracking-wide uppercase text-m3-outline">
                Health Connect M3
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Streak Badge */}
        <div className="flex items-center space-x-2">
          {/* Animated Streak Flame Chip */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-m3-full bg-m3-primary-container text-m3-on-primary-container font-bold text-xs shadow-sm border border-m3-primary/20">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-flame" />
            <span>{currentStreak}d Streak</span>
          </div>

          {/* Dynamic Theme Picker Button */}
          <div className="relative">
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              title="Material You Dynamic Monet Theme"
              className="p-2 rounded-m3-full hover:bg-m3-surface-container-high transition-colors text-m3-on-surface-variant m3-ripple"
            >
              <Palette className="w-4 h-4 text-m3-primary" />
            </button>

            {/* Dropdown for Monet Palettes */}
            {showThemeSelector && (
              <div className="absolute right-0 mt-2 w-48 py-2 rounded-m3-lg bg-m3-surface-container-high border border-m3-outline-variant/40 shadow-m3-3 z-50">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-m3-outline">
                  Monet Dynamic Colors
                </div>
                {palettesList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPalette(p.id);
                      setShowThemeSelector(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-left transition-colors hover:bg-m3-surface-container-highest ${
                      palette === p.id ? 'bg-m3-primary-container/40 text-m3-primary font-bold' : 'text-m3-on-surface'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20"
                      style={{ backgroundColor: p.dotColor }}
                    />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            title="Toggle Dark / Light Theme"
            className="p-2 rounded-m3-full hover:bg-m3-surface-container-high transition-colors text-m3-on-surface-variant m3-ripple"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-m3-primary" />}
          </button>
        </div>
      </div>
    </header>
  );
};
