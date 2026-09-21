"use client";

import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

const LETTER_EXAMPLES: Record<string, { word: string, icon: string }> = {
  "A": { word: "Araña", icon: "🕷️" }, "B": { word: "Barco", icon: "⛵" },
  "C": { word: "Coche", icon: "🚗" }, "D": { word: "Dado", icon: "🎲" },
  "E": { word: "Elefante", icon: "🐘" }, "F": { word: "Fresa", icon: "🍓" },
  "G": { word: "Gato", icon: "🐱" }, "H": { word: "Hielo", icon: "🧊" },
  "I": { word: "Isla", icon: "🏝️" }, "J": { word: "Jirafa", icon: "🦒" },
  "K": { word: "Koala", icon: "🐨" }, "L": { word: "Luna", icon: "🌙" },
  "M": { word: "Manzana", icon: "🍎" }, "N": { word: "Nube", icon: "☁️" },
  "O": { word: "Oso", icon: "🐻" }, "P": { word: "Perro", icon: "🐶" },
  "Q": { word: "Queso", icon: "🧀" }, "R": { word: "Ratón", icon: "🐭" },
  "S": { word: "Sol", icon: "☀️" }, "T": { word: "Tren", icon: "🚂" },
  "U": { word: "Uva", icon: "🍇" }, "V": { word: "Vaca", icon: "🐄" },
  "W": { word: "Waffle", icon: "🧇" }, "X": { word: "Xilófono", icon: "🎹" },
  "Y": { word: "Yoyo", icon: "🪀" }, "Z": { word: "Zorro", icon: "🦊" }
};

export default function LettersPage() {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [mode, setMode] = useState<"vowels" | "alphabet">("vowels");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const vowels = ["A", "E", "I", "O", "U"];
  const displayLetters = mode === "vowels" ? vowels : alphabet;

  const playSound = (letter: string) => {
    setActiveLetter(letter);

    // Aquí puedes reproducir el audio MP3 en el futuro:
    // const audio = new Audio(`/sounds/letters/${letter.toLowerCase()}.mp3`);
    // audio.play();

    // Por ahora usamos síntesis de voz, pronunciando la letra y luego el ejemplo
    const textToSpeak = `${letter}, de ${LETTER_EXAMPLES[letter]?.word || letter}`;
    const utterThis = new SpeechSynthesisUtterance(textToSpeak);
    utterThis.lang = 'es-ES';
    utterThis.rate = 0.9;
    window.speechSynthesis.speak(utterThis);

    if (navigator.vibrate) navigator.vibrate(100);

    if (vowels.includes(letter)) {
       confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#fbbf24', '#3b82f6']
      });
    }

    setTimeout(() => setActiveLetter(null), 2000);
  };

  return (
    <div>
      <Navigation title="El Abecedario" />

      <div className="bg-white/80 p-4 rounded-3xl mb-6 flex justify-center gap-4 border border-slate-200">
        <button
          onClick={() => setMode("vowels")}
          className={`px-6 py-3 rounded-2xl font-bold text-xl transition-colors ${mode === "vowels" ? 'bg-rose-400 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          Solo Vocales
        </button>
        <button
          onClick={() => setMode("alphabet")}
          className={`px-6 py-3 rounded-2xl font-bold text-xl transition-colors ${mode === "alphabet" ? 'bg-blue-400 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
        >
          El Abecedario
        </button>
      </div>

      <div className={`grid gap-4 ${mode === 'vowels' ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7'}`}>
        {displayLetters.map((letter) => {
          const isVowel = vowels.includes(letter);
          const example = LETTER_EXAMPLES[letter];

          return (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playSound(letter)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-3xl shadow-sm transition-all border-b-8 p-2
                ${isVowel
                  ? 'bg-rose-100 text-rose-600 border-rose-300 hover:bg-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                ${activeLetter === letter ? 'scale-95 border-b-0 translate-y-2 bg-blue-100 border-blue-300 text-blue-700' : ''}
              `}
            >
              <span className={`${mode === 'vowels' ? 'text-6xl md:text-8xl' : 'text-4xl md:text-6xl'} font-black`}>
                {letter}
              </span>

              {activeLetter === letter && example && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center border-4 border-blue-400 z-10"
                >
                  <span className="text-6xl mb-2">{example.icon}</span>
                  <span className="text-2xl font-bold text-slate-800">{example.word}</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
