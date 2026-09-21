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

    // Preparado para archivos MP3 reales en el futuro:
    // const audio = new Audio(`/sounds/colors/${color.id}.mp3`);
    // audio.play();

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
        {COLORS.map((color, idx) => (
          <motion.button
            key={color.id}
            whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 5 : -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playColor(color)}
            className="relative aspect-square flex flex-col items-center justify-center p-4 transition-transform group"
          >
            {/* SVG orgánico tipo "mancha" o globo en lugar de un cuadrado */}
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className={`absolute inset-0 w-full h-full drop-shadow-xl transition-all duration-300 ${activeColor === color.id ? 'scale-110 drop-shadow-2xl' : ''}`}
            >
              <path
                fill={color.hexCode}
                d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90.1,-16.3,88.5,-1.6C86.9,13.1,81,26.2,73.1,38.5C65.2,50.8,55.4,62.2,43,70.5C30.6,78.8,15.3,83.9,0.3,83.4C-14.7,82.9,-29.3,76.8,-42.6,68.9C-55.9,61,-67.9,51.2,-76.6,38.9C-85.3,26.6,-90.7,13.3,-89.7,0.6C-88.7,-12.1,-81.4,-24.2,-73.4,-35.5C-65.4,-46.8,-56.7,-57.3,-45,-65.4C-33.3,-73.5,-16.6,-79.1,-0.1,-79C16.5,-78.9,30.5,-83.6,44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>

            <div className={`
              z-10 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-[2rem] shadow-sm border-4 transition-all
              ${activeColor === color.id ? 'scale-110' : ''}
            `}
            style={{ borderColor: color.hexCode }}>
              <span className="text-xl md:text-3xl font-black text-slate-800" style={{ color: color.hexCode }}>
                {color.name}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
