"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  color?: "blue" | "green" | "rose" | "purple" | "amber" | "cyan" | "orange";
}

const colorMap = {
  blue: "bg-blue-200 border-blue-400 hover:bg-blue-300 text-blue-900",
  green: "bg-green-200 border-green-400 hover:bg-green-300 text-green-900",
  rose: "bg-rose-200 border-rose-400 hover:bg-rose-300 text-rose-900",
  purple: "bg-purple-200 border-purple-400 hover:bg-purple-300 text-purple-900",
  amber: "bg-amber-200 border-amber-400 hover:bg-amber-300 text-amber-900",
  cyan: "bg-cyan-200 border-cyan-400 hover:bg-cyan-300 text-cyan-900",
  orange: "bg-orange-200 border-orange-400 hover:bg-orange-300 text-orange-900",
};

export default function Card({ children, className, onClick, color = "blue" }: CardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        "cursor-pointer rounded-[2rem] border-b-8 p-6 flex flex-col items-center justify-center gap-4 transition-colors",
        colorMap[color],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
