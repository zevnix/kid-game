"use client";

import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

interface ColorItem {
  id: string;
  name: string;
  bgClass: string;
  hexCode: string;
}

const COLORS: ColorItem[] = [
  { id: 'red', name: 'Rojo', bgClass: 'bg-red-500', hexCode: '#ef4444' },
  { id: 'blue', name: 'Azul', bgClass: 'bg-blue-500', hexCode: '#3b82f6' },
  { id: 'green', name: 'Verde', bgClass: 'bg-green-500', hexCode: '#22c55e' },
  { id: 'yellow', name: 'Amarillo', bgClass: 'bg-yellow-400', hexCode: '#facc15' },
  { id: 'orange', name: 'Naranja', bgClass: 'bg-orange-500', hexCode: '#f97316' },
  { id: 'purple', name: 'Morado', bgClass: 'bg-purple-500', hexCode: '#a855f7' },
  { id: 'pink', name: 'Rosa', bgClass: 'bg-pink-400', hexCode: '#f472b6' },
  { id: 'black', name: 'Negro', bgClass: 'bg-slate-900', hexCode: '#0f172a' },
];

export default function ColorsPage() {
  const [activeColor, setActiveColor] = useState<string | null>(null);

  const playColor = (color: ColorItem) => {
    setActiveColor(color.id);
    const utterThis = new SpeechSynthesisUtterance(color.name);
    utterThis.lang = 'es-ES';
    window.speechSynthesis.speak(utterThis);

    if (navigator.vibrate) navigator.vibrate(150);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: [color.hexCode]
    });

    setTimeout(() => setActiveColor(null), 1000);
  };

  return (
    <div>
      <Navigation title="Colores Mágicos" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {COLORS.map((color) => (
          <motion.button
            key={color.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playColor(color)}
            className={`
              aspect-square rounded-[2rem] flex flex-col items-center justify-end p-4 pb-6 shadow-md transition-transform
              ${color.bgClass}
              ${activeColor === color.id ? 'ring-8 ring-white ring-opacity-50' : ''}
            `}
          >
            <div className="bg-white/90 px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm">
              <span className="text-xl md:text-2xl font-bold text-slate-800">
                {color.name}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
