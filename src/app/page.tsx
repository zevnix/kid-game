"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Type, Palette, Hexagon, Dog, Paintbrush, PenTool, Settings, LogOut, Play } from "lucide-react";
import Card from "@/components/Card";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function Home() {
  const { currentUser, loginUser, logoutUser } = useStore();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && birthDate) {
      loginUser({ name, birthDate });
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center -mt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border-8 border-blue-200 max-w-md w-full"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-8">
            ¡Hola! 👋
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label className="block text-xl font-bold text-slate-600 mb-2">¿Cómo te llamas?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-2xl border-4 border-slate-100 text-2xl font-bold text-slate-700 outline-none focus:border-blue-400"
                placeholder="Tu nombre..."
                required
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-slate-600 mb-2">Tu fecha de nacimiento</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-4 rounded-2xl border-4 border-slate-100 text-xl font-bold text-slate-700 outline-none focus:border-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 rounded-2xl text-2xl flex items-center justify-center gap-3 transition-transform hover:scale-105"
            >
              <Play fill="currentColor" />
              ¡A Jugar!
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const games = [
    { href: "/math", title: "Matemáticas", icon: Calculator, color: "blue" as const },
    { href: "/letters", title: "Letras", icon: Type, color: "rose" as const },
    { href: "/colors", title: "Colores", icon: Palette, color: "purple" as const },
    { href: "/shapes", title: "Formas", icon: Hexagon, color: "cyan" as const },
    { href: "/animals", title: "Animales", icon: Dog, color: "amber" as const },
    { href: "/draw", title: "Dibujar", icon: Paintbrush, color: "green" as const },
    { href: "/color", title: "Pintar", icon: PenTool, color: "orange" as const },
  ];

  return (
    <div className="min-h-screen">
      <Navigation title="¡Aprende Jugando!" showBack={false} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {games.map((game) => (
          <Link key={game.href} href={game.href} className="block w-full h-full">
            <Card color={game.color} className="h-48">
              <game.icon size={64} className="stroke-[2.5]" />
              <h2 className="text-xl md:text-2xl font-bold text-center">{game.title}</h2>
            </Card>
          </Link>
        ))}
      </motion.div>

      <div className="mt-12 flex justify-center gap-4">
        <Link href="/admin">
          <button className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-2xl font-bold transition-colors">
            <Settings size={20} />
            Panel de Padres
          </button>
        </Link>
        <button
          onClick={logoutUser}
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-600 px-6 py-3 rounded-2xl font-bold transition-colors"
        >
          <LogOut size={20} />
          Salir
        </button>
      </div>
    </div>
  );
}
