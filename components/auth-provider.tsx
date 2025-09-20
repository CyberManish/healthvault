"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface User {
  id: string
  name: string
  phone: string
  role: "patient" | "doctor"
  email?: string
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  login: (phone: string, otp: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getInitialSession = async () => {
      // Check for demo user in localStorage first
      const demoUser = localStorage.getItem('healthvault-demo-user')
      if (demoUser) {
        try {
          const user = JSON.parse(demoUser)
          setUser(user)
          setIsLoading(false)
          return
        } catch (e) {
          localStorage.removeItem('healthvault-demo-user')
        }
      }

      // If no demo user, try Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        setSupabaseUser(session.user)
        await fetchUserProfile(session.user.id)
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user)
        await fetchUserProfile(session.user.id)
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.full_name,
          phone: data.phone,
          role: data.user_type,
        })
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
    }
  }

  const login = async (phone: string, otp: string): Promise<boolean> => {
    console.log('Login attempt with OTP:', otp, 'Length:', otp.length)
    
    // Demo OTP validation
    if (otp !== "123456") {
      console.log('OTP mismatch. Expected: "123456", Received:', JSON.stringify(otp))
      return false
    }

    console.log('OTP validated successfully')

    // For demo purposes, create a mock user session without Supabase
    const mockUser: User = {
      id: `demo-${phone}`,
      name: phone === "9876543210" ? "Dr. Sarah Johnson" : "Priya Sharma",
      phone: phone,
      role: phone === "9876543210" ? "doctor" : "patient",
      email: `${phone}@healthvault.demo`
    }

    // Set the user directly for demo
    setUser(mockUser)
    
    // Store in localStorage for persistence
    localStorage.setItem('healthvault-demo-user', JSON.stringify(mockUser))
    
    console.log('Demo login successful, user set:', mockUser)
    console.log('User state should now be:', mockUser)
    return true
  }

  const logout = async () => {
    setUser(null)
    setSupabaseUser(null)
    localStorage.removeItem('healthvault-demo-user')
    // await supabase.auth.signOut() // Commented out for demo
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, login, logout, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
