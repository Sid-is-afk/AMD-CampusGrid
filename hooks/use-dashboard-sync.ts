"use client"

import { useState, useEffect, useRef, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MyBid {
    id: number
    resource_id: number
    bid_amount: number
    status: string
    created_at: string | null
}

export interface UsageEntry {
    name: string
    bids: number
}

export interface DashboardSyncData {
    totalBids: number
    availableLabs: number
    myBids: MyBid[]
    usageByResource: UsageEntry[]
    isLoading: boolean
    error: string | null
    /** Called by consumers that want to detect status changes (e.g. notifications) */
    prevBidsRef: React.MutableRefObject<MyBid[]>
}

const API_BASE = "http://127.0.0.1:8000"
const POLL_INTERVAL_MS = 5_000

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDashboardSync(): DashboardSyncData {
    const [totalBids, setTotalBids] = useState(0)
    const [availableLabs, setAvailableLabs] = useState(0)
    const [myBids, setMyBids] = useState<MyBid[]>([])
    const [usageByResource, setUsageByResource] = useState<UsageEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    /**
     * prevBidsRef stores the snapshot from the *previous* poll cycle so callers
     * can diff against it without triggering re-renders (a ref, not state).
     */
    const prevBidsRef = useRef<MyBid[]>([])

    const fetchSync = useCallback(async () => {
        const token = localStorage.getItem("access_token")
        if (!token) {
            setIsLoading(false)
            return
        }

        try {
            const res = await fetch(`${API_BASE}/dashboard/sync`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                if (res.status === 401) {
                    // Token expired — log out and stop polling
                    localStorage.removeItem("access_token")
                    localStorage.removeItem("user")
                    window.location.href = "/"
                    setError("Session expired. Please log in again.")
                } else {
                    setError(`Server error: ${res.status}`)
                }
                return
            }

            const data = await res.json()

            setTotalBids(data.total_bids ?? 0)
            setAvailableLabs(data.available_labs ?? 0)
            setMyBids(data.my_bids ?? [])
            setUsageByResource(data.usage_by_resource ?? [])
            setError(null)
        } catch {
            // Network unreachable — show error but don't crash
            setError("Backend unreachable")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        // Initial fetch
        fetchSync()

        const intervalId = setInterval(fetchSync, POLL_INTERVAL_MS)
        return () => clearInterval(intervalId)
        // fetchSync has a stable identity (useCallback with no deps) — safe dep
    }, [fetchSync])

    return {
        totalBids,
        availableLabs,
        myBids,
        usageByResource,
        isLoading,
        error,
        prevBidsRef,
    }
}
