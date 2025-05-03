"use client"

import { useEffect, useRef } from "react"

export default function NutritionChart() {
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

    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.value) / total

      ctx.beginPath()
      ctx.fillStyle = item.color
      ctx.moveTo(canvas.width / 2, canvas.height / 2)
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2 - 10,
        startAngle,
        startAngle + sliceAngle,
      )
      ctx.closePath()
      ctx.fill()

      startAngle += sliceAngle
    })

    // Draw center circle (donut hole)
    ctx.beginPath()
    ctx.fillStyle = "#ffffff"
    ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 4, 0, 2 * Math.PI)
    ctx.fill()
  }, [])

  return (
    <div className="w-full h-[200px] relative">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-black mr-1"></div>
          <span>Carbs</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#333333] mr-1"></div>
          <span>Protein</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#666666] mr-1"></div>
          <span>Fat</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#999999] mr-1"></div>
          <span>Fiber</span>
        </div>
      </div>
    </div>
  )
}
