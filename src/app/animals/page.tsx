"use client";

import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useStore, Animal } from "@/store/useStore";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function AnimalsPage() {
  const animals = useStore((state) => state.animals);
  const [activeAnimal, setActiveAnimal] = useState<string | null>(null);

  const playAnimal = (animal: Animal) => {
    setActiveAnimal(animal.id);

    // Primero dice el nombre
    const utterName = new SpeechSynthesisUtterance(animal.name);
    utterName.lang = 'es-ES';

    // Luego hace el sonido
    const utterSound = new SpeechSynthesisUtterance(animal.soundText);
    utterSound.lang = 'es-ES';
    utterSound.pitch = 1.5; // Hacer la voz un poco más aguda/divertida para sonidos

    window.speechSynthesis.speak(utterName);
    window.speechSynthesis.speak(utterSound);

    if (navigator.vibrate) navigator.vibrate([150, 50, 150]);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    setTimeout(() => setActiveAnimal(null), 1500);
  };

  return (
    <div>
      <Navigation title="Nuestros Amigos Animales" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {animals.map((animal) => (
          <motion.button
            key={animal.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => playAnimal(animal)}
            className="bg-emerald-100 border-b-8 border-emerald-300 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 hover:bg-emerald-200 transition-colors"
          >
            <motion.div
              className="text-7xl md:text-8xl"
              animate={activeAnimal === animal.id ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {animal.emoji}
            </motion.div>
            <span className="text-2xl md:text-3xl font-bold text-emerald-900 bg-white/60 px-4 py-2 rounded-full w-full">
              {animal.name}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
