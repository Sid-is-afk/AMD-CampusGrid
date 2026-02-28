"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Send,
  ChevronDown,
  Gauge,
  Zap,
} from "lucide-react"
import { useOrderBook } from "@/lib/order-book-context"

// Match your SQLAlchemy model structure
interface CampusResource {
  id: number
  name: string
  resource_type: string
  available_capacity: number
}

function UrgencyLabel({ value }: { value: number }) {
  if (value <= 33) return { text: "Low", color: "text-emerald-400" }
  if (value <= 66) return { text: "Medium", color: "text-neon-blue" }
  return { text: "High", color: "text-neon-orange" }
}

export function BiddingTerminal() {
  // Pull resources and addOrder directly from your context "brain"
  const { addOrder, resources } = useOrderBook()
  
  const [selectedResource, setSelectedResource] = useState<CampusResource | null>(null)
  const [urgency, setUrgency] = useState(50)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const urgencyInfo = UrgencyLabel({ value: urgency })

  async function handleSubmit() {
    if (!selectedResource) {
      toast.error("Please select a resource before submitting.")
      return
    }

    setIsSubmitting(true)

    const priority: "High" | "Medium" | "Low" =
      urgency > 66 ? "High" : urgency > 33 ? "Medium" : "Low"

    try {
      // Pass the actual resource ID to the context handler
      await addOrder(selectedResource.id.toString(), priority)

      setIsSubmitting(false)
      setSelectedResource(null)
      setUrgency(50)

      toast.success("Request submitted successfully", {
        description: `${selectedResource.name} - Priority: ${priority}`,
        duration: 4000,
      })
    } catch (error) {
      toast.error("Failed to submit request. Check your connection.")
      setIsSubmitting(false)
    }
  }

  return (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-strong sticky bottom-0 z-40 rounded-xl"
    >
      <div className="px-4 py-3 md:px-6">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-neon-orange" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground">
            Bidding Terminal
          </h2>
          <div className="ml-auto font-mono text-[10px] text-muted-foreground">
            SESSION ACTIVE
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Resource Selector */}
          <div className="flex-1">
            <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-muted-foreground">
              Select Resource
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-input px-3 py-2.5 text-sm text-foreground transition-all hover:border-neon-blue/30 focus:border-neon-blue/50 focus:outline-none focus:ring-1 focus:ring-neon-blue/20"
              >
                <span className={selectedResource ? "text-foreground" : "text-muted-foreground"}>
                  {selectedResource ? selectedResource.name : "Choose a campus resource..."}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute bottom-full left-0 z-50 mb-1 max-h-48 w-full overflow-y-auto rounded-lg border border-border/50 bg-card shadow-2xl"
                  >
                    {resources.length === 0 ? (
                      <div className="px-3 py-4 text-center text-xs text-muted-foreground font-mono">
                        SYNCING RESOURCES...
                      </div>
                    ) : (
                      resources.map((resource) => (
                        <button
                          key={resource.id}
                          type="button"
                          onClick={() => {
                            setSelectedResource(resource)
                            setIsDropdownOpen(false)
                          }}
                          className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-secondary ${
                            selectedResource?.id === resource.id ? "bg-neon-blue/10 text-neon-blue" : "text-foreground"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span>{resource.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {resource.available_capacity} units available
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Urgency Slider */}
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Urgency Level</label>
              <div className="flex items-center gap-1.5">
                <Gauge className="h-3 w-3 text-muted-foreground" />
                <span className={`font-mono text-xs font-bold ${urgencyInfo.color}`}>{urgencyInfo.text}</span>
              </div>
            </div>
            <div className="relative py-1">
              <input
                type="range"
                min={0}
                max={100}
                value={urgency}
                onChange={(e) => setUrgency(Number(e.target.value))}
                className="w-full cursor-pointer appearance-none rounded-full bg-secondary accent-neon-blue"
              />
              <div className="pointer-events-none absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-neon-blue/30" style={{ width: `${urgency}%` }} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex-shrink-0">
            <motion.button
              onClick={handleSubmit}
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg px-6 font-mono text-sm font-bold uppercase tracking-wider transition-all md:w-auto ${
                isSubmitting ? "bg-neon-blue/20 text-neon-blue/50" : "bg-neon-blue text-primary-foreground glow-blue hover:bg-neon-blue/90"
              }`}
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Request
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}