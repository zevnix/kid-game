"use client";

import Navigation from "@/components/Navigation";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#facc15", "#f97316", "#a855f7", "#ec4899", "#ffffff", "#000000"];

export default function ColorPage() {
  const drawings = useStore((state) => state.drawings);
  const { addStar } = useStore();

  const [selectedDrawing, setSelectedDrawing] = useState(drawings[0]);
  const [activeColor, setActiveColor] = useState(COLORS[0]);

  // Estado local para los colores de las partes del dibujo seleccionado
  // Clave: índice del path, Valor: color
  const [pathColors, setPathColors] = useState<Record<number, string>>({});

  const handlePathClick = (index: number) => {
    setPathColors(prev => ({ ...prev, [index]: activeColor }));
    if (navigator.vibrate) navigator.vibrate(50);

    // Aleatoriamente dar estrellas al colorear
    // eslint-disable-next-line react-hooks/purity
    if (Math.random() > 0.7) {
       addStar();
       confetti({ particleCount: 20, spread: 30, origin: { y: 1 } });
    }
  };

  const handleSelectDrawing = (drawing: typeof drawings[0]) => {
    setSelectedDrawing(drawing);
    setPathColors({});
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <Navigation title="Pintar Dibujos" />

      <div className="flex-1 flex flex-col md:flex-row gap-6 mb-6 min-h-0">
        {/* Selector de dibujos y colores */}
        <div className="flex flex-col gap-6 md:w-48">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-3 text-center">Dibujos</h3>
            <div className="flex md:flex-col gap-2 overflow-x-auto">
              {drawings.map(d => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDrawing(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                    selectedDrawing.id === d.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex-1">
            <h3 className="font-bold text-slate-700 mb-3 text-center">Colores</h3>
            <div className="grid grid-cols-4 md:grid-cols-2 gap-3 justify-items-center">
              {COLORS.map(c => (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveColor(c)}
                  className={`w-10 h-10 rounded-full border-2 ${activeColor === c ? 'border-slate-800 scale-110' : 'border-slate-200'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Lienzo de coloreo */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border-4 border-slate-200 flex items-center justify-center p-4 overflow-hidden relative">
          {selectedDrawing ? (
            <svg
              viewBox={selectedDrawing.viewBox || "0 0 100 100"}
              className="w-full h-full max-h-[70vh] drop-shadow-sm touch-none"
              preserveAspectRatio="xMidYMid meet"
            >
              {selectedDrawing.svgPaths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill={pathColors[i] || "transparent"}
                  stroke="#1e293b"
                  strokeWidth={selectedDrawing.viewBox ? "2" : "1.5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cursor-pointer transition-colors duration-300 hover:opacity-80"
                  onClick={() => handlePathClick(i)}
                  onTouchStart={(e) => { e.preventDefault(); handlePathClick(i); }}
                />
              ))}
            </svg>
          ) : (
            <p className="text-slate-400 font-bold text-xl">Selecciona un dibujo</p>
          )}
        </div>
      </div>
    </div>
  );
}
