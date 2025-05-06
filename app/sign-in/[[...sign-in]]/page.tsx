"use client"

import type React from "react"
import Link from "next/link"
import { SignIn } from "@clerk/nextjs"
import { Scan } from "lucide-react"
import { useClerk } from "@clerk/nextjs";

export default function SignInPage() {
  // const clerk = useClerk();
  // if (clerk.) {
  //   return <div>Loading...</div>;
  // }
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
      <main className="flex-1 flex items-center justify-center p-4">
      <SignIn
  path="/sign-in"
  routing="path"
  signUpUrl="/sign-up"
  appearance={{
    elements: {
      rootBox: "w-full max-w-md mx-auto",
      card: "shadow-none border border-gray-200 dark:border-gray-700",
    },
  }}
/>
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
