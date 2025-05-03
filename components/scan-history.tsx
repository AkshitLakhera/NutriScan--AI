"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function ScanHistory() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  const historyItems = [
    {
      id: 1,
      name: "Chocolate Bar",
      brand: "Cadbury",
      date: "2023-05-15",
      time: "14:30",
      status: "warning",
      concerns: ["High Sugar", "Palm Oil"],
      benefits: ["Contains Antioxidants"],
      ingredients: "Sugar, Cocoa Butter, Cocoa Mass, Milk, Vegetable Fats (Palm, Shea), Emulsifiers, Flavourings",
      nutrition: {
        calories: 240,
        protein: 3,
        carbs: 25,
        fat: 14,
        sugar: 22,
      },
    },
    {
      id: 2,
      name: "Protein Shake",
      brand: "Optimum Nutrition",
      date: "2023-05-14",
      time: "08:15",
      status: "healthy",
      concerns: ["Artificial Sweeteners"],
      benefits: ["High Protein", "Low Fat", "Added Vitamins"],
      ingredients:
        "Protein Blend (Whey Protein Isolate, Whey Protein Concentrate), Cocoa Powder, Natural and Artificial Flavors, Salt, Lecithin, Acesulfame Potassium, Sucralose",
      nutrition: {
        calories: 120,
        protein: 24,
        carbs: 3,
        fat: 1,
        sugar: 1,
      },
    },
    {
      id: 3,
      name: "Potato Chips",
      brand: "Lay's",
      date: "2023-05-12",
      time: "16:45",
      status: "warning",
      concerns: ["High Sodium", "High Fat"],
      benefits: ["Gluten Free"],
      ingredients: "Potatoes, Vegetable Oil (Sunflower, Corn, and/or Canola Oil), Salt, Dextrose",
      nutrition: {
        calories: 160,
        protein: 2,
        carbs: 15,
        fat: 10,
        sugar: 0,
      },
    },
    {
      id: 4,
      name: "Greek Yogurt",
      brand: "Chobani",
      date: "2023-05-10",
      time: "07:30",
      status: "healthy",
      concerns: [],
      benefits: ["High Protein", "Probiotics", "Calcium"],
      ingredients: "Cultured Pasteurized Nonfat Milk, Cream, Live and Active Cultures",
      nutrition: {
        calories: 120,
        protein: 15,
        carbs: 8,
        fat: 3,
        sugar: 6,
      },
    },
    {
      id: 5,
      name: "Cereal",
      brand: "Kellogg's",
      date: "2023-05-08",
      time: "08:00",
      status: "warning",
      concerns: ["Added Sugar"],
      benefits: ["Fortified with Vitamins", "Whole Grain"],
      ingredients: "Whole Grain Wheat, Sugar, Contains 2% or Less of Salt, Malt Flavoring, Vitamins and Minerals",
      nutrition: {
        calories: 110,
        protein: 2,
        carbs: 24,
        fat: 1,
        sugar: 9,
      },
    },
  ]

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id)
  }

  return (
    <div className="space-y-4">
      {historyItems.map((item) => (
        <motion.div key={item.id} layout className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleExpand(item.id)}>
            <div className="flex items-center space-x-4">
              <div
                className={`w-3 h-3 rounded-full ${item.status === "healthy" ? "bg-green-500" : "bg-yellow-500"}`}
              ></div>
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.brand}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm">{new Date(item.date).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>

              <Button variant="ghost" size="sm">
                {expandedItem === item.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {expandedItem === item.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-4 pt-2 border-t"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Ingredients</h4>
                  <p className="text-sm text-gray-600">{item.ingredients}</p>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Analysis</h4>
                    <div className="space-y-2">
                      {item.concerns.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Concerns</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.concerns.map((concern, i) => (
                                <Badge key={i} variant="outline" className="bg-yellow-50">
                                  {concern}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {item.benefits.length > 0 && (
                        <div className="flex items-start space-x-2">
                          <Check className="h-4 w-4 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Benefits</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.benefits.map((benefit, i) => (
                                <Badge key={i} variant="outline" className="bg-green-50">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Nutrition Facts</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">Calories</span>
                      <span className="text-sm font-medium">{item.nutrition.calories} kcal</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">Protein</span>
                      <span className="text-sm font-medium">{item.nutrition.protein}g</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">Carbohydrates</span>
                      <span className="text-sm font-medium">{item.nutrition.carbs}g</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">Fat</span>
                      <span className="text-sm font-medium">{item.nutrition.fat}g</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">Sugar</span>
                      <span className="text-sm font-medium">{item.nutrition.sugar}g</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
