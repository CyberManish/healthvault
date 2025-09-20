import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { GeminiChatbot } from "@/components/gemini-chatbot"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "HealthVault - Secure Health Records & Appointments",
  description:
    "Your health records, secured and in your control. Access your medical history and book appointments seamlessly.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            {children}
            <Toaster />
            <GeminiChatbot />
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
