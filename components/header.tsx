"use client"

import { motion } from "framer-motion"
import {
  Zap,
  User,
  Activity,
  Wifi,
} from "lucide-react"

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-strong sticky top-0 z-50 px-4 py-3 md:px-6"
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-neon-blue/10 glow-blue">
            <Zap className="h-5 w-5 text-neon-blue" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground glow-blue-text">
              CampusGrid
            </h1>
            <p className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
              Resource Allocation Engine
            </p>
          </div>
        </div>

        {/* Center: Live Status */}
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-2 md:flex">
            <Activity className="h-4 w-4 text-neon-orange" />
            <span className="font-mono text-xs text-muted-foreground">
              LOAD: <span className="text-neon-orange glow-orange-text">78.3%</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-xs font-medium text-emerald-400">
              LIVE
            </span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Wifi className="h-4 w-4 text-neon-blue" />
            <span className="font-mono text-xs text-muted-foreground">
              <span className="text-neon-blue">2,847</span> Active
            </span>
          </div>
        </div>

        {/* Profile */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/50 px-3 py-2 transition-colors hover:border-neon-blue/30 hover:bg-secondary"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neon-blue/20">
            <User className="h-4 w-4 text-neon-blue" />
          </div>
          <span className="hidden text-sm font-medium text-foreground md:block">
            Admin
          </span>
        </motion.button>
      </div>
    </motion.header>
  )
}
