"use client"

import type React from "react"
import Link from "next/link"
import { Scan } from "lucide-react"
import { SignUp } from "@clerk/nextjs"
import { motion } from "framer-motion"



export default function SignInPage() {
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

      {/* Main Clerk SignIn Component */}
      <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
      <main className="flex-1 flex items-center justify-center p-4">
      <SignUp
  path="/sign-up"
  routing="path"
  signInUrl="/sign-in"
  appearance={{
    elements: {
      rootBox: "w-full max-w-md mx-auto",
      card: "shadow-none border border-gray-200 dark:border-gray-700",
    },
  }}
/>
      </main>
      </motion.div>

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
