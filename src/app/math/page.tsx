"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useStore } from "@/store/useStore";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

type Operation = "+" | "-" | "*" | "/";

export default function MathPage() {
  const { addStar, currentUser } = useStore();
  const [step, setStep] = useState<"choose_op" | "choose_diff" | "playing">("choose_op");
  const [selectedOp, setSelectedOp] = useState<Operation>("+");
  const [difficulty, setDifficulty] = useState(1); // 1: Fácil, 2: Medio, 3: Difícil

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [popupState, setPopupState] = useState<"correct" | "incorrect" | null>(null);

  // Calcular edad aproximada (si el usuario ingresó fecha de nacimiento) para pre-seleccionar dificultad
  useEffect(() => {
    if (currentUser?.birthDate) {
      // Retrasar ligeramente para evitar actualización síncrona en render
      const timeout = setTimeout(() => {
        const birthYear = new Date(currentUser.birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        if (age <= 5) setDifficulty(1);
        else if (age <= 8) setDifficulty(2);
        else setDifficulty(3);
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [currentUser]);

  const generateProblem = () => {
    const op = selectedOp;

    // Multiplicador base según dificultad
    const maxNumber = difficulty === 1 ? 10 : difficulty === 2 ? 30 : 100;

    let n1 = Math.floor(Math.random() * maxNumber) + 1;
    let n2 = Math.floor(Math.random() * maxNumber) + 1;

    if (op === "-") {
      if (n2 > n1) [n1, n2] = [n2, n1];
    } else if (op === "/") {
      const divisor = Math.floor(Math.random() * (difficulty === 1 ? 5 : 12)) + 1;
      n2 = divisor;
      n1 = n2 * (Math.floor(Math.random() * (difficulty === 1 ? 5 : 12)) + 1);
    } else if (op === "*") {
      n1 = Math.floor(Math.random() * (difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20)) + 1;
      n2 = Math.floor(Math.random() * (difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20)) + 1;
    }

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
    const maxOffset = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20;

    while (newOptions.size < 4) {
      const offset = Math.floor(Math.random() * maxOffset) + 1;
      const isAdd = Math.random() > 0.5;
      const wrong = isAdd ? correctAnswer + offset : correctAnswer - offset;
      if (wrong >= 0) newOptions.add(wrong);
    }

    setOptions(Array.from(newOptions).sort(() => Math.random() - 0.5));
    setPopupState(null);
  };

  useEffect(() => {
    if (step === "playing") {
      const timeout = setTimeout(() => {
        generateProblem();
      }, 0);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleAnswer = (ans: number) => {
    let correctAnswer = 0;
    switch (selectedOp) {
      case "+": correctAnswer = num1 + num2; break;
      case "-": correctAnswer = num1 - num2; break;
      case "*": correctAnswer = num1 * num2; break;
      case "/": correctAnswer = num1 / num2; break;
    }

    if (ans === correctAnswer) {
      setPopupState("correct");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const utterThis = new SpeechSynthesisUtterance("¡Muy bien!");
      utterThis.lang = 'es-ES';
      window.speechSynthesis.speak(utterThis);

      if (navigator.vibrate) navigator.vibrate(200);

      addStar();
      setTimeout(() => generateProblem(), 2000);
    } else {
      setPopupState("incorrect");
      const utterThis = new SpeechSynthesisUtterance("Intenta de nuevo");
      utterThis.lang = 'es-ES';
      window.speechSynthesis.speak(utterThis);

      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      setTimeout(() => setPopupState(null), 1500);
    }
  };

  return (
    <div>
      <Navigation title="Matemáticas" />

      {step === "choose_op" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center mt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-8 text-center">¿Qué operación quieres practicar?</h2>
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
            {(["+", "-", "*", "/"] as Operation[]).map(op => (
              <motion.button
                key={op}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setSelectedOp(op); setStep("choose_diff"); }}
                className="bg-blue-400 hover:bg-blue-500 text-white text-6xl font-bold py-10 rounded-[3rem] shadow-[0_8px_0_0_rgba(29,78,216,1)] active:shadow-[0_0px_0_0_rgba(29,78,216,1)] active:translate-y-2 transition-all"
              >
                {op === '*' ? '×' : op === '/' ? '÷' : op}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {step === "choose_diff" && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center mt-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-700 mb-8 text-center">Elige la dificultad</h2>
          <div className="flex flex-col gap-6 w-full max-w-md">
            {[1, 2, 3].map(lvl => (
              <motion.button
                key={lvl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setDifficulty(lvl); setStep("playing"); }}
                className={`py-6 rounded-3xl font-bold text-3xl shadow-[0_8px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-2 transition-all
                  ${lvl === 1 ? 'bg-emerald-400 text-emerald-900' : lvl === 2 ? 'bg-amber-400 text-amber-900' : 'bg-rose-400 text-rose-900'}
                  ${difficulty === lvl ? 'ring-4 ring-slate-800' : ''}
                `}
              >
                {lvl === 1 ? 'Fácil' : lvl === 2 ? 'Medio' : 'Difícil'}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {step === "playing" && (
        <div className="flex flex-col items-center mt-10 relative">
          <motion.div
            key={`${num1}${selectedOp}${num2}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl shadow-lg border-4 border-blue-200 mb-8"
          >
            <h2 className="text-6xl md:text-8xl font-bold text-slate-700 flex items-center gap-4">
              <span>{num1}</span>
              <span className="text-blue-500">
                {selectedOp === '*' ? '×' : selectedOp === '/' ? '÷' : selectedOp}
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
                disabled={popupState !== null}
                className="bg-blue-400 hover:bg-blue-500 text-white text-4xl md:text-5xl font-bold py-6 rounded-3xl shadow-[0_8px_0_0_rgba(29,78,216,1)] active:shadow-[0_0px_0_0_rgba(29,78,216,1)] active:translate-y-2 transition-all disabled:opacity-50"
              >
                {opt}
              </motion.button>
            ))}
          </div>

          {/* Popups de Respuesta */}
          {popupState === "correct" && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="bg-emerald-400 text-white text-5xl font-black px-12 py-8 rounded-[3rem] shadow-2xl rotate-[-5deg] border-8 border-emerald-200">
                ¡CORRECTO! 🌟
              </div>
            </motion.div>
          )}

          {popupState === "incorrect" && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="bg-rose-400 text-white text-5xl font-black px-12 py-8 rounded-[3rem] shadow-2xl rotate-[5deg] border-8 border-rose-200">
                ¡OH NO! 😅
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
