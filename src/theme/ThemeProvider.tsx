import React, { createContext, useContext, useEffect, useState } from 'react';
import { M3ColorScheme, PaletteName, PALETTES } from './m3Tokens';

interface ThemeContextType {
  palette: PaletteName;
  setPalette: (palette: PaletteName) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  currentScheme: M3ColorScheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [palette, setPalette] = useState<PaletteName>('forest-teal');
  const [isDark, setIsDark] = useState<boolean>(true); // Default to Dark mode (standard for athletic telemetry & OLED)

  const currentScheme = PALETTES[palette][isDark ? 'dark' : 'light'];

  useEffect(() => {
    const root = document.documentElement;

    // Apply Material 3 tokens to CSS variables
    root.style.setProperty('--md-sys-color-primary', currentScheme.primary);
    root.style.setProperty('--md-sys-color-on-primary', currentScheme.onPrimary);
    root.style.setProperty('--md-sys-color-primary-container', currentScheme.primaryContainer);
    root.style.setProperty('--md-sys-color-on-primary-container', currentScheme.onPrimaryContainer);

    root.style.setProperty('--md-sys-color-secondary', currentScheme.secondary);
    root.style.setProperty('--md-sys-color-on-secondary', currentScheme.onSecondary);
    root.style.setProperty('--md-sys-color-secondary-container', currentScheme.secondaryContainer);
    root.style.setProperty('--md-sys-color-on-secondary-container', currentScheme.onSecondaryContainer);

    root.style.setProperty('--md-sys-color-tertiary', currentScheme.tertiary);
    root.style.setProperty('--md-sys-color-on-tertiary', currentScheme.onTertiary);
    root.style.setProperty('--md-sys-color-tertiary-container', currentScheme.tertiaryContainer);
    root.style.setProperty('--md-sys-color-on-tertiary-container', currentScheme.onTertiaryContainer);

    root.style.setProperty('--md-sys-color-error', currentScheme.error);
    root.style.setProperty('--md-sys-color-on-error', currentScheme.onError);
    root.style.setProperty('--md-sys-color-error-container', currentScheme.errorContainer);
    root.style.setProperty('--md-sys-color-on-error-container', currentScheme.onErrorContainer);

    root.style.setProperty('--md-sys-color-background', currentScheme.background);
    root.style.setProperty('--md-sys-color-on-background', currentScheme.onBackground);
    root.style.setProperty('--md-sys-color-surface', currentScheme.surface);
    root.style.setProperty('--md-sys-color-on-surface', currentScheme.onSurface);
    root.style.setProperty('--md-sys-color-surface-variant', currentScheme.surfaceVariant);
    root.style.setProperty('--md-sys-color-on-surface-variant', currentScheme.onSurfaceVariant);

    root.style.setProperty('--md-sys-color-outline', currentScheme.outline);
    root.style.setProperty('--md-sys-color-outline-variant', currentScheme.outlineVariant);

    root.style.setProperty('--md-sys-color-surface-container-lowest', currentScheme.surfaceContainerLowest);
    root.style.setProperty('--md-sys-color-surface-container-low', currentScheme.surfaceContainerLow);
    root.style.setProperty('--md-sys-color-surface-container', currentScheme.surfaceContainer);
    root.style.setProperty('--md-sys-color-surface-container-high', currentScheme.surfaceContainerHigh);
    root.style.setProperty('--md-sys-color-surface-container-highest', currentScheme.surfaceContainerHighest);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [palette, isDark, currentScheme]);

  return (
    <ThemeContext.Provider value={{ palette, setPalette, isDark, setIsDark, currentScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useM3Theme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useM3Theme must be used within a ThemeProvider');
  }
  return context;
};
