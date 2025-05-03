"use client"

import type React from "react"

import { motion } from "framer-motion"

interface FeatureCardProps {
  feature: {
    icon: React.ReactNode
    title: string
    description: string
  }
  index: number
  inView: boolean
}

export default function FeatureCard({ feature, index, inView }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white p-8 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
    >
      <div className="bg-gray-50 p-3 rounded-lg w-fit mb-6">{feature.icon}</div>
      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  )
}
