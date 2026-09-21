"use client";

import { useRef, useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { Eraser, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/store/useStore";

const COLORS = ["#000000", "#ef4444", "#3b82f6", "#22c55e", "#facc15", "#f97316", "#a855f7", "#ec4899"];
const SIZES = [5, 10, 15, 20];

export default function DrawPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[1]);
  const [isEraser, setIsEraser] = useState(false);
  const { addStar } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Ajustar resolución para retina displays
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Establecer un fondo blanco
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? "#ffffff" : color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      // Premiar aleatoriamente
      if (Math.random() > 0.8) {
        addStar();
        confetti({ particleCount: 20, spread: 30, origin: { y: 1 } });
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      <Navigation title="Dibujo Libre" />

      <div className="flex-1 flex flex-col md:flex-row gap-4 mb-4 min-h-0">
        <div className="bg-white p-4 rounded-3xl shadow-sm flex md:flex-col gap-4 overflow-x-auto">
          {/* Herramientas */}
          <div className="flex md:flex-col gap-2 border-r md:border-r-0 md:border-b pr-4 md:pr-0 md:pb-4 border-slate-200">
            <button
              onClick={clearCanvas}
              className="p-3 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200"
            >
              <Trash2 size={24} />
            </button>
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`p-3 rounded-2xl transition-colors ${
                isEraser ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Eraser size={24} />
            </button>
          </div>

          {/* Tamaños */}
          <div className="flex md:flex-col gap-2 items-center justify-center border-r md:border-r-0 md:border-b pr-4 md:pr-0 md:pb-4 border-slate-200">
            {SIZES.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-10 h-10 flex items-center justify-center rounded-full ${size === s ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
              >
                <div className="bg-slate-800 rounded-full" style={{ width: s, height: s }} />
              </button>
            ))}
          </div>

          {/* Colores */}
          <div className="flex md:flex-col gap-2">
            {COLORS.map(c => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setColor(c); setIsEraser(false); }}
                className={`w-10 h-10 rounded-full border-2 ${color === c && !isEraser ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Canvas container */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm overflow-hidden border-4 border-slate-200 relative touch-none">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full object-contain bg-white cursor-crosshair touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}
