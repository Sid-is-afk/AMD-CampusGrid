"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Zap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Activity,
  Wifi,
  GraduationCap,
  Building2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

interface AuthPageProps {
  initialMode?: "signin" | "signup"
}

type UserType = "student" | "college" | null

export function AuthPage({ initialMode = "signin" }: AuthPageProps = {}) {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"signin" | "signup">(initialMode)
  const [userType, setUserType] = useState<UserType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isLoading) return

    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    if (mode === "signin") {
      const success = await signIn(email, password)
      if (success) {
        toast.success("Welcome back!")
        router.push("/dashboard") 
      } else {
        toast.error("Invalid credentials. Please check your email and password.")
      }
    } else {
      if (!name.trim()) {
        toast.error("Please enter your full name")
        setIsLoading(false)
        return
      }
      
      if (!userType) {
        toast.error("Please select whether you are a Student or a College")
        setIsLoading(false)
        return
      }

      const success = await signUp(name, email, password, userType)
      
      if (success) {
        toast.success("Account created successfully!")
        router.push("/dashboard") 
      } else {
        // THE SMART UX FIX:
        toast.error("Email already registered! Switching to Sign In...")
        setMode("signin") // Automatically switch the tab!
        // Notice we DO NOT clear the email/password here, so they can just click Sign In!
      }
    }

    setIsLoading(false)
  }

  function switchMode() {
    setMode(mode === "signin" ? "signup" : "signin")
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setShowPassword(false)
  }

  return (
    <div className="grid-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* Animated background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.2 250 / 0.15), transparent 70%)" }}
        />
        <motion.div
          animate={{ opacity: [0.03, 0.06, 0.03], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.18 55 / 0.12), transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-neon-blue/10 glow-blue">
            <Zap className="h-7 w-7 text-neon-blue" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground glow-blue-text">
              CampusGrid
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              Smart Campus Resource Engine
            </p>
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-strong w-full rounded-2xl p-8"
        >
          {/* User Type Selector - Show when no type selected */}
          <AnimatePresence>
            {!userType && (
              <motion.div
                initial={{ opacity: 0, height: "auto" }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 space-y-4"
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold text-foreground mb-1">Welcome to CampusGrid</h3>
                  <p className="text-sm text-muted-foreground">Are you a student or from a college?</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => setUserType("student")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-border bg-card/30 p-4 transition-all hover:border-neon-blue hover:bg-neon-blue/5"
                  >
                    <GraduationCap className="h-6 w-6 text-neon-blue" />
                    <span className="text-sm font-medium text-foreground">Student</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setUserType("college")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-border bg-card/30 p-4 transition-all hover:border-neon-orange hover:bg-neon-orange/5"
                  >
                    <Building2 className="h-6 w-6 text-neon-orange" />
                    <span className="text-sm font-medium text-foreground">College</span>
                  </motion.button>
                </div>
                <div className="h-[1px] bg-border/50" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back button when type selected */}
          {userType && (
            <button
              onClick={() => setUserType(null)}
              className="mb-4 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              ← Change user type
            </button>
          )}

          {/* Mode Toggle */}
          <div className="mb-6 flex items-center gap-1 rounded-lg bg-secondary/50 p-1">
            <button
              onClick={() => mode !== "signin" && switchMode()}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                mode === "signin"
                  ? "bg-neon-blue/15 text-neon-blue shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => mode !== "signup" && switchMode()}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-neon-blue/15 text-neon-blue shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === "signin" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "signin" ? 10 : -10 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              {/* Heading */}
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {mode === "signin" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {mode === "signin"
                    ? "Access your campus resource dashboard"
                    : "Join the campus resource allocation network"}
                </p>
              </div>

              {/* Name (signup only) */}
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-2"
                >
                  <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 border-border/50 bg-input/50 pl-10 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-neon-blue/50 focus-visible:ring-neon-blue/20"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-border/50 bg-input/50 pl-10 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-neon-blue/50 focus-visible:ring-neon-blue/20"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Password
                  </Label>
                  {mode === "signin" && (
                    <button type="button" className="text-xs text-neon-blue hover:text-neon-blue/80 transition-colors">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-border/50 bg-input/50 pl-10 pr-10 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-neon-blue/50 focus-visible:ring-neon-blue/20"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (signup only) */}
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-2"
                >
                  <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider text-muted-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 border-border/50 bg-input/50 pl-10 text-foreground placeholder:text-muted-foreground/50 focus-visible:border-neon-blue/50 focus-visible:ring-neon-blue/20"
                      required
                      minLength={6}
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group relative mt-1 flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-neon-blue font-mono text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all glow-blue hover:bg-neon-blue/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <>
                    {mode === "signin" ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
                {!isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-primary-foreground/10"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.button>

              {/* Switch mode text */}
              <p className="text-center text-sm text-muted-foreground">
                {mode === "signin" ? "New to CampusGrid? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={switchMode}
                  className="font-medium text-neon-blue transition-colors hover:text-neon-blue/80"
                >
                  {mode === "signin" ? "Create an account" : "Sign in"}
                </button>
              </p>
            </motion.form>
          </AnimatePresence>
        </motion.div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-6 text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            <span className="text-xs">Encrypted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span className="text-xs">99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="h-3.5 w-3.5" />
            <span className="text-xs">Live Connected</span>
          </div>
        </motion.div>

        {/* Updated Demo hint to reflect the live database */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-lg px-4 py-2.5"
        >
          <p className="text-center font-mono text-xs text-muted-foreground">
            <span className="text-emerald-400">Live Database:</span>{" "}
            You are securely connected to the local Python engine.
          </p>
        </motion.div>
      </div>
    </div>
  )
}