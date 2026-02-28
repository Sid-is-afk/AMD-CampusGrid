"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useOrderBook } from "@/lib/order-book-context"
import { useDashboardSync } from "@/hooks/use-dashboard-sync"
import { toast } from "sonner"

interface Message {
    id: string
    role: "user" | "assistant"
    content: string
    action?: {
        type: "book"
        resourceId: string
        resourceName: string
        price: number
    }
}

export function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hi! I'm your Campus AI Assistant. Looking for a lab, study room, or checking your budget? Just ask!",
        },
    ])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { user } = useAuth()
    const { addOrder } = useOrderBook()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMsg: Message = { id: Date.now().toString(), role: "user", content: input }
        setMessages((prev) => [...prev, userMsg])
        setInput("")
        setIsTyping(true)

        // Simulate LLM processing
        setTimeout(() => {
            const resp = simulateLLMResponse(userMsg.content, (user as any)?.balance ?? 1000)
            setMessages((prev) => [...prev, resp])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000)
    }

    const simulateLLMResponse = (query: string, balance: number): Message => {
        const lowerQuery = query.toLowerCase()

        if (lowerQuery.includes("budget") || lowerQuery.includes("balance")) {
            return {
                id: Date.now().toString(),
                role: "assistant",
                content: `Your current balance is **${balance} tokens**. How can I help you spend or save them today?`,
            }
        }

        if (lowerQuery.includes("gpu") || lowerQuery.includes("machine learning")) {
            if (balance < 150) {
                return {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: `You're looking for a GPU lab, but they usually rent for ~150 tokens. Your balance is ${balance} tokens. I recommend booking a highly-available **CS Lab (Room 301)** for 40 tokens instead to stay within budget.`,
                    action: {
                        type: "book",
                        resourceId: "RES-3",
                        resourceName: "CS Lab - Room 301",
                        price: 40,
                    }
                }
            }
            return {
                id: Date.now().toString(),
                role: "assistant",
                content: `I found an available slot in the GPU Lab. It's high demand but fits your budget!`,
                action: {
                    type: "book",
                    resourceId: "RES-1",
                    resourceName: "GPU Lab",
                    price: 150,
                }
            }
        }

        if (lowerQuery.includes("quiet") || lowerQuery.includes("study") || lowerQuery.includes("library")) {
            return {
                id: Date.now().toString(),
                role: "assistant",
                content: `Library Zone B is currently at 20% capacity. It's very quiet and cheap right now!`,
                action: {
                    type: "book",
                    resourceId: "RES-5",
                    resourceName: "Library - Zone B",
                    price: 25,
                }
            }
        }

        return {
            id: Date.now().toString(),
            role: "assistant",
            content: `I can help you find the best resources based on your schedule and budget. Try asking "Find a quiet place to study" or "Book a GPU lab".`,
        }
    }

    const handleAction = async (action: NonNullable<Message["action"]>) => {
        if (action.type === "book") {
            try {
                const priority = action.price > 40 ? "High" : action.price >= 20 ? "Medium" : "Low"
                await addOrder(action.resourceId.replace("RES-", ""), priority)
                toast.success(`Successfully bid for ${action.resourceName} at ${action.price} tokens!`)
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        role: "assistant",
                        content: `Great! I've placed a bid for ${action.resourceName}. You will be notified when it's approved.`
                    }
                ])
            } catch (e) {
                toast.error("Failed to place bid")
            }
        }
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsOpen(true)}
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-neon-blue text-primary-foreground shadow-lg glow-blue"
                        >
                            <Sparkles className="h-6 w-6" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/95 shadow-2xl backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border/30 bg-secondary/30 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon-blue/20">
                                    <Bot className="h-4 w-4 text-neon-blue" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-foreground">Campus AI</h3>
                                    <p className="text-[10px] text-muted-foreground">Smart Booking Assistant</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="flex flex-col gap-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                            }`}
                                    >
                                        <div
                                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${msg.role === "user"
                                                ? "bg-secondary text-foreground"
                                                : "bg-neon-blue/20 text-neon-blue"
                                                }`}
                                        >
                                            {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>
                                        <div
                                            className={`flex max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-2 text-sm ${msg.role === "user"
                                                ? "bg-secondary text-foreground"
                                                : "border border-border/50 bg-card/50 text-foreground"
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap leading-relaxed">
                                                {/* Simple bold parsing for visual pop */}
                                                {msg.content.split(/(\*\*.*?\*\*)/).map((part, i) =>
                                                    part.startsWith("**") && part.endsWith("**") ? (
                                                        <strong key={i} className="font-bold text-neon-blue">
                                                            {part.slice(2, -2)}
                                                        </strong>
                                                    ) : (
                                                        <span key={i}>{part}</span>
                                                    )
                                                )}
                                            </p>
                                            {msg.action && (
                                                <button
                                                    onClick={() => handleAction(msg.action!)}
                                                    className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-neon-blue/10 px-3 py-2 text-xs font-bold text-neon-blue transition-colors hover:bg-neon-blue/20"
                                                >
                                                    Book {msg.action.resourceName} ({msg.action.price} 🪙)
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex items-start gap-2">
                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neon-blue/20 text-neon-blue">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="flex items-center gap-1 rounded-2xl border border-border/50 bg-card/50 px-4 py-3">
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                                                className="h-1.5 w-1.5 rounded-full bg-neon-blue/50"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                                className="h-1.5 w-1.5 rounded-full bg-neon-blue/50"
                                            />
                                            <motion.div
                                                animate={{ y: [0, -5, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                                                className="h-1.5 w-1.5 rounded-full bg-neon-blue/50"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input */}
                        <div className="border-t border-border/30 bg-background/50 p-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSend()
                                }}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for recommendations..."
                                    className="w-full rounded-xl border border-border/50 bg-input/50 py-3 pl-4 pr-12 text-sm text-foreground focus:border-neon-blue/50 focus:outline-none focus:ring-1 focus:ring-neon-blue/20"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="absolute right-2 rounded-lg bg-neon-blue p-2 text-primary-foreground transition-colors hover:bg-neon-blue/90 disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
