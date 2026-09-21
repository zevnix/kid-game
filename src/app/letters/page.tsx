"use client";

import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function LettersPage() {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const vowels = ["A", "E", "I", "O", "U"];

  const playSound = (letter: string) => {
    setActiveLetter(letter);
    const utterThis = new SpeechSynthesisUtterance(letter);
    utterThis.lang = 'es-ES';
    utterThis.rate = 0.8; // Más lento para que los niños entiendan
    window.speechSynthesis.speak(utterThis);

    if (navigator.vibrate) navigator.vibrate(100);

    // Pequeño festejo si tocan una vocal
    if (vowels.includes(letter)) {
       confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#fbbf24', '#3b82f6']
      });
    }

    setTimeout(() => setActiveLetter(null), 1000);
  };

  return (
    <div>
      <Navigation title="El Abecedario" />

      <div className="bg-white/50 p-6 rounded-3xl mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-center text-slate-700">
          ¡Toca una letra para escucharla! Las <span className="text-rose-500">vocales</span> son especiales.
        </h2>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
        {alphabet.map((letter) => {
          const isVowel = vowels.includes(letter);
          return (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => playSound(letter)}
              className={`
                aspect-square flex items-center justify-center text-4xl md:text-5xl font-bold rounded-2xl shadow-sm transition-colors border-b-4
                ${isVowel
                  ? 'bg-rose-100 text-rose-600 border-rose-300 hover:bg-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                ${activeLetter === letter ? 'scale-90 border-b-0 translate-y-1' : ''}
              `}
            >
              {letter}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
