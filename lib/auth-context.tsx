"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
  studentId: string
  balance?: number
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (name: string, email: string, password: string, userType?: string) => Promise<boolean>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Auto-login on page load if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const savedUser = localStorage.getItem("user")
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // 1. LOGIN ROUTE (Requires Form Data for OAuth2)
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("access_token", data.access_token)

        const loggedInUser: User = {
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          studentId: data.user.student_id || "",
        }

        localStorage.setItem("user", JSON.stringify(loggedInUser))
        setUser(loggedInUser)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string, userType?: string): Promise<boolean> => {
    try {
      const assignedRole = userType === "college" ? "Faculty" : "Student"

      // 2. REGISTER ROUTE (Requires standard JSON)
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: assignedRole,
          student_id: `STU-${Math.floor(Math.random() * 9000) + 1000}`
        }),
      })

      if (response.ok) {
        // If successful, log them right in!
        return await signIn(email, password)
      }
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }, [signIn])

  const signOut = useCallback(() => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}