"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ICON_MAP = {
  chart: BarChart3,
  clock: Clock,
  check: CheckCircle,
  close: XCircle,
} as const;

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof ICON_MAP;
  color: string;
  delay?: number;
}

export default function StatCard({
  title,
  value,
  icon,
  color,
  delay = 0,
}: StatCardProps) {
  const Icon = ICON_MAP[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 p-6"
    >
      <div className="absolute right-4 top-4 opacity-10">
        <Icon className="h-16 w-16" style={{ color }} />
      </div>

      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-tighter text-zinc-500">
          {title}
        </p>
        <p
          className="mt-2 text-3xl font-bold tracking-tighter"
          style={{ color }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}