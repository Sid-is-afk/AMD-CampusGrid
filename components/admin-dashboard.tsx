"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Users, Activity, Settings, AlertTriangle, TrendingUp, Cpu, Server, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { StatsGrid } from "@/components/stats-grid"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function AdminDashboard() {
    const { user } = useAuth()
    const router = useRouter()

    // State for AI Recommendation Weight overrides
    const [weights, setWeights] = useState({
        price: 0.5,
        distance: 0.7,
        availability: 0.9,
        trafficRedirect: false
    })

    // Simulated Global Metrics
    const globalMetrics = {
        activeUsers: 452,
        totalBids: 1845,
        tokenVelocity: 14500, // tokens spent per hour
        systemLoad: 68 // percentage
    }

    const handleUpdateWeights = () => {
        toast.success("AI Recommendation weights updated successfully.")
        toast.info("Routing traffic patterns have been dynamically adjusted.")
    }

    const handleMaintenanceMode = (resourceId: string) => {
        toast.warning(`Resource ${resourceId} put into maintenance. All active bids cancelled.`)
        // In a real app we'd dispatch this to the backend
    }

    if (user?.role !== "Admin") {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="glass max-w-md rounded-2xl p-8 text-center border-red-500/20">
                    <Shield className="mx-auto h-12 w-12 text-red-400 mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        You need administrator privileges to view this section.
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="rounded-lg bg-secondary px-6 py-2 text-sm font-medium text-foreground hover:bg-secondary/70 transition-colors"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen flex-col pb-20 lg:pb-0">
            <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6 md:px-8">
                {/* Header */}
                <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon-orange/20">
                                <Shield className="h-5 w-5 text-neon-orange" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">Global perspective & AI system controls</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/30 px-4 py-2">
                            <Activity className="h-4 w-4 text-emerald-400" />
                            <span className="text-sm font-medium text-foreground">System Status: Optimal</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* Main Top Stats */}
                    <div className="md:col-span-12">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Users className="h-5 w-5 text-neon-blue" />
                                    <h3 className="text-sm font-medium text-muted-foreground">Active Sessions</h3>
                                </div>
                                <p className="text-3xl font-bold text-foreground font-mono">{globalMetrics.activeUsers}</p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+12% from last hour</span>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Activity className="h-5 w-5 text-neon-orange" />
                                    <h3 className="text-sm font-medium text-muted-foreground">Total Bids Processed</h3>
                                </div>
                                <p className="text-3xl font-bold text-foreground font-mono">{globalMetrics.totalBids}</p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+54 since morning</span>
                                </div>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Cpu className="h-5 w-5 text-purple-400" />
                                    <h3 className="text-sm font-medium text-muted-foreground">Token Velocity</h3>
                                </div>
                                <p className="text-3xl font-bold text-foreground font-mono">{globalMetrics.tokenVelocity.toLocaleString()}</p>
                                <span className="text-xs text-muted-foreground mt-2 block">Tokens exchanged / hr</span>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-6 border border-emerald-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Server className="h-5 w-5 text-emerald-400" />
                                    <h3 className="text-sm font-medium text-muted-foreground">Global Server Load</h3>
                                </div>
                                <p className="text-3xl font-bold text-foreground font-mono">{globalMetrics.systemLoad}%</p>
                                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                                    <div className="h-full rounded-full bg-emerald-400" style={{ width: `${globalMetrics.systemLoad}%` }} />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* AI Controls */}
                    <div className="md:col-span-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-6 h-full border border-neon-blue/20">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-foreground">AI Routing Controls</h2>
                                    <p className="text-sm text-muted-foreground">Adjust recommendation weights to shape campus traffic.</p>
                                </div>
                                <div className="rounded-full bg-neon-blue/10 px-3 py-1 text-xs font-bold text-neon-blue">
                                    Active
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-foreground">Price Sensitivity (Token Budget)</label>
                                            <span className="text-xs font-mono text-neon-blue">{weights.price.toFixed(2)}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={weights.price}
                                            onChange={(e) => setWeights({ ...weights, price: parseFloat(e.target.value) })}
                                            className="w-full accent-neon-blue"
                                        />
                                        <p className="text-[10px] text-muted-foreground mt-1">Higher values strongly recommend cheaper options.</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-foreground">Proximity / Distance Factor</label>
                                            <span className="text-xs font-mono text-neon-blue">{weights.distance.toFixed(2)}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={weights.distance}
                                            onChange={(e) => setWeights({ ...weights, distance: parseFloat(e.target.value) })}
                                            className="w-full accent-neon-blue"
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-medium text-foreground">Availability Focus</label>
                                            <span className="text-xs font-mono text-neon-blue">{weights.availability.toFixed(2)}</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.1"
                                            value={weights.availability}
                                            onChange={(e) => setWeights({ ...weights, availability: parseFloat(e.target.value) })}
                                            className="w-full accent-neon-blue"
                                        />
                                        <p className="text-[10px] text-muted-foreground mt-1">Force system to route students away from crowded labs.</p>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-end gap-6 bg-secondary/10 p-5 rounded-xl border border-border/50">
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neon-orange/20 text-neon-orange`}>
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-sm">Traffic Redirect Mode</h4>
                                            <p className="text-xs text-muted-foreground mt-1 mb-3">
                                                Activating this forces the AI to aggressively push traffic to newly opened or underutilized sectors (e.g., Library Zone C).
                                            </p>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" className="accent-neon-orange h-4 w-4"
                                                    checked={weights.trafficRedirect}
                                                    onChange={(e) => setWeights({ ...weights, trafficRedirect: e.target.checked })}
                                                />
                                                <span className="text-sm font-medium">Enable Global Redirect</span>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleUpdateWeights}
                                        className="w-full rounded-lg bg-neon-blue py-3 text-sm font-bold text-primary-foreground shadow-lg transition-colors hover:bg-neon-blue/90 glow-blue mt-4"
                                    >
                                        Deploy New Training Weights
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Actions / Edge cases */}
                    <div className="md:col-span-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass rounded-xl p-6 h-full border-red-500/10">
                            <h2 className="text-lg font-bold text-foreground mb-4">Emergency Overrides</h2>
                            <p className="text-xs text-muted-foreground mb-6">Manually intervene in standard AI routing processes.</p>

                            <div className="space-y-4">
                                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-red-400">Lockdown Node</span>
                                        <AlertTriangle className="h-4 w-4 text-red-400" />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mb-3">Instantly cancel bids and route users away.</p>
                                    <select
                                        title="Select Resource"
                                        className="w-full bg-input/50 border border-border/50 rounded-md p-2 text-sm text-foreground mb-2 focus:outline-none focus:border-red-400/50"
                                    >
                                        <option value="">Select Resource...</option>
                                        <option value="cs-labs-301">CS Lab - Room 301</option>
                                        <option value="sports-pool">Sports - Pool</option>
                                    </select>
                                    <button
                                        onClick={() => handleMaintenanceMode("CS-Labs-301")}
                                        className="w-full bg-red-500/20 text-red-400 border border-red-500/30 rounded-md py-2 text-xs font-bold hover:bg-red-500/30 transition-colors"
                                    >
                                        Set Maintenance Mode
                                    </button>
                                </div>

                                <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-bold text-foreground">Flag Abnormal Account</span>
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <input type="text" placeholder="Enter Student ID" className="w-full bg-input/50 border border-border/50 rounded-md p-2 text-sm text-foreground mb-2 focus:outline-none" />
                                    <button className="w-full bg-secondary/50 text-foreground border border-border/50 rounded-md py-2 text-xs font-bold hover:bg-secondary transition-colors">
                                        Review Account
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
