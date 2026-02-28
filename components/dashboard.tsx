"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { DashboardSidebar, type DashboardView } from "@/components/dashboard-sidebar"
import { StatsGrid } from "@/components/stats-grid"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { ActivityFeed } from "@/components/activity-feed"
import { CampusGrid } from "@/components/campus-grid"
import { LiveOrderBook } from "@/components/live-order-book"
import { BiddingTerminal } from "@/components/bidding-terminal"
import { OrderBookProvider } from "@/lib/order-book-context"
import { AIAssistantWidget } from "@/components/ai-assistant-widget"
import { SmartRecommendations } from "@/components/smart-recommendations"
import { useAuth } from "@/lib/auth-context"
import { useDashboardSync, type MyBid } from "@/hooks/use-dashboard-sync"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import {
  Search,
  Bell,
  ChevronDown,
  User,
  X,
  Settings,
  LogOut,
  UserCircle,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Trash2,
  Check,
  ExternalLink,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/* Notification types & data                                          */
/* ------------------------------------------------------------------ */

interface Notification {
  id: string
  title: string
  message: string
  type: "success" | "warning" | "info" | "error"
  time: string
  read: boolean
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "GPU Lab Capacity Alert",
    message: "GPU Lab capacity has reached 95%. Consider rescheduling non-urgent sessions.",
    type: "warning",
    time: "2m ago",
    read: false,
  },
  {
    id: "n2",
    title: "Request Approved",
    message: "Your CS Lab Room 301 reservation for tomorrow 2PM has been approved.",
    type: "success",
    time: "15m ago",
    read: false,
  },
  {
    id: "n3",
    title: "Scheduled Maintenance",
    message: "Library Zone A will undergo maintenance tonight from 10PM to 6AM.",
    type: "info",
    time: "1h ago",
    read: false,
  },
  {
    id: "n4",
    title: "Session Expired",
    message: "Your reserved slot at Sports Complex Court 1 has expired. Please rebook.",
    type: "error",
    time: "2h ago",
    read: true,
  },
  {
    id: "n5",
    title: "System Update Complete",
    message: "CampusGrid v2.4 deployed. New bidding algorithms are now active.",
    type: "info",
    time: "3h ago",
    read: true,
  },
]

function notifIcon(type: Notification["type"]) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-neon-orange" />
    case "info":
      return <Info className="h-4 w-4 text-neon-blue" />
    case "error":
      return <XCircle className="h-4 w-4 text-red-400" />
  }
}

function notifAccent(type: Notification["type"]) {
  switch (type) {
    case "success":
      return "bg-emerald-500/10 border-l-emerald-400"
    case "warning":
      return "bg-neon-orange/5 border-l-neon-orange"
    case "info":
      return "bg-neon-blue/5 border-l-neon-blue"
    case "error":
      return "bg-red-500/5 border-l-red-400"
  }
}

/* ------------------------------------------------------------------ */
/* Search data                                                        */
/* ------------------------------------------------------------------ */

const SEARCH_ITEMS = [
  { label: "GPU Lab", category: "Resource", view: "campus" as DashboardView },
  { label: "CS Lab - Room 102", category: "Resource", view: "campus" as DashboardView },
  { label: "CS Lab - Room 301", category: "Resource", view: "campus" as DashboardView },
  { label: "Library - Zone A", category: "Resource", view: "campus" as DashboardView },
  { label: "Library - Zone B", category: "Resource", view: "campus" as DashboardView },
  { label: "Sports Complex", category: "Resource", view: "campus" as DashboardView },
  { label: "Order Book", category: "Page", view: "orders" as DashboardView },
  { label: "Analytics Dashboard", category: "Page", view: "analytics" as DashboardView },
  { label: "Profile Settings", category: "Settings", view: "settings" as DashboardView },
  { label: "Notification Preferences", category: "Settings", view: "settings" as DashboardView },
]

/* ------------------------------------------------------------------ */
/* Shared hook: click outside                                         */
/* ------------------------------------------------------------------ */

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler()
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [ref, handler])
}

/* ------------------------------------------------------------------ */
/* NotificationPanel                                                  */
/* ------------------------------------------------------------------ */

function NotificationPanel({
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
  onDelete,
}: {
  notifications: Notification[]
  onClose: () => void
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
  onDelete: (id: string) => void
}) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="glass-strong absolute right-0 top-full z-50 mt-2 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-neon-blue" />
          <h3 className="text-sm font-bold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neon-orange px-1.5 font-mono text-[10px] font-bold text-accent-foreground">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-neon-blue transition-colors hover:bg-neon-blue/10"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
            aria-label="Close notifications"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Bell className="mb-2 h-8 w-8 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`group relative border-b border-border/20 border-l-2 px-4 py-3 transition-colors last:border-b-0 hover:bg-secondary/20 ${notifAccent(notif.type)} ${!notif.read ? "bg-secondary/10" : ""}`}
            >
              <div className="flex gap-3">
                <div className="mt-0.5 flex-shrink-0">{notifIcon(notif.type)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-neon-blue" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-muted-foreground/70">{notif.time}</span>
                    <div className="hidden items-center gap-1 group-hover:flex">
                      {!notif.read && (
                        <button
                          onClick={() => onMarkRead(notif.id)}
                          className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-neon-blue"
                          aria-label="Mark as read"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(notif.id)}
                        className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-red-400"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border/30 px-4 py-2.5">
        <button className="flex w-full items-center justify-center gap-1 rounded-md py-1 text-xs font-medium text-neon-blue transition-colors hover:bg-neon-blue/10">
          View all notifications
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* UserDropdown                                                       */
/* ------------------------------------------------------------------ */

function UserDropdown({
  onClose,
  onNavigate,
}: {
  onClose: () => void
  onNavigate: (view: DashboardView) => void
}) {
  const { user, signOut } = useAuth()
  const router = useRouter() // <-- 1. Initialize router

  function handleNav(view: DashboardView) {
    onNavigate(view)
    onClose()
  }

  function handleSignOut() {
    onClose()
    signOut()
    toast.info("Signed out successfully")
    router.push("/") // <-- 2. Add the redirect!
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="glass-strong absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl shadow-2xl"
    >
      {/* User info */}
      <div className="border-b border-border/30 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-blue/20">
            <User className="h-5 w-5 text-neon-blue" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{user?.name ?? "User"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email ?? ""}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-full bg-neon-blue/10 px-2 py-0.5 font-mono text-[10px] font-bold text-neon-blue">
            {user?.role ?? "Student"}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            ID: {user?.studentId ?? "N/A"}
          </span>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <button
          onClick={() => handleNav("settings")}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/30"
        >
          <UserCircle className="h-4 w-4 text-muted-foreground" />
          My Profile
        </button>
        {/* 3. Removed the redundant Settings button here */}
        <button
          onClick={() => handleNav("analytics")}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary/30"
        >
          <Shield className="h-4 w-4 text-muted-foreground" />
          My Activity
        </button>
      </div>

      {/* Sign out */}
      <div className="border-t border-border/30 py-1">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* SearchOverlay                                                      */
/* ------------------------------------------------------------------ */

function SearchOverlay({
  query,
  onSelect,
}: {
  query: string
  onSelect: (view: DashboardView) => void
}) {
  const filtered = SEARCH_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  )

  if (!query.trim() || filtered.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="glass-strong absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-lg shadow-2xl"
    >
      {filtered.map((item) => (
        <button
          key={item.label}
          onClick={() => onSelect(item.view)}
          className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-secondary/30"
        >
          <span className="text-sm text-foreground">{item.label}</span>
          <span className="rounded bg-secondary/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {item.category}
          </span>
        </button>
      ))}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* DashboardHeader                                                    */
/* ------------------------------------------------------------------ */

function DashboardHeader({
  currentView,
  onViewChange,
  totalBids,
  availableLabs,
  usageByResource,
  isLoading,
  myBids,
  prevBidsRef,
}: {
  currentView: DashboardView
  onViewChange: (view: DashboardView) => void
  totalBids: number
  availableLabs: number
  usageByResource: { name: string; bids: number }[]
  isLoading: boolean
  myBids: MyBid[]
  prevBidsRef: React.MutableRefObject<MyBid[]>
}) {
  const { user } = useAuth()

  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)

  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const closeNotif = useCallback(() => setNotifOpen(false), [])
  const closeUser = useCallback(() => setUserOpen(false), [])
  const closeSearch = useCallback(() => {
    setSearchFocused(false)
    setSearchQuery("")
  }, [])

  useClickOutside(notifRef, closeNotif)
  useClickOutside(userRef, closeUser)
  useClickOutside(searchRef, closeSearch)

  // ── Notification injection: detect bid status → 'approved' ─────────
  useEffect(() => {
    if (isLoading) return
    const prev = prevBidsRef.current
    if (prev.length === 0 && myBids.length > 0) {
      // First load — just snapshot, no notification
      prevBidsRef.current = myBids
      return
    }
    const newlyApproved = myBids.filter((bid) => {
      const old = prev.find((p) => p.id === bid.id)
      return (
        old &&
        old.status.toLowerCase() !== "approved" &&
        bid.status.toLowerCase() === "approved"
      )
    })
    if (newlyApproved.length > 0) {
      const generated: Notification[] = newlyApproved.map((bid) => ({
        id: `bid-approved-${bid.id}-${Date.now()}`,
        title: "Request Approved! 🎉",
        message: `Your bid #${bid.id} (Resource #${bid.resource_id}) has been approved.`,
        type: "success" as const,
        time: "just now",
        read: false,
      }))
      setNotifications((prev) => [...generated, ...prev])
    }
    prevBidsRef.current = myBids
    // We intentionally omit prevBidsRef from deps — it's a ref, not state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myBids, isLoading])
  // ───────────────────────────────────────────────────────────────────

  const unreadCount = notifications.filter((n) => !n.read).length

  function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    toast.success("All notifications marked as read")
  }

  function handleDeleteNotif(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.success("Notification removed")
  }

  function handleSearchSelect(view: DashboardView) {
    onViewChange(view)
    setSearchQuery("")
    setSearchFocused(false)
    toast.info(`Navigated to ${view}`)
  }

  const titles: Record<DashboardView, { title: string; subtitle: string }> = {
    overview: { title: "Dashboard Overview", subtitle: "Real-time campus resource monitoring" },
    campus: { title: "Campus Grid", subtitle: "Building occupancy and zone utilization" },
    orders: { title: "Order Book", subtitle: "Live resource request tracking" },
    analytics: { title: "Analytics", subtitle: "Usage metrics and performance data" },
    settings: { title: "Settings", subtitle: "Configure your dashboard preferences" },
  }

  const { title, subtitle } = titles[currentView]

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <motion.h1
          key={title}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-foreground md:text-2xl"
        >
          {title}
        </motion.h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Search */}
        <div ref={searchRef} className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            className={`h-9 w-64 rounded-lg border bg-input/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none ${searchFocused
              ? "border-neon-blue/50 ring-1 ring-neon-blue/20"
              : "border-border/50"
              }`}
          />
          <AnimatePresence>
            {searchFocused && searchQuery.trim() && (
              <SearchOverlay query={searchQuery} onSelect={handleSearchSelect} />
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setNotifOpen(!notifOpen)
              setUserOpen(false)
            }}
            className={`relative flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${notifOpen
              ? "border-neon-blue/50 bg-neon-blue/10 text-neon-blue"
              : "border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <motion.span
                key={unreadCount}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-neon-orange text-[9px] font-bold text-accent-foreground"
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <NotificationPanel
                notifications={notifications}
                onClose={() => setNotifOpen(false)}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
                onDelete={handleDeleteNotif}
              />
            )}
          </AnimatePresence>
        </div>

        {/* User dropdown */}
        <div ref={userRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setUserOpen(!userOpen)
              setNotifOpen(false)
            }}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors ${userOpen
              ? "border-neon-blue/50 bg-neon-blue/10"
              : "border-border/50 bg-secondary/30 hover:bg-secondary/50"
              }`}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neon-blue/20">
              <User className="h-3.5 w-3.5 text-neon-blue" />
            </div>
            <span className="hidden text-sm font-medium text-foreground md:block">
              {user?.name ?? "User"}
            </span>
            <ChevronDown
              className={`hidden h-3.5 w-3.5 text-muted-foreground transition-transform md:block ${userOpen ? "rotate-180" : ""
                }`}
            />
          </motion.button>

          <AnimatePresence>
            {userOpen && (
              <UserDropdown
                onClose={() => setUserOpen(false)}
                onNavigate={(view) => {
                  onViewChange(view)
                  setUserOpen(false)
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* View components                                                    */
/* ------------------------------------------------------------------ */

interface LiveDataProps {
  totalBids: number
  availableLabs: number
  usageByResource: { name: string; bids: number }[]
  isLoading: boolean
}

function OverviewView({ totalBids, availableLabs, usageByResource, isLoading }: LiveDataProps) {
  return (
    <div className="flex flex-col gap-6">
      <StatsGrid totalBids={totalBids} availableLabs={availableLabs} isLoading={isLoading} />
      <SmartRecommendations />
      <AnalyticsCharts usageByResource={usageByResource} />
      <ActivityFeed />
    </div>
  )
}

function CampusView() {
  return (
    <div className="flex flex-col gap-6">
      <CampusGrid />
    </div>
  )
}

function OrdersView() {
  return (
    <div className="flex flex-col gap-6">
      <SmartRecommendations />
      <div className="glass min-h-[500px] overflow-hidden rounded-xl">
        <LiveOrderBook />
      </div>
      <BiddingTerminal />
    </div>
  )
}

function AnalyticsView({ totalBids, availableLabs, usageByResource, isLoading }: LiveDataProps) {
  return (
    <div className="flex flex-col gap-6">
      <StatsGrid totalBids={totalBids} availableLabs={availableLabs} isLoading={isLoading} />
      <AnalyticsCharts usageByResource={usageByResource} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Settings Toggle                                                    */
/* ------------------------------------------------------------------ */

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? "bg-neon-blue" : "bg-secondary"
        }`}
    >
      <motion.span
        animate={{ x: enabled ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 h-4 w-4 rounded-full bg-foreground shadow-sm"
      />
    </button>
  )
}

function SettingsView() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [saved, setSaved] = useState(false)

  const [prefs, setPrefs] = useState({
    availability: true,
    statusUpdates: true,
    announcements: false,
    emailDigest: false,
  })

  function handleSaveProfile() {
    setSaved(true)
    toast.success("Profile updated successfully")
    setTimeout(() => setSaved(false), 2000)
  }

  function togglePref(key: keyof typeof prefs) {
    setPrefs((prev) => {
      const newVal = !prev[key]
      toast.info(
        `${key === "availability" ? "Availability alerts" : key === "statusUpdates" ? "Status updates" : key === "announcements" ? "System announcements" : "Email digest"} ${newVal ? "enabled" : "disabled"}`
      )
      return { ...prev, [key]: newVal }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">
          Profile Settings
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-lg border border-border/50 bg-input/50 px-3 text-sm text-foreground focus:border-neon-blue/50 focus:outline-none focus:ring-1 focus:ring-neon-blue/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-lg border border-border/50 bg-input/50 px-3 text-sm text-foreground focus:border-neon-blue/50 focus:outline-none focus:ring-1 focus:ring-neon-blue/20"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Role</label>
            <input
              type="text"
              defaultValue={user?.role ?? "Student"}
              disabled
              className="h-10 rounded-lg border border-border/50 bg-input/30 px-3 text-sm text-muted-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Student ID</label>
            <input
              type="text"
              defaultValue={user?.studentId ?? ""}
              disabled
              className="h-10 rounded-lg border border-border/50 bg-input/30 px-3 font-mono text-sm text-muted-foreground"
            />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveProfile}
            className="flex items-center gap-2 rounded-lg bg-neon-blue px-5 py-2.5 font-mono text-sm font-bold text-primary-foreground transition-colors glow-blue hover:bg-neon-blue/90"
          >
            {saved ? <Check className="h-4 w-4" /> : null}
            {saved ? "Saved" : "Save Changes"}
          </motion.button>
          <button className="rounded-lg border border-border/50 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground">
            Cancel
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-6"
      >
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-foreground">
          Notification Preferences
        </h3>
        <div className="flex flex-col gap-3">
          {[
            {
              key: "availability" as const,
              label: "Resource availability alerts",
              desc: "Get notified when a resource becomes available",
            },
            {
              key: "statusUpdates" as const,
              label: "Request status updates",
              desc: "Receive updates on your resource requests",
            },
            {
              key: "announcements" as const,
              label: "System announcements",
              desc: "Important campus grid announcements",
            },
            {
              key: "emailDigest" as const,
              label: "Daily email digest",
              desc: "Receive a daily summary of activity via email",
            },
          ].map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between rounded-lg bg-secondary/20 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <Toggle enabled={prefs[pref.key]} onChange={() => togglePref(pref.key)} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-xl border-red-500/20 p-6"
      >
        <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-red-400">
          Danger Zone
        </h3>
        <p className="mb-4 text-xs text-muted-foreground">
          These actions are destructive and cannot be undone.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => toast.info("This is a demo. Data export would be triggered here.")}
            className="rounded-lg border border-border/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/50"
          >
            Export My Data
          </button>
          <button
            onClick={() => toast.error("This is a demo. Account deletion is not available.")}
            className="rounded-lg border border-red-500/30 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Main Dashboard                                                     */
/* ------------------------------------------------------------------ */

export function Dashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>("overview")
  const { totalBids, availableLabs, usageByResource, isLoading, myBids, prevBidsRef } = useDashboardSync()

  return (
    <OrderBookProvider>
      <div className="grid-bg flex min-h-screen">
        {/* Sidebar */}
        <DashboardSidebar currentView={currentView} onViewChange={setCurrentView} />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col pb-20 lg:pb-0">
          <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6 md:px-8">
            <DashboardHeader
              currentView={currentView}
              onViewChange={setCurrentView}
              totalBids={totalBids}
              availableLabs={availableLabs}
              usageByResource={usageByResource}
              isLoading={isLoading}
              myBids={myBids}
              prevBidsRef={prevBidsRef}
            />

            {/* View Content */}
            <div className="mt-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {currentView === "overview" && (
                    <OverviewView
                      totalBids={totalBids}
                      availableLabs={availableLabs}
                      usageByResource={usageByResource}
                      isLoading={isLoading}
                    />
                  )}
                  {currentView === "campus" && <CampusView />}
                  {currentView === "orders" && <OrdersView />}
                  {currentView === "analytics" && (
                    <AnalyticsView
                      totalBids={totalBids}
                      availableLabs={availableLabs}
                      usageByResource={usageByResource}
                      isLoading={isLoading}
                    />
                  )}
                  {currentView === "settings" && <SettingsView />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        <AIAssistantWidget />
      </div>
    </OrderBookProvider>
  )
}
