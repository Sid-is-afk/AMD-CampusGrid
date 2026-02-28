"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, HelpingHand, MapPin, Wallet, Zap } from "lucide-react"
import { useDashboardSync } from "@/hooks/use-dashboard-sync"
import { useOrderBook } from "@/lib/order-book-context"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"

interface Recommendation {
    id: string
    resourceId: string
    name: string
    type: string
    price: number
    reasoning: {
        icon: any
        text: string
        color: string
    }
}

export function SmartRecommendations() {
    const { usageByResource } = useDashboardSync()
    const { addOrder } = useOrderBook()
    const { user } = useAuth()
    const [recommendations, setRecommendations] = useState<Recommendation[]>([])
    const [isBooking, setIsBooking] = useState<string | null>(null)

    useEffect(() => {
        // Generate intelligent recommendations based on live data
        // In a real app this would call an AI backend endpoint passing the usageByResource
        // Here we simulate the AI agent's decision making for the hackathon

        const balance = user?.balance ?? 1000
        const newRecs: Recommendation[] = []

        // 1. Budget Recommendation
        if (balance < 100) {
            newRecs.push({
                id: "rec-1",
                resourceId: "5", // Library Zone B
                name: "Library - Zone B",
                type: "Study Area",
                price: 10,
                reasoning: {
                    icon: Wallet,
                    text: `Fits your ${balance} token budget perfectly.`,
                    color: "text-emerald-400"
                }
            })
        } else {
            newRecs.push({
                id: "rec-1",
                resourceId: "3", // CS Lab 301
                name: "CS Lab - Room 301",
                type: "Workstation",
                price: 40,
                reasoning: {
                    icon: Zap,
                    text: "Optimal balance of performance and cost.",
                    color: "text-neon-blue"
                }
            })
        }

        // 2. Proximity/Availability Recommendation
        // Let's pretend GPU lab is highly utilized, so we recommend something else nearby
        const gpuUsage = usageByResource.find(r => r.name === "GPU Lab")?.bids || 0
        if (gpuUsage > 5) {
            newRecs.push({
                id: "rec-2",
                resourceId: "2", // CS Lab 102
                name: "CS Lab - Room 102",
                type: "Workstation",
                price: 30,
                reasoning: {
                    icon: MapPin,
                    text: "GPU Lab is busy. This is nearby with available seats for ML tasks.",
                    color: "text-neon-orange"
                }
            })
        } else {
            newRecs.push({
                id: "rec-2",
                resourceId: "1", // GPU Lab
                name: "GPU Lab",
                type: "High-Performance",
                price: 150,
                reasoning: {
                    icon: Sparkles,
                    text: "Unusually low utilization right now. Grab it!",
                    color: "text-purple-400"
                }
            })
        }

        setRecommendations(newRecs)
    }, [usageByResource, user])

    const handleBook = async (rec: Recommendation) => {
        setIsBooking(rec.id)
        try {
            const priority = rec.price > 40 ? "High" : rec.price >= 20 ? "Medium" : "Low"
            await addOrder(rec.resourceId, priority)
            toast.success(`Reserved ${rec.name} for ${rec.price} tokens.`)
        } catch (e) {
            toast.error("Failed to place reservation.")
        } finally {
            setIsBooking(null)
        }
    }

    if (recommendations.length === 0) return null

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-neon-blue" />
                <h3 className="text-lg font-bold text-foreground">AI Smart Suggestions</h3>
                <span className="ml-2 rounded-full bg-neon-blue/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-blue">
                    Live
                </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <AnimatePresence>
                    {recommendations.map((rec, i) => (
                        <motion.div
                            key={rec.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative overflow-hidden rounded-xl border border-neon-blue/20 bg-background/50 p-5 backdrop-blur-sm transition-all hover:border-neon-blue/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]"
                        >
                            <div className="mb-3 flex items-start justify-between">
                                <div>
                                    <h4 className="font-bold text-foreground">{rec.name}</h4>
                                    <p className="text-xs text-muted-foreground">{rec.type}</p>
                                </div>
                                <div className="flex items-center gap-1 rounded-md bg-secondary/50 px-2 py-1">
                                    <span className="font-mono text-xs font-bold text-neon-blue">{rec.price}</span>
                                    <span className="text-[10px] text-muted-foreground">🪙/hr</span>
                                </div>
                            </div>

                            {/* Transparent "Why this?" Section */}
                            <div className="mb-4 rounded-lg bg-secondary/30 p-3">
                                <div className="mb-1 flex items-center gap-1.5">
                                    <HelpingHand className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="text-xs font-medium text-foreground">Why this?</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="mt-0.5">
                                        <rec.reasoning.icon className={`h-4 w-4 ${rec.reasoning.color}`} />
                                    </div>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {rec.reasoning.text}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleBook(rec)}
                                disabled={isBooking === rec.id}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-neon-blue/10 py-2.5 text-sm font-bold text-neon-blue transition-colors hover:bg-neon-blue/20 disabled:opacity-50"
                            >
                                {isBooking === rec.id ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="h-4 w-4 rounded-full border-2 border-neon-blue border-t-transparent"
                                    />
                                ) : (
                                    <>
                                        Reserve Now
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
