"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  Cpu,
  Dumbbell,
  Users,
  Gauge,
  X,
  Map,
  Clock,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react"

interface Building {
  id: string
  name: string
  subtitle: string
  icon: React.ReactNode
  capacity: number
  currentLoad: number
  status: "Online" | "High Load" | "Maintenance"
  color: "blue" | "orange"
  zones: { name: string; usage: number }[]
}

const BUILDINGS: Building[] = [
  {
    id: "library",
    name: "Central Library",
    subtitle: "Knowledge Hub",
    icon: <BookOpen className="h-7 w-7" />,
    capacity: 500,
    currentLoad: 342,
    status: "Online",
    color: "blue",
    zones: [
      { name: "Zone A - Silent Study", usage: 89 },
      { name: "Zone B - Group Work", usage: 72 },
      { name: "Zone C - Digital Lab", usage: 58 },
    ],
  },
  {
    id: "cs-labs",
    name: "CS Labs",
    subtitle: "Computing Center",
    icon: <Cpu className="h-7 w-7" />,
    capacity: 200,
    currentLoad: 178,
    status: "High Load",
    color: "orange",
    zones: [
      { name: "Room 102 - General", usage: 95 },
      { name: "Room 301 - GPU Lab", usage: 88 },
      { name: "Room 205 - Networking", usage: 62 },
    ],
  },
  {
    id: "sports",
    name: "Sports Complex",
    subtitle: "Athletics Center",
    icon: <Dumbbell className="h-7 w-7" />,
    capacity: 350,
    currentLoad: 156,
    status: "Online",
    color: "blue",
    zones: [
      { name: "Main Gym", usage: 67 },
      { name: "Swimming Pool", usage: 45 },
      { name: "Court 1 & 2", usage: 38 },
    ],
  },
]

function UsageBar({ percentage }: { percentage: number }) {
  const color =
    percentage > 80
      ? "bg-neon-orange"
      : percentage > 50
        ? "bg-neon-blue"
        : "bg-emerald-500"

  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  )
}

function BuildingCard({
  building,
  isSelected,
  onSelect,
}: {
  building: Building
  isSelected: boolean
  onSelect: () => void
}) {
  const loadPercentage = Math.round(
    (building.currentLoad / building.capacity) * 100
  )
  const accentClass =
    building.color === "blue" ? "text-neon-blue" : "text-neon-orange"
  const glowClass =
    building.color === "blue" ? "glow-blue" : "glow-orange"
  const bgAccent =
    building.color === "blue" ? "bg-neon-blue/10" : "bg-neon-orange/10"

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{
        rotateX: -3,
        rotateY: 5,
        scale: 1.02,
        z: 20,
      }}
      whileTap={{ scale: 0.98 }}
      animate={
        isSelected
          ? { rotateX: 0, rotateY: 0, scale: 1.03 }
          : { rotateX: 0, rotateY: 0, scale: 1 }
      }
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
      className={`group relative w-full cursor-pointer rounded-xl text-left transition-all duration-300 ${isSelected ? `glass-strong ${glowClass}` : "glass hover:glass-strong"
        }`}
    >
      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className={`rounded-lg p-2.5 ${bgAccent}`}>
            <div className={accentClass}>{building.icon}</div>
          </div>
          <div
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${building.status === "High Load"
              ? "bg-neon-orange/15 text-neon-orange"
              : building.status === "Maintenance"
                ? "bg-destructive/15 text-destructive-foreground"
                : "bg-emerald-500/15 text-emerald-400"
              }`}
          >
            {building.status}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-foreground">
          {building.name}
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          {building.subtitle}
        </p>

        {/* Stats */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={`font-mono text-sm font-bold ${accentClass}`}>
              {building.currentLoad}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              / {building.capacity}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={`font-mono text-sm font-bold ${accentClass}`}>
              {loadPercentage}%
            </span>
          </div>
        </div>

        <UsageBar percentage={loadPercentage} />

        {/* Expanded Detail */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 border-t border-border/50 pt-4">
                <p className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Zone Utilization
                </p>
                <div className="flex flex-col gap-2.5">
                  {building.zones.map((zone) => (
                    <div key={zone.name}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-secondary-foreground">
                          {zone.name}
                        </span>
                        <span
                          className={`font-mono text-xs font-medium ${zone.usage > 80
                            ? "text-neon-orange"
                            : "text-neon-blue"
                            }`}
                        >
                          {zone.usage}%
                        </span>
                      </div>
                      <UsageBar percentage={zone.usage} />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

export function CampusGrid() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showPlanner, setShowPlanner] = useState(false)

  const schedule = [
    { time: "09:00 AM", event: "Machine Learning Class", location: "cs-labs", type: "class" },
    { time: "11:00 AM", event: "Study (Optimal)", location: "library", type: "ai-suggestion", save: "20 tokens" },
    { time: "01:00 PM", event: "Lunch break", location: "canteen", type: "break" },
    { time: "02:00 PM", event: "GPU Project Work", location: "cs-labs", type: "ai-suggestion", save: "Peak off-hours" },
    { time: "05:00 PM", event: "Gym Session", location: "sports", type: "leisure" }
  ]

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
            Campus Grid
          </h2>
          <p className="text-xs text-muted-foreground">
            Real-time building occupancy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPlanner(!showPlanner)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${showPlanner
              ? "border-neon-blue bg-neon-blue/20 text-neon-blue glow-blue"
              : "border-border/50 bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
          >
            <Map className="h-4 w-4" />
            Smart Planner
            {showPlanner && <Sparkles className="h-3 w-3" />}
          </button>
          {selectedId && !showPlanner && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-1 rounded-md border border-border/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Clear
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showPlanner ? (
          <motion.div
            key="planner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass rounded-xl p-6 border border-neon-blue/30"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-blue/20 text-neon-blue">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">AI Optimized Day</h3>
                <p className="text-xs text-muted-foreground">We routed your study sessions to save 45 tokens today.</p>
              </div>
            </div>

            <div className="relative pl-6">
              <div className="absolute bottom-0 left-[11px] top-2 z-0 w-0.5 bg-border/50" />

              <div className="flex flex-col gap-6">
                {schedule.map((item, i) => (
                  <div key={i} className="relative z-10 flex gap-4">
                    <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-background ${item.type === "ai-suggestion" ? "border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.3)]" : "border-border/50 text-muted-foreground"
                      }`}>
                      {item.type === "ai-suggestion" ? <Sparkles className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    </div>

                    <div className={`flex-1 rounded-lg border p-4 ${item.type === "ai-suggestion" ? "border-neon-blue/30 bg-neon-blue/5" : "border-border/30 bg-card/50"
                      }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-bold ${item.type === "ai-suggestion" ? "text-neon-blue" : "text-foreground"}`}>
                            {item.event}
                          </p>
                          <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {item.location}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">{item.time}</span>
                      </div>

                      {item.save && (
                        <div className="mt-3 flex items-center gap-1.5 rounded bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 w-fit">
                          <Zap className="h-3 w-3" />
                          AI Saved: {item.save}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {BUILDINGS.map((building, index) => (
              <BuildingCard
                key={building.id}
                building={building}
                isSelected={selectedId === building.id}
                onSelect={() =>
                  setSelectedId(
                    selectedId === building.id ? null : building.id
                  )
                }
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
