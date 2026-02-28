"use client"

import { motion } from "framer-motion"
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Clock,
} from "lucide-react"

interface ActivityItem {
  id: string
  message: string
  type: "success" | "warning" | "info" | "error"
  time: string
}

const ACTIVITIES: ActivityItem[] = [
  { id: "1", message: "GPU Lab capacity increased to 95%", type: "warning", time: "2m ago" },
  { id: "2", message: "Student #4492 request approved for CS Lab 301", type: "success", time: "5m ago" },
  { id: "3", message: "Library Zone A maintenance scheduled 10PM", type: "info", time: "12m ago" },
  { id: "4", message: "Sports Complex pool session fully booked", type: "error", time: "18m ago" },
  { id: "5", message: "System auto-balanced 23 resources across zones", type: "success", time: "25m ago" },
  { id: "6", message: "Peak hour detected - activating overflow protocol", type: "warning", time: "32m ago" },
  { id: "7", message: "New faculty account activated for Dr. Martinez", type: "info", time: "45m ago" },
  { id: "8", message: "CS Lab Room 102 utilization normalized", type: "success", time: "1h ago" },
]

function typeIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-neon-orange" />
    case "info":
      return <Info className="h-4 w-4 text-neon-blue" />
    case "error":
      return <XCircle className="h-4 w-4 text-destructive-foreground" />
  }
}

function typeBg(type: ActivityItem["type"]) {
  switch (type) {
    case "success":
      return "bg-emerald-500/10"
    case "warning":
      return "bg-neon-orange/10"
    case "info":
      return "bg-neon-blue/10"
    case "error":
      return "bg-destructive/10"
  }
}

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-xl"
    >
      <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-neon-blue" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
            Recent Activity
          </h3>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          LIVE FEED
        </span>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {ACTIVITIES.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
            className="flex items-start gap-3 border-b border-border/20 px-5 py-3 transition-colors last:border-0 hover:bg-secondary/20"
          >
            <div className={`mt-0.5 rounded-md p-1.5 ${typeBg(item.type)}`}>
              {typeIcon(item.type)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">{item.message}</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
