"use client"

import { Progress } from "@/components/ui/progress"

interface NutrientCardProps {
  label: string
  value: string
  unit: string
  color: string
  icon: string
  percentage: number
}

export default function NutrientCard({ label, value, unit, color, icon, percentage }: NutrientCardProps) {
  return (
    <div className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <div className={`w-8 h-1 ${color} rounded-full`}></div>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-gray-500 ml-1">{unit}</p>
      </div>
      <div className="mt-2">
        <Progress value={percentage} className="h-1" />
        <p className="text-xs text-gray-400 mt-1">{percentage}% of daily value</p>
      </div>
    </div>
  )
}
