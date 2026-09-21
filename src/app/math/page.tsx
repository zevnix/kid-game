"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useStore } from "@/store/useStore";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

type Operation = "+" | "-" | "*" | "/";

export default function MathPage() {
  const { addStar, currentUser } = useStore();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedOps, setSelectedOps] = useState<Operation[]>(["+"]);
  const [difficulty, setDifficulty] = useState(1); // 1: Fácil, 2: Medio, 3: Difícil

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [currentOp, setCurrentOp] = useState<Operation>("+");
  const [options, setOptions] = useState<number[]>([]);
  const [message, setMessage] = useState("");

  // Calcular edad aproximada (si el usuario ingresó fecha de nacimiento)
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
    if (selectedOps.length === 0) return;
    const op = selectedOps[Math.floor(Math.random() * selectedOps.length)];

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

    setCurrentOp(op);
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
    setMessage("");
  };

  useEffect(() => {
    if (gameStarted) {
      const timeout = setTimeout(() => {
        generateProblem();
      }, 0);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]);

  const toggleOp = (op: Operation) => {
    if (selectedOps.includes(op)) {
      if (selectedOps.length > 1) setSelectedOps(selectedOps.filter(o => o !== op));
    } else {
      setSelectedOps([...selectedOps, op]);
    }
  };

  const handleAnswer = (ans: number) => {
    let correctAnswer = 0;
    switch (currentOp) {
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

      {!gameStarted ? (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm max-w-md mx-auto mt-10 border-4 border-slate-100">
          <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">Configura tu Juego</h2>

          <div className="mb-6">
            <label className="block font-bold text-slate-600 mb-3">¿Qué quieres practicar?</label>
            <div className="grid grid-cols-2 gap-3">
              {(["+", "-", "*", "/"] as Operation[]).map(op => (
                <button
                  key={op}
                  onClick={() => toggleOp(op)}
                  className={`p-4 rounded-xl text-3xl font-bold transition-colors ${
                    selectedOps.includes(op) ? 'bg-blue-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {op === '*' ? '×' : op === '/' ? '÷' : op}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block font-bold text-slate-600 mb-3">Nivel (Automático por edad)</label>
            <div className="flex gap-2">
              {[1, 2, 3].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setDifficulty(lvl)}
                  className={`flex-1 p-3 rounded-xl font-bold transition-colors ${
                    difficulty === lvl ? 'bg-amber-400 text-amber-900 shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {lvl === 1 ? 'Fácil' : lvl === 2 ? 'Medio' : 'Difícil'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setGameStarted(true)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold py-4 rounded-xl transition-transform hover:scale-105"
          >
            ¡Empezar a Jugar!
          </button>
        </div>
      ) : (
      <div className="flex flex-col items-center mt-10">
        <motion.div
          key={`${num1}${currentOp}${num2}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-lg border-4 border-blue-200 mb-8"
        >
          <h2 className="text-6xl md:text-8xl font-bold text-slate-700 flex items-center gap-4">
            <span>{num1}</span>
            <span className="text-blue-500">
              {currentOp === '*' ? '×' : currentOp === '/' ? '÷' : currentOp}
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
      )}
    </div>
  );
}
