"use client"

import { useEffect, useRef } from "react"

export default function EnhancedNutritionChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Data for the chart
    const data = [
      { label: "Carbs", value: 45, color: "#000000" },
      { label: "Protein", value: 20, color: "#333333" },
      { label: "Fat", value: 30, color: "#666666" },
      { label: "Fiber", value: 5, color: "#999999" },
    ]

    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0)

    // Draw the pie chart
    let startAngle = 0
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Add shadow
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2
    ctx.shadowBlur = 10
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"

    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.value) / total

      ctx.beginPath()
      ctx.fillStyle = item.color
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fill()

      // Calculate label position
      const labelAngle = startAngle + sliceAngle / 2
      const labelRadius = radius * 0.7
      const labelX = centerX + Math.cos(labelAngle) * labelRadius
      const labelY = centerY + Math.sin(labelAngle) * labelRadius

      // Draw percentage label if segment is large enough
      if (item.value / total > 0.08) {
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(`${Math.round((item.value / total) * 100)}%`, labelX, labelY)
      }

      startAngle += sliceAngle
    })

    // Draw center circle (donut hole)
    ctx.shadowColor = "rgba(0, 0, 0, 0)"
    ctx.beginPath()
    ctx.fillStyle = "#ffffff"
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI)
    ctx.fill()

    // Draw center text
    ctx.fillStyle = "#000000"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Macros", centerX, centerY - 10)
    ctx.font = "12px Arial"
    ctx.fillText("Breakdown", centerX, centerY + 10)
  }, [])

  return (
    <div className="relative">
      <canvas ref={canvasRef} className="w-full h-[220px]"></canvas>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-black mr-1 rounded-sm"></div>
          <span>Carbs 45%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#333333] mr-1 rounded-sm"></div>
          <span>Protein 20%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#666666] mr-1 rounded-sm"></div>
          <span>Fat 30%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#999999] mr-1 rounded-sm"></div>
          <span>Fiber 5%</span>
        </div>
      </div>
    </div>
  )
}
