"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Activity, TrendingUp } from "lucide-react"
import type { UsageEntry } from "@/hooks/use-dashboard-sync"

// ─── Static decorative data for the area chart ───────────────────────────────
// We have no time-series data in the DB, so this chart remains illustrative.
const USAGE_DATA = [
  { time: "06:00", library: 120, csLab: 45, sports: 30 },
  { time: "08:00", library: 280, csLab: 120, sports: 80 },
  { time: "10:00", library: 420, csLab: 180, sports: 150 },
  { time: "12:00", library: 380, csLab: 160, sports: 220 },
  { time: "14:00", library: 450, csLab: 195, sports: 180 },
  { time: "16:00", library: 350, csLab: 170, sports: 250 },
  { time: "18:00", library: 280, csLab: 140, sports: 300 },
  { time: "20:00", library: 200, csLab: 80, sports: 120 },
  { time: "22:00", library: 90, csLab: 30, sports: 40 },
]

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload) return null
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-mono font-bold text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full mr-1.5"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}:{" "}
          <span className="font-mono font-medium text-foreground">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface AnalyticsChartsProps {
  /** Live bid-count-per-resource from the dashboard sync hook */
  usageByResource?: UsageEntry[]
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AnalyticsCharts({ usageByResource = [] }: AnalyticsChartsProps) {
  // Map the live data to a shape suitable for BarChart
  const resourceDemandData = usageByResource.map((entry) => ({
    // Shorten long names for readability on the XAxis
    name: entry.name.length > 12 ? entry.name.slice(0, 11) + "…" : entry.name,
    bids: entry.bids,
  }))

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      {/* ── Area Chart: Usage Over Time (illustrative) ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-neon-blue" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Usage Over Time
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-neon-blue" />
              <span className="text-[10px] text-muted-foreground">Library</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-neon-orange" />
              <span className="text-[10px] text-muted-foreground">CS Lab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-muted-foreground">Sports</span>
            </div>
          </div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={USAGE_DATA}>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.2 250)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.7 0.2 250)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 55)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260 / 0.5)" />
              <XAxis
                dataKey="time"
                tick={{ fill: "oklch(0.6 0.01 250)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.6 0.01 250)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="library"
                name="Library"
                stroke="oklch(0.7 0.2 250)"
                fill="url(#gradBlue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="csLab"
                name="CS Lab"
                stroke="oklch(0.72 0.18 55)"
                fill="url(#gradOrange)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="sports"
                name="Sports"
                stroke="#34d399"
                fill="url(#gradGreen)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Bar Chart: Resource Demand (LIVE) ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-5"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-neon-orange" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Resource Demand
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-neon-blue" />
            <span className="text-[10px] text-muted-foreground">Total Bids</span>
          </div>
        </div>

        <div className="h-[260px]">
          {resourceDemandData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No bid data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceDemandData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.01 260 / 0.5)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "oklch(0.6 0.01 250)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "oklch(0.6 0.01 250)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="bids"
                  name="Bids"
                  fill="oklch(0.7 0.2 250)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </div>
  )
}
