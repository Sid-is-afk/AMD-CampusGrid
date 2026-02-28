"use client"

import { motion } from "framer-motion"
import {
  Users,
  Zap,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

interface StatCard {
  label: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  accent: "blue" | "orange" | "green" | "default"
}

function accentClasses(accent: StatCard["accent"]) {
  switch (accent) {
    case "blue":
      return { text: "text-neon-blue", bg: "bg-neon-blue/10", glow: "glow-blue" }
    case "orange":
      return { text: "text-neon-orange", bg: "bg-neon-orange/10", glow: "glow-orange" }
    case "green":
      return { text: "text-emerald-400", bg: "bg-emerald-500/10", glow: "" }
    default:
      return { text: "text-foreground", bg: "bg-secondary", glow: "" }
  }
}

interface StatsGridProps {
  /** Total campus-wide bids from the live sync hook */
  totalBids?: number
  /** Resources that still have available capacity */
  availableLabs?: number
  /** Whether the live data is still loading on first mount */
  isLoading?: boolean
}

export function StatsGrid({ totalBids, availableLabs, isLoading }: StatsGridProps) {
  const STATS: StatCard[] = [
    {
      label: "Campus Requests",
      value: isLoading ? "—" : String(totalBids ?? 0),
      change: "+live",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
      accent: "blue",
    },
    {
      label: "Available Labs",
      value: isLoading ? "—" : String(availableLabs ?? 0),
      change: "+live",
      trend: "up",
      icon: <Zap className="h-5 w-5" />,
      accent: "orange",
    },
    {
      label: "Avg Utilization",
      value: "78.3%",
      change: "+3.1%",
      trend: "up",
      icon: <TrendingUp className="h-5 w-5" />,
      accent: "green",
    },
    {
      label: "Avg Wait Time",
      value: "4.2m",
      change: "-18.5%",
      trend: "down",
      icon: <Clock className="h-5 w-5" />,
      accent: "blue",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat, index) => {
        const accent = accentClasses(stat.accent)
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="glass group rounded-xl p-5 transition-all hover:glass-strong"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg p-2.5 ${accent.bg}`}>
                <div className={accent.text}>{stat.icon}</div>
              </div>
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${stat.trend === "up"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-neon-orange/10 text-neon-orange"
                  }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className={`mt-1 font-mono text-2xl font-bold ${accent.text}`}>
              {stat.value}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}
