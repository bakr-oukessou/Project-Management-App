"use client"

import { useState, useEffect } from "react"

// Define toast types
type ToastType = "default" | "success" | "error" | "warning" | "info"

// Define toast interface
interface Toast {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
  variant?: string
}

// Define toast options
interface ToastOptions {
  title: string
  description?: string
  type?: ToastType
  duration?: number
  variant?: string
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Add a new toast
  const toast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      type: options.type || "default",
      duration: options.duration || 5000,
      variant: options.variant,
    }

    setToasts((prevToasts) => [...prevToasts, newToast])
    return id
  }

  // Remove a toast by id
  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  // Auto-dismiss toasts after their duration
  useEffect(() => {
    const timers = toasts.map((toast) => {
      return setTimeout(() => {
        dismiss(toast.id)
      }, toast.duration)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts])

  return { toast, dismiss, toasts }
}
