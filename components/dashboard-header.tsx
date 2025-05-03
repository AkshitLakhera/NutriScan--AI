"use client"

import Link from "next/link"
import { useState } from "react"
import { Bell, Search, Menu, X, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

export default function DashboardHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center">
            <Scan className="h-6 w-6 mr-2" />
            <span className="text-xl font-bold hidden md:inline-block">NutriScan AI</span>
            <span className="text-xl font-bold md:hidden">NS</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard?tab=history" className="text-sm font-medium hover:text-gray-600 transition-colors">
                History
              </Link>
              <Link href="/dashboard?tab=upload" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Scan
              </Link>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-8 h-9 w-[200px] rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-4 top-16 w-80 bg-white border rounded-md shadow-lg z-50"
              >
                <div className="p-4 border-b">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                      <p className="font-medium text-sm">New feature available</p>
                      <p className="text-xs text-gray-500">Check out our new nutrition comparison tool</p>
                      <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center">
                  <Button variant="link" size="sm" className="text-xs">
                    View all notifications
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
            {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-medium p-2 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard?tab=history"
                className="text-sm font-medium p-2 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                History
              </Link>
              <Link
                href="/dashboard?tab=upload"
                className="text-sm font-medium p-2 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Scan
              </Link>
              <div className="relative">
                <Search className="absolute left-4 top-2.5 h-4 w-4 text-gray-500" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 h-9 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
