"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Zap,
  LayoutDashboard,
  Building2,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export type DashboardView = "overview" | "campus" | "orders" | "analytics" | "settings"

interface SidebarProps {
  currentView: DashboardView
  onViewChange: (view: DashboardView) => void
}

const NAV_ITEMS: { id: DashboardView; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "campus", label: "Campus Grid", icon: <Building2 className="h-5 w-5" /> },
  { id: "orders", label: "Order Book", icon: <ClipboardList className="h-5 w-5" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
]

export function DashboardSidebar({ currentView, onViewChange }: SidebarProps) {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = () => {
    signOut()
    router.push("/") // Redirects to your login page (change to "/login" if your route is different)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="glass-strong sticky top-0 z-40 hidden h-screen flex-col lg:flex"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-border/30 px-4 py-5">
            <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-neon-blue/10 glow-blue">
              <Zap className="h-5 w-5 text-neon-blue" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <h1 className="whitespace-nowrap text-base font-bold tracking-tight text-foreground glow-blue-text">
                    CampusGrid
                  </h1>
                  <p className="whitespace-nowrap text-[9px] uppercase tracking-widest text-muted-foreground">
                    Resource Engine
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4">
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = currentView === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                        ? "bg-neon-blue/10 text-neon-blue"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-lg border border-neon-blue/20 bg-neon-blue/10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex-shrink-0">{item.icon}</span>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          className="relative z-10 overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
          </nav>

          {/* User + Collapse */}
          <div className="border-t border-border/30 px-3 py-4">
            {/* User */}
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-secondary/30 px-3 py-2.5">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neon-blue/20">
                <User className="h-4 w-4 text-neon-blue" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="min-w-0 overflow-hidden"
                  >
                    <p className="truncate text-sm font-medium text-foreground">
                      {user?.name ?? "User"}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {user?.role ?? "Student"}
                    </p>
                    {user?.studentId && (
                      <p className="mt-0.5 truncate text-[9px] font-mono font-medium text-neon-blue">
                        {user.studentId}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Sign Out
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Collapse toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="mt-2 flex w-full items-center justify-center rounded-lg py-2 text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav */}
      <nav className="glass-strong fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border/30 px-2 py-2 lg:hidden">
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const isActive = currentView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-colors ${isActive ? "text-neon-blue" : "text-muted-foreground"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute inset-0 rounded-lg bg-neon-blue/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-muted-foreground transition-colors hover:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>
    </>
  )
}
