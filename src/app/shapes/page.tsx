"use client";

import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

interface ShapeItem {
  id: string;
  name: string;
  svg: React.ReactNode;
}

const SHAPES: ShapeItem[] = [
  {
    id: 'circle',
    name: 'Círculo',
    svg: <circle cx="50" cy="50" r="45" fill="#f43f5e" />
  },
  {
    id: 'square',
    name: 'Cuadrado',
    svg: <rect x="10" y="10" width="80" height="80" rx="10" fill="#3b82f6" />
  },
  {
    id: 'triangle',
    name: 'Triángulo',
    svg: <polygon points="50,10 90,90 10,90" fill="#22c55e" strokeLinejoin="round" />
  },
  {
    id: 'star',
    name: 'Estrella',
    svg: <polygon points="50,5 61,35 95,35 68,54 78,85 50,65 22,85 32,54 5,35 39,35" fill="#eab308" strokeLinejoin="round" />
  }
];

export default function ShapesPage() {
  const [activeShape, setActiveShape] = useState<string | null>(null);

  const playShape = (shape: ShapeItem) => {
    setActiveShape(shape.id);
    const utterThis = new SpeechSynthesisUtterance(shape.name);
    utterThis.lang = 'es-ES';
    window.speechSynthesis.speak(utterThis);

    if (navigator.vibrate) navigator.vibrate(100);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => setActiveShape(null), 1000);
  };

  return (
    <div>
      <Navigation title="Formas Divertidas" />

      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
        {SHAPES.map((shape) => (
          <motion.button
            key={shape.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playShape(shape)}
            className="bg-white rounded-[3rem] p-8 shadow-sm border-4 border-slate-100 flex flex-col items-center justify-center gap-6"
          >
            <motion.svg
              viewBox="0 0 100 100"
              className="w-32 h-32 md:w-40 md:h-40 drop-shadow-md"
              animate={activeShape === shape.id ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {shape.svg}
            </motion.svg>
            <span className="text-2xl md:text-3xl font-bold text-slate-700">
              {shape.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
