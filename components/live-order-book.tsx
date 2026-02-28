"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowUpRight,
  Clock,
  Terminal,
} from "lucide-react"
import { useOrderBook, type OrderEntry } from "@/lib/order-book-context"
import { useEffect, useState } from "react"

function formatTimestamp(date: Date): string {
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 5) return "Just now"
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function PriorityBadge({ priority }: { priority: OrderEntry["priority"] }) {
  const styles = {
    High: "bg-neon-orange/15 text-neon-orange border-neon-orange/20",
    Medium: "bg-neon-blue/15 text-neon-blue border-neon-blue/20",
    Low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  }

  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${styles[priority]}`}
    >
      {priority}
    </span>
  )
}

function StatusDot({ status }: { status: OrderEntry["status"] }) {
  const colors: Record<OrderEntry["status"], string> = {
    Pending: "bg-amber-400",
    Approved: "bg-emerald-400",
    Processing: "bg-neon-blue",
  }

  return (
    <span className="relative flex h-2 w-2">
      {status === "Processing" && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colors[status]} opacity-75`}
        />
      )}
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${colors[status]}`}
      />
    </span>
  )
}

function OrderRow({ order, index }: { order: OrderEntry; index: number }) {
  // Initialize with a consistent default that won't cause hydration mismatch
  const [timeString, setTimeString] = useState<string | null>(null)

  useEffect(() => {
    // Only set time string on client after mount
    setTimeString(formatTimestamp(order.timestamp))
    const interval = setInterval(() => {
      setTimeString(formatTimestamp(order.timestamp))
    }, 5000)
    return () => clearInterval(interval)
  }, [order.timestamp])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: "auto" }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className="group border-b border-border/30 transition-colors last:border-0 hover:bg-secondary/30"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Status */}
        <StatusDot status={order.status} />

        {/* Main Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              ID {order.studentId}
            </span>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground/50" />
            <span className="truncate text-sm font-medium text-foreground">
              {order.resource}
            </span>
          </div>
        </div>

        {/* Priority & Time */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <PriorityBadge priority={order.priority} />
          {timeString && (
            <div className="hidden items-center gap-1 sm:flex">
              <Clock className="h-3 w-3 text-muted-foreground/50" />
              <span className="font-mono text-[11px] text-muted-foreground">
                {timeString}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function LiveOrderBook() {
  const { orders } = useOrderBook()

  return (
    <section className="flex h-full flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-neon-blue" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
            Live Order Book
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-orange opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-orange" />
          </span>
          <span className="font-mono text-[10px] text-neon-orange">
            {orders.length} ENTRIES
          </span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="flex items-center gap-3 border-b border-border/30 px-4 py-2">
        <span className="w-2" />
        <span className="flex-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          Request
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Priority
        </span>
        <span className="hidden text-[10px] uppercase tracking-widest text-muted-foreground sm:block">
          Time
        </span>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence initial={false}>
          {orders.map((order, index) => (
            <OrderRow key={order.id} order={order} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Terminal Footer */}
      <div className="border-t border-border/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-muted-foreground">
            {">"} STREAM ACTIVE
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            LATENCY:{" "}
            <span className="text-emerald-400">12ms</span>
          </span>
        </div>
      </div>
    </section>
  )
}
