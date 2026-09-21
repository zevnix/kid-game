"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

interface NavigationProps {
  title?: string;
  showBack?: boolean;
}

export default function Navigation({ title, showBack = true }: NavigationProps) {
  const stars = useStore((state) => state.stars);

  return (
    <nav className="flex items-center justify-between mb-8 bg-white/80 p-4 rounded-3xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-4">
        {showBack && (
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-rose-400 text-white p-3 rounded-2xl shadow-md hover:bg-rose-500 transition-colors"
            >
              <ArrowLeft size={28} className="stroke-[3]" />
            </motion.div>
          </Link>
        )}
        {title && (
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-2xl border-2 border-amber-300">
        <Star className="text-amber-500 fill-amber-500" size={24} />
        <span className="text-2xl font-bold text-amber-600">{stars}</span>
      </div>
    </nav>
  );
}
