"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Scan, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate loading for demo purposes
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      // You'll integrate Clerk password reset here
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Scan className="h-6 w-6 mr-2" />
              <span className="text-xl font-bold">NutriScan AI</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="border-gray-200 shadow-lg">
              {!isSubmitted ? (
                <>
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Reset password</CardTitle>
                    <CardDescription className="text-center">
                      Enter your email address and we'll send you a link to reset your password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="focus-visible:ring-black"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-black hover:bg-gray-800 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Sending reset link...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            Send reset link <ArrowRight className="ml-2 h-4 w-4" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader className="space-y-1">
                    <div className="mx-auto bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
                    <CardDescription className="text-center">
                      We've sent a password reset link to <span className="font-medium">{email}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-center">
                    <p className="text-sm text-gray-500">
                      If you don't see the email, check other places it might be, like your junk, spam, social, or other
                      folders.
                    </p>
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Resend email
                    </Button>
                  </CardContent>
                </>
              )}
              <CardFooter className="flex justify-center">
                <Link
                  href="/auth/sign-in"
                  className="text-sm text-gray-500 hover:text-black flex items-center transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} NutriScan AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
