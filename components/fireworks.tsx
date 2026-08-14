'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';

export function Fireworks() {
  const [isFiring, setIsFiring] = useState(false);

  const fire = () => {
    if (isFiring) return;
    setIsFiring(true);

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        setIsFiring(false);
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      const colors = ['#f97316', '#eab308', '#ef4444', '#8b5cf6', '#22c55e', '#ffffff'];

      confetti({
        ...defaults,
        particleCount,
        colors,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        colors,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <button
      onClick={fire}
      disabled={isFiring}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-green-500 text-white font-bold rounded-full shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Sparkles className="w-4 h-4" />
      <span>{isFiring ? 'Celebrating...' : 'Happy Diwali!'}</span>
    </button>
  );
}
