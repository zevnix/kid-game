"use client";

import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { X } from "lucide-react";

export default function LettersPage() {
  const lettersStore = useStore((state) => state.letters);

  // Transformar el array del store en el diccionario esperado por la UI actual
  const letterExamples = useMemo(() => {
    const dict: Record<string, { word: string, icon: string, imagePath?: string, audioPath?: string }[]> = {};
    lettersStore.forEach(l => { dict[l.id] = l.examples; });
    return dict;
  }, [lettersStore]);

  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [mode, setMode] = useState<"vowels" | "alphabet">("vowels");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const vowels = ["A", "E", "I", "O", "U"];
  const displayLetters = mode === "vowels" ? vowels : alphabet;

  const playLetter = (letter: string) => {
    setActiveLetter(letter);
    const utterThis = new SpeechSynthesisUtterance(letter);
    utterThis.lang = 'es-ES';
    window.speechSynthesis.speak(utterThis);

    if (navigator.vibrate) navigator.vibrate(50);
  };

  const playExample = (ex: { word: string, audioPath?: string }) => {
    if (ex.audioPath) {
      try {
        const audio = new Audio(`/letters/${ex.audioPath}`);
        audio.play().catch(() => playSynthetic(ex.word));
      } catch {
        playSynthetic(ex.word);
      }
    } else {
      playSynthetic(ex.word);
    }

    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
  };

  const playSynthetic = (text: string) => {
    const utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'es-ES';
    window.speechSynthesis.speak(utterThis);
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

          return (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playLetter(letter)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-3xl shadow-sm transition-all border-b-8 p-2
                ${isVowel
                  ? 'bg-rose-100 text-rose-600 border-rose-300 hover:bg-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
              `}
            >
              <span className={`${mode === 'vowels' ? 'text-6xl md:text-8xl' : 'text-4xl md:text-6xl'} font-black`}>
                {letter}
              </span>
            </motion.button>
          );
        })}
      </div>

      {activeLetter && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] w-full max-w-4xl p-8 relative shadow-2xl flex flex-col items-center border-8 border-blue-200"
          >
            <button
              onClick={() => setActiveLetter(null)}
              className="absolute top-6 right-6 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-500 p-3 rounded-full transition-colors"
            >
              <X size={32} strokeWidth={3} />
            </button>

            <h2 className="text-8xl md:text-[10rem] font-black text-blue-500 mb-8 drop-shadow-sm">
              {activeLetter}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
              {letterExamples[activeLetter]?.map((ex, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playExample(ex)}
                  className="bg-blue-50 border-b-8 border-blue-200 rounded-[2rem] p-6 flex flex-col items-center gap-4 hover:bg-blue-100 transition-colors"
                >
                  {ex.imagePath ? (
                    <img src={`/letters/${ex.imagePath}`} alt={ex.word} className="w-24 h-24 object-contain drop-shadow-md" />
                  ) : (
                    <span className="text-6xl md:text-7xl drop-shadow-md">{ex.icon}</span>
                  )}
                  <span className="text-xl md:text-2xl font-bold text-slate-700 bg-white px-4 py-2 rounded-full w-full">{ex.word}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
