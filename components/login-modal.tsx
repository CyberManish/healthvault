"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Phone, Shield, CheckCircle, ArrowLeft, Sparkles, Lock } from "lucide-react"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [progress, setProgress] = useState(0)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Progress animation
  useEffect(() => {
    if (step === "phone") {
      setProgress(phone.length >= 10 ? 100 : (phone.length / 10) * 100)
    } else {
      setProgress(otp.length >= 6 ? 100 : (otp.length / 6) * 100)
    }
  }, [phone, otp, step])

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    // Mock API call with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setStep("otp")
    setTimer(30)
    setIsLoading(false)

    // Start countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    toast({
      title: "OTP Sent Successfully! 📱",
      description: `Verification code sent to +91 ${phone}. Use 123456 for demo.`,
    })
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP.",
        variant: "destructive",
      })
      return
    }

    console.log('Attempting to verify OTP:', otp, 'with phone:', phone)
    setIsLoading(true)
    const success = await login(phone, otp)
    setIsLoading(false)

    console.log('Login result:', success)

    if (success) {
      toast({
        title: "Welcome to HealthVault! 🎉",
        description: "Login successful. Redirecting to your dashboard...",
      })
      onOpenChange(false)
      setStep("phone")
      setPhone("")
      setOtp("")
      
      // Redirect to appropriate dashboard based on phone number
      const redirectPath = phone === "9876543210" ? "/doctor/dashboard" : "/patient/dashboard"
      setTimeout(() => {
        router.push(redirectPath)
      }, 1000)
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check your OTP and try again.",
        variant: "destructive",
      })
    }
  }

  const handleResendOTP = () => {
    if (timer === 0) {
      handleSendOTP()
    }
  }

  const handleBackToPhone = () => {
    setStep("phone")
    setOtp("")
    setTimer(0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-hidden border-0 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10" />
        
        <DialogHeader className="relative z-10 space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Secure Login
          </DialogTitle>
          
          <DialogDescription className="text-center text-base text-muted-foreground leading-relaxed">
            {step === "phone"
              ? "Enter your mobile number to receive a secure verification code"
              : "Enter the 6-digit verification code we sent to your phone"}
          </DialogDescription>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <Badge variant={step === "phone" ? "default" : "secondary"} className={`text-xs px-3 py-1 ${step === "phone" ? "bg-green-500 hover:bg-green-600" : ""}`}>
                <Phone className="w-3 h-3 mr-1" />
                1. Phone
              </Badge>
              <Badge variant={step === "otp" ? "default" : "secondary"} className={`text-xs px-3 py-1 ${step === "otp" ? "bg-green-500 hover:bg-green-600" : ""}`}>
                <Shield className="w-3 h-3 mr-1" />
                2. Verify
              </Badge>
            </div>
            <Progress value={step === "phone" ? 50 : 100} className="h-3 rounded-full [&>div]:bg-green-500" />
          </div>
        </DialogHeader>

        <div className="space-y-6 relative z-10">
          {step === "phone" ? (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Mobile Number
                </Label>
                <div className="relative">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center px-4 py-3 border-2 border-r-0 rounded-l-xl bg-muted/50 border-border h-12 shadow-sm">
                      <span className="text-sm font-medium text-muted-foreground">🇮🇳 +91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="rounded-l-none rounded-r-xl border-l-0 border-2 text-lg tracking-wider transition-all duration-300 focus:ring-2 focus:ring-primary/20 h-12"
                      maxLength={10}
                    />
                  </div>
                  {phone.length === 10 && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500 animate-fade-in" />
                  )}
                </div>
                <Progress value={progress} className="h-1 [&>div]:bg-green-500" />
                
                <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
                      <p><strong>Demo accounts:</strong></p>
                      <p>• <code className="bg-green-100 dark:bg-green-900 px-1 rounded">9876543210</code> → Doctor account</p>
                      <p>• Any other number → Patient account</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSendOTP} 
                disabled={isLoading || phone.length !== 10} 
                className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-lg font-medium text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    Send Secure OTP
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp" className="text-sm font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Verification Code
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToPhone}
                    className="text-xs h-auto p-1 hover:bg-transparent"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Change number
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground mb-4 p-3 bg-muted/30 rounded-lg">
                  Code sent to: <strong>+91 {phone}</strong>
                </div>
                
                <div className="relative">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-[0.5em] font-mono rounded-xl h-14 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  {otp.length === 6 && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-green-500 animate-fade-in" />
                  )}
                </div>
                <Progress value={progress} className="h-1 [&>div]:bg-green-500" />
                
                <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-green-700 dark:text-green-300">
                      <p><strong>Demo OTP:</strong> <code className="bg-green-100 dark:bg-green-900 px-1 rounded">123456</code></p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleVerifyOTP} 
                  disabled={isLoading || otp.length !== 6} 
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] text-lg font-medium text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Verify & Login
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleResendOTP} 
                  disabled={timer > 0} 
                  className="w-full h-10 rounded-xl border-2 hover:bg-muted/50 transition-all duration-300"
                >
                  {timer > 0 ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Resend OTP in {timer}s
                    </span>
                  ) : (
                    "Resend OTP"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
