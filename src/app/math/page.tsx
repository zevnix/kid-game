"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useStore } from "@/store/useStore";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

type Operation = "+" | "-" | "*" | "/";

export default function MathPage() {
  const { addStar } = useStore();
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState<Operation>("+");
  const [options, setOptions] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  const generateProblem = () => {
    const ops: Operation[] = ["+", "-", "*", "/"];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1 = Math.floor(Math.random() * 10) + 1;
    let n2 = Math.floor(Math.random() * 10) + 1;

    // Simplificar para niños
    if (op === "-") {
      if (n2 > n1) [n1, n2] = [n2, n1]; // Evitar negativos
    } else if (op === "/") {
      n1 = n1 * n2; // Asegurar división exacta
    } else if (op === "*") {
      n1 = Math.floor(Math.random() * 5) + 1; // Números más pequeños
      n2 = Math.floor(Math.random() * 5) + 1;
    }

    setOperation(op);
    setNum1(n1);
    setNum2(n2);

    let correctAnswer = 0;
    switch (op) {
      case "+": correctAnswer = n1 + n2; break;
      case "-": correctAnswer = n1 - n2; break;
      case "*": correctAnswer = n1 * n2; break;
      case "/": correctAnswer = n1 / n2; break;
    }

    // Generar opciones falsas
    const newOptions = new Set([correctAnswer]);
    while (newOptions.size < 4) {
      const offset = Math.floor(Math.random() * 5) + 1;
      const isAdd = Math.random() > 0.5;
      const wrong = isAdd ? correctAnswer + offset : correctAnswer - offset;
      if (wrong >= 0) newOptions.add(wrong);
    }

    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
    setMessage("");
  };

  useEffect(() => {
    // Inicialización del juego - solo corre una vez
    const timeout = setTimeout(() => {
      generateProblem();
    }, 0);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (ans: number) => {
    let correctAnswer = 0;
    switch (operation) {
      case "+": correctAnswer = num1 + num2; break;
      case "-": correctAnswer = num1 - num2; break;
      case "*": correctAnswer = num1 * num2; break;
      case "/": correctAnswer = num1 / num2; break;
    }

    if (ans === correctAnswer) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const utterThis = new SpeechSynthesisUtterance("¡Muy bien!");
      utterThis.lang = 'es-ES';
      window.speechSynthesis.speak(utterThis);

      if (navigator.vibrate) navigator.vibrate(200);

      setMessage("¡Correcto! 🌟");
      addStar();
      setTimeout(() => generateProblem(), 1500);
    } else {
      const utterThis = new SpeechSynthesisUtterance("Intenta de nuevo");
      utterThis.lang = 'es-ES';
      window.speechSynthesis.speak(utterThis);

      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      setMessage("¡Ups! Intenta otra vez.");
    }
  };

  return (
    <div>
      <Navigation title="Matemáticas" />

      <div className="flex flex-col items-center mt-10">
        <motion.div
          key={`${num1}${operation}${num2}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-lg border-4 border-blue-200 mb-8"
        >
          <h2 className="text-6xl md:text-8xl font-bold text-slate-700 flex items-center gap-4">
            <span>{num1}</span>
            <span className="text-blue-500">
              {operation === '*' ? '×' : operation === '/' ? '÷' : operation}
            </span>
            <span>{num2}</span>
            <span className="text-blue-500">=</span>
            <span className="text-slate-300">?</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAnswer(opt)}
              className="bg-blue-400 hover:bg-blue-500 text-white text-4xl md:text-5xl font-bold py-6 rounded-3xl shadow-[0_8px_0_0_rgba(29,78,216,1)] active:shadow-[0_0px_0_0_rgba(29,78,216,1)] active:translate-y-2 transition-all"
            >
              {opt}
            </motion.button>
          ))}
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-2xl md:text-3xl font-bold text-slate-700 text-center bg-white/80 px-6 py-3 rounded-full"
          >
            {message}
          </motion.div>
        )}
      </div>
    </div>
  );
}
