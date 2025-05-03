"use client"
import { motion } from "framer-motion"
import { Upload, BarChart3, Clock, Settings, User, Home, LogOut } from "lucide-react"

interface DashboardSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function DashboardSidebar({ activeTab, setActiveTab }: DashboardSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { id: "upload", label: "Scan Ingredients", icon: <Upload className="h-5 w-5" /> },
    { id: "history", label: "Scan History", icon: <Clock className="h-5 w-5" /> },
    { id: "stats", label: "Statistics", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative w-full text-left ${
                activeTab === item.id ? "text-black" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 w-1 h-6 bg-black rounded-full"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <span className="flex items-center justify-center w-5">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t space-y-1">
          <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors w-full text-left">
            <User className="h-5 w-5" />
            <span>Account</span>
          </button>
          <button className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors w-full text-left">
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
