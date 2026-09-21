"use client";

import Link from "next/link";
import { Calculator, Type, Palette, Hexagon, Dog, Paintbrush, PenTool, Settings } from "lucide-react";
import Card from "@/components/Card";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";

export default function Home() {
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

      <div className="mt-12 flex justify-center">
        <Link href="/admin">
          <button className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-2xl font-bold transition-colors">
            <Settings size={20} />
            Panel de Padres
          </button>
        </Link>
      </div>
    </div>
  );
}
