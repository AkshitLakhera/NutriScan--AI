"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface PricingCardProps {
  plan: {
    name: string
    price: string
    period?: string
    description: string
    features: string[]
    highlighted?: boolean
  }
  index: number
  inView: boolean
}

export default function PricingCard({ plan, index, inView }: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`
        bg-white p-8 rounded-xl border 
        ${plan.highlighted ? "border-black ring-1 ring-black" : "border-gray-100"} 
        relative hover:shadow-xl transition-all duration-300
      `}
    >
      {plan.highlighted && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white text-xs font-bold px-4 py-1 rounded-full">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{plan.price}</span>
        {plan.period && <span className="text-gray-500">{plan.period}</span>}
      </div>
      <p className="text-gray-600 mb-6">{plan.description}</p>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        className={`w-full py-6 ${
          plan.highlighted
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-white text-black border border-gray-200 hover:bg-gray-50"
        }`}
      >
        {plan.name === "Basic" ? "Start Free" : "Subscribe Now"}
      </Button>
    </motion.div>
  )
}
