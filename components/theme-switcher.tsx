'use client';

import React, { useState } from 'react';
import { useTheme } from './theme-provider';
import { Palette, Moon, Sun, X, Check, Sparkles } from 'lucide-react';

export function ThemeSwitcher() {
  const { currentPalette, setPalette, isDark, toggleDarkMode, availablePalettes } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      {/* Floating Trigger Widget (iOS style glass pill) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-full glass-panel shadow-ios-lg hover:scale-105 active:scale-95 transition-all text-slate-800 dark:text-slate-100 font-medium border border-slate-200/50 dark:border-slate-700/50"
          title="Customize Theme & Color Palette (Dev & Admin Mode)"
        >
          <div
            className="w-5 h-5 rounded-full shadow-inner border border-white/40"
            style={{ background: currentPalette.previewColor }}
          />
          <span className="text-xs font-semibold tracking-wide hidden sm:inline">Theme Palette</span>
          <Palette className="w-4 h-4 text-brand-600 dark:text-brand-400" />
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full glass-panel shadow-ios-lg hover:scale-105 active:scale-95 transition-all text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-700/50"
          title="Toggle Light / Dark Mode"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>
      </div>

      {/* Drawer Overlay Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm transition-all animate-fadeIn">
          <div className="w-full sm:max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Color Palette Selector
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Preview & select from 10+ iOS-inspired corporate color themes
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Currently Active Theme Info */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl shadow-md border border-white/20"
                  style={{ background: currentPalette.previewColor }}
                />
                <div>
                  <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    Active Palette
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentPalette.name}
                  </div>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                Selected
              </span>
            </div>

            {/* Palettes Grid */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider block">
                Select Theme (10 Curated Palettes)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availablePalettes.map((palette) => {
                  const isSelected = palette.id === currentPalette.id;
                  return (
                    <button
                      key={palette.id}
                      onClick={() => setPalette(palette.id)}
                      className={`relative p-3.5 rounded-2xl text-left border transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-brand-600 dark:border-brand-400 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/30 shadow-sm'
                          : 'border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-xl shrink-0 shadow-sm border border-white/20 flex items-center justify-center"
                        style={{ background: palette.previewColor }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {palette.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {palette.description.split(' (')[0]}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Selection auto-saves to LocalStorage</span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition shadow-md"
              >
                Apply & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
