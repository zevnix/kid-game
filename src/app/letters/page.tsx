"use client";

import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

import { X } from "lucide-react";

type Example = { word: string, icon: string };

const LETTER_EXAMPLES: Record<string, Example[]> = {
  "A": [{ word: "Araña", icon: "🕷️" }, { word: "Árbol", icon: "🌳" }, { word: "Avión", icon: "✈️" }, { word: "Abeja", icon: "🐝" }, { word: "Anillo", icon: "💍" }],
  "B": [{ word: "Barco", icon: "⛵" }, { word: "Búho", icon: "🦉" }, { word: "Balón", icon: "⚽" }, { word: "Bicicleta", icon: "🚲" }, { word: "Bota", icon: "👢" }],
  "C": [{ word: "Coche", icon: "🚗" }, { word: "Casa", icon: "🏠" }, { word: "Cerdo", icon: "🐷" }, { word: "Cereza", icon: "🍒" }, { word: "Cama", icon: "🛏️" }],
  "D": [{ word: "Dado", icon: "🎲" }, { word: "Delfín", icon: "🐬" }, { word: "Dedo", icon: "👆" }, { word: "Dinosaurio", icon: "🦖" }, { word: "Dulce", icon: "🍬" }],
  "E": [{ word: "Elefante", icon: "🐘" }, { word: "Estrella", icon: "⭐" }, { word: "Escoba", icon: "🧹" }, { word: "Espejo", icon: "🪞" }, { word: "Erizo", icon: "🦔" }],
  "F": [{ word: "Fresa", icon: "🍓" }, { word: "Fuego", icon: "🔥" }, { word: "Flor", icon: "🌻" }, { word: "Foca", icon: "🦭" }, { word: "Fantasma", icon: "👻" }],
  "G": [{ word: "Gato", icon: "🐱" }, { word: "Gallo", icon: "🐓" }, { word: "Globo", icon: "🎈" }, { word: "Guitarra", icon: "🎸" }, { word: "Galleta", icon: "🍪" }],
  "H": [{ word: "Hielo", icon: "🧊" }, { word: "Helado", icon: "🍦" }, { word: "Hueso", icon: "🦴" }, { word: "Hongo", icon: "🍄" }, { word: "Hada", icon: "🧚" }],
  "I": [{ word: "Isla", icon: "🏝️" }, { word: "Iguana", icon: "🦎" }, { word: "Imán", icon: "🧲" }, { word: "Iglesia", icon: "⛪" }, { word: "Insecto", icon: "🐛" }],
  "J": [{ word: "Jirafa", icon: "🦒" }, { word: "Jugo", icon: "🧃" }, { word: "Juguete", icon: "🧸" }, { word: "Jaula", icon: "🪤" }, { word: "Jabón", icon: "🧼" }],
  "K": [{ word: "Koala", icon: "🐨" }, { word: "Kiwi", icon: "🥝" }, { word: "Karate", icon: "🥋" }, { word: "Kayak", icon: "🛶" }, { word: "Kiosko", icon: "🛖" }],
  "L": [{ word: "Luna", icon: "🌙" }, { word: "León", icon: "🦁" }, { word: "Lápiz", icon: "✏️" }, { word: "Loro", icon: "🦜" }, { word: "Libro", icon: "📖" }],
  "M": [{ word: "Manzana", icon: "🍎" }, { word: "Mono", icon: "🐒" }, { word: "Mariposa", icon: "🦋" }, { word: "Mano", icon: "🖐️" }, { word: "Mesa", icon: "🪵" }],
  "N": [{ word: "Nube", icon: "☁️" }, { word: "Naranja", icon: "🍊" }, { word: "Niño", icon: "👦" }, { word: "Nido", icon: "🪹" }, { word: "Nieve", icon: "❄️" }],
  "O": [{ word: "Oso", icon: "🐻" }, { word: "Ojo", icon: "👁️" }, { word: "Oveja", icon: "🐑" }, { word: "Oruga", icon: "🐛" }, { word: "Oreja", icon: "👂" }],
  "P": [{ word: "Perro", icon: "🐶" }, { word: "Pato", icon: "🦆" }, { word: "Pelota", icon: "🏀" }, { word: "Pez", icon: "🐟" }, { word: "Pera", icon: "🍐" }],
  "Q": [{ word: "Queso", icon: "🧀" }, { word: "Químico", icon: "🧪" }, { word: "Quetzal", icon: "🐦" }, { word: "Quince", icon: "1️⃣5️⃣" }, { word: "Quiosco", icon: "🏪" }],
  "R": [{ word: "Ratón", icon: "🐭" }, { word: "Rana", icon: "🐸" }, { word: "Reloj", icon: "⌚" }, { word: "Rosa", icon: "🌹" }, { word: "Regalo", icon: "🎁" }],
  "S": [{ word: "Sol", icon: "☀️" }, { word: "Sapo", icon: "🐸" }, { word: "Silla", icon: "🪑" }, { word: "Serpiente", icon: "🐍" }, { word: "Sombrero", icon: "🎩" }],
  "T": [{ word: "Tren", icon: "🚂" }, { word: "Tigre", icon: "🐯" }, { word: "Taza", icon: "☕" }, { word: "Tomate", icon: "🍅" }, { word: "Tijera", icon: "✂️" }],
  "U": [{ word: "Uva", icon: "🍇" }, { word: "Unicornio", icon: "🦄" }, { word: "Uña", icon: "💅" }, { word: "Universo", icon: "🌌" }, { word: "Urna", icon: "🗳️" }],
  "V": [{ word: "Vaca", icon: "🐄" }, { word: "Vaso", icon: "🥛" }, { word: "Vestido", icon: "👗" }, { word: "Volcán", icon: "🌋" }, { word: "Violín", icon: "🎻" }],
  "W": [{ word: "Waffle", icon: "🧇" }, { word: "Wifi", icon: "📶" }, { word: "Waterpolo", icon: "🤽" }, { word: "Web", icon: "🕸️" }, { word: "Windsurf", icon: "🏄" }],
  "X": [{ word: "Xilófono", icon: "🎹" }, { word: "Rayos X", icon: "🩻" }], // Algunas letras tienen menos
  "Y": [{ word: "Yoyo", icon: "🪀" }, { word: "Yate", icon: "🛥️" }, { word: "Yogur", icon: "🍦" }, { word: "Yema", icon: "🥚" }],
  "Z": [{ word: "Zorro", icon: "🦊" }, { word: "Zapato", icon: "👞" }, { word: "Zanahoria", icon: "🥕" }, { word: "Zoológico", icon: "🦒" }, { word: "Zafiro", icon: "💎" }]
};

export default function LettersPage() {
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

  const playExample = (word: string) => {
    const utterThis = new SpeechSynthesisUtterance(word);
    utterThis.lang = 'es-ES';
    window.speechSynthesis.speak(utterThis);

    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
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
              {LETTER_EXAMPLES[activeLetter]?.map((ex, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playExample(ex.word)}
                  className="bg-blue-50 border-b-8 border-blue-200 rounded-[2rem] p-6 flex flex-col items-center gap-4 hover:bg-blue-100 transition-colors"
                >
                  <span className="text-6xl md:text-7xl drop-shadow-md">{ex.icon}</span>
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
