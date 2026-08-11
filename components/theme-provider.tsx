'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { COLOR_PALETTES } from '@/lib/theme-palettes';
import { ThemePalette } from '@/lib/types';

interface ThemeContextType {
  currentPalette: ThemePalette;
  setPalette: (paletteId: string) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  availablePalettes: ThemePalette[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [paletteId, setPaletteId] = useState<string>('sapphire-corporate');
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Load saved preferences
    const savedPalette = localStorage.getItem('Aaryavart_Integrated_Services_palette');
    const savedDark = localStorage.getItem('Aaryavart_Integrated_Services_dark');

    if (savedPalette && COLOR_PALETTES.some((p) => p.id === savedPalette)) {
      setPaletteId(savedPalette);
    }
    if (savedDark !== null) {
      setIsDark(savedDark === 'true');
    }
  }, []);

  const currentPalette = COLOR_PALETTES.find((p) => p.id === paletteId) || COLOR_PALETTES[0];

  useEffect(() => {
    // Apply CSS custom properties dynamically to root
    const root = document.documentElement;
    Object.entries(currentPalette.variables).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentPalette, isDark]);

  const setPalette = (id: string) => {
    setPaletteId(id);
    localStorage.setItem('Aaryavart_Integrated_Services_palette', id);
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem('Aaryavart_Integrated_Services_dark', String(next));
      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        currentPalette,
        setPalette,
        isDark,
        toggleDarkMode,
        availablePalettes: COLOR_PALETTES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
