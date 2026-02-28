"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export interface OrderEntry {
  id: string
  studentId: string
  resource: string
  priority: "High" | "Medium" | "Low"
  timestamp: Date
  status: "Pending" | "Approved" | "Processing" | string
}

interface OrderBookContextType {
  orders: OrderEntry[]
  resources: any[]
  addOrder: (resource: string, priority: "High" | "Medium" | "Low") => void
  fetchOrders: () => Promise<void>
}

const OrderBookContext = createContext<OrderBookContextType | null>(null)

export function OrderBookProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<OrderEntry[]>([])
  const [resources, setResources] = useState<any[]>([])
  const [isLoadingNames, setIsLoadingNames] = useState(true)

  // 1. Fetch live data from Python!
  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) return

      const response = await fetch("http://127.0.0.1:8000/bids", {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 401) {
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        window.location.href = "/"
        return
      }

      if (response.ok) {
        const data = await response.json()

        const formattedOrders: OrderEntry[] = data.map((bid: any) => {
          // Use the resources state directly
          const resourceObj = resources.find(r => r.id === bid.resource_id);

          return {
            id: `ord-${bid.id}`,
            studentId: `User #${bid.user_id}`,
            resource: resourceObj ? resourceObj.name : `Resource #${bid.resource_id}`,
            priority: bid.bid_amount > 40 ? "High" : bid.bid_amount >= 20 ? "Medium" : "Low",
            timestamp: new Date(bid.created_at + "Z"),
            status: bid.status === "pending" ? "Pending" : "Approved",
          };
        });

        setOrders(formattedOrders)
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
    }
  }, [resources])

  // 2. The Master Initialization
  useEffect(() => {
    const startApp = async () => {
      try {
        // 1. Fetch resources WITHOUT the Authorization header
        // This makes it much faster and reliable for the dropdown
        const resResponse = await fetch(`http://127.0.0.1:8000/resources?t=${Date.now()}`)

        if (resResponse.ok) {
          const resData = await resResponse.json()
          console.log("Full Catalog Loaded:", resData) // Check your console to see all 4 items!
          setResources(resData)

          // 2. ONLY fetch orders if we have a token (since Bids are private)
          const token = localStorage.getItem("access_token")
          if (token) {
            await fetchOrders()
          }

          setIsLoadingNames(false)
        }
      } catch (error) {
        console.error("Initialization failed:", error)
      }
    }

    startApp()

    const interval = setInterval(() => {
      fetchOrders()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchOrders])

  const addOrder = useCallback(async (resourceId: string, priority: "High" | "Medium" | "Low") => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) return

      const bidAmount = priority === "High" ? 50.0 : priority === "Medium" ? 30.0 : 10.0

      const response = await fetch("http://127.0.0.1:8000/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bid_amount: bidAmount,
          resource_id: parseInt(resourceId)
        }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error("Failed to place bid:", error)
    }
  }, [fetchOrders, resources])

  return (
    <OrderBookContext.Provider value={{ orders, resources, addOrder, fetchOrders }}>
      {children}
    </OrderBookContext.Provider>
  )
}

export function useOrderBook() {
  const context = useContext(OrderBookContext)
  if (!context) {
    throw new Error("useOrderBook must be used within an OrderBookProvider")
  }
  return context
}