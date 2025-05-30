"use client"

import type React from "react"

import { useState, useRef ,useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileText,
  BarChart3,
  Play,
  Pause,
  SkipForward,
  AlertCircle,
  Check,
  X,
  ChevronDown,
  Search,
  Calendar,
  PieChart,
  Save,
  Share2,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ScanHistory from "@/components/scan-history"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"
import EnhancedNutritionChart from "@/components/enhanced-nutrition-chart"
import NutritionFactsTable from "@/components/nutrition-facts-table"
import NutrientCard from "@/components/nutrient-card"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { AccountSettings } from "@/components/AccountSettings"
export default function Dashboard() {
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [speechLang, setSpeechLang] = useState("en-US")
  const [analysisLang, setAnalysisLang] = useState("English")
  const [productType, setProductType] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  // Method to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Method to handle upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fileInput = form.elements.namedItem("image") as HTMLInputElement

    if (!fileInput.files?.[0]) return

    const formData = new FormData()
    formData.append("image", fileInput.files[0])

    setLoading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      setText(data.text)

      // Sending data to AI model
      const geminiRes = await fetch("/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: data.text,
          language: analysisLang,
          productType,
          companyName,
        }),
      })

      const geminiData = await geminiRes.json()
      setAnalysis(geminiData.response)
      setShowResults(true)
    } catch (error) {
      console.error("Error processing image:", error)
    } finally {
      clearInterval(progressInterval)
      setUploadProgress(100)
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  // Method for playing sound
  const handleSpeak = () => {
    if (!analysis) return
    const utterance = new SpeechSynthesisUtterance(analysis)
    utterance.lang = speechLang
    speechSynthesis.speak(utterance)
  }

  const handlePause = () => {
    speechSynthesis.pause()
  }

  const handleResume = () => {
    speechSynthesis.resume()
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle the file
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files
        handleFileChange({ target: { files: e.dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>)
      }
    }
  }

  // Trigger file input click
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />

      <div className="flex">
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 lg:p-10">
          <Tabs defaultValue="upload" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="upload" className="mt-0">
              <div className="grid gap-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Scan Ingredients</h1>
                  <p className="text-gray-500 mt-2">
                    Upload a photo of ingredient labels to get detailed nutritional analysis
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="col-span-full md:col-span-1 lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Upload Ingredient Label</CardTitle>
                      <CardDescription>Take a clear photo of the ingredient list for best results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleUpload} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Analysis Language</label>
                            <select
                              value={analysisLang}
                              onChange={(e) => setAnalysisLang(e.target.value)}
                              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                            >
                              <option value="English">English</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Spanish">Spanish</option>
                              <option value="French">French</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Voice Playback</label>
                            <select
                              value={speechLang}
                              onChange={(e) => setSpeechLang(e.target.value)}
                              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                            >
                              <option value="en-US">English (US)</option>
                              <option value="en-GB">English (UK)</option>
                              <option value="hi-IN">Hindi</option>
                              <option value="es-ES">Spanish</option>
                              <option value="fr-FR">French</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Product Type</label>
                            <input
                              type="text"
                              value={productType}
                              onChange={(e) => setProductType(e.target.value)}
                              placeholder="e.g., Chocolate, Chips, Cereal"
                              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Brand/Company</label>
                            <input
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="e.g., Nestlé, Kellogg's"
                              className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />
                          </div>
                        </div>

                        <div
                          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                            dragActive ? "border-black bg-gray-50" : "border-gray-300 hover:border-gray-400"
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={onButtonClick}
                        >
                          {previewImage ? (
                            <div className="relative w-full max-h-64 overflow-hidden rounded-md">
                              <img
                                src={previewImage || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-auto object-contain"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreviewImage(null)
                                  if (fileInputRef.current) fileInputRef.current.value = ""
                                }}
                                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-gray-400 mb-2" />
                              <p className="text-sm font-medium text-gray-600">Drag & drop or click to upload</p>
                              <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, HEIC up to 10MB</p>
                            </>
                          )}
                          <input
                            ref={fileInputRef}
                            type="file"
                            name="image"
                            accept="image/*"
                            required
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-black hover:bg-gray-800 text-white"
                          disabled={loading}
                        >
                          {loading ? (
                            <div className="flex items-center">
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Processing...
                            </div>
                          ) : (
                            <>Analyze Ingredients</>
                          )}
                        </Button>

                        {loading && (
                          <div className="space-y-2">
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-gray-500 text-center">
                              {uploadProgress < 100 ? "Analyzing ingredients..." : "Generating nutritional insights..."}
                            </p>
                          </div>
                        )}
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Scans</CardTitle>
                      <CardDescription>Your last 5 ingredient analyses</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { name: "Chocolate Bar", date: "Today", status: "healthy" },
                        { name: "Protein Shake", date: "Yesterday", status: "healthy" },
                        { name: "Potato Chips", date: "3 days ago", status: "warning" },
                        { name: "Cereal", date: "1 week ago", status: "warning" },
                        { name: "Yogurt", date: "2 weeks ago", status: "healthy" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                item.status === "healthy" ? "bg-green-500" : "bg-yellow-500"
                              }`}
                            ></div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.date}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All History
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <AnimatePresence>
                  {showResults && analysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="col-span-full overflow-hidden">
                        <CardHeader className="flex flex-row items-start justify-between bg-gradient-to-r from-gray-50 to-white border-b">
                          <div>
                            <CardTitle className="text-2xl">Nutrition Analysis Results</CardTitle>
                            <CardDescription className="text-base">
                              AI-powered analysis of {productType || "your product"}
                              {companyName && ` by ${companyName}`}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSpeak}
                              className="flex items-center gap-1"
                            >
                              <Play className="h-4 w-4" /> Play
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handlePause}
                              className="flex items-center gap-1"
                            >
                              <Pause className="h-4 w-4" /> Pause
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleResume}
                              className="flex items-center gap-1"
                            >
                              <SkipForward className="h-4 w-4" /> Resume
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="grid md:grid-cols-3 gap-0">
                            <div className="md:col-span-2 p-6 border-r">
                              <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                  <FileText className="h-5 w-5 mr-2 text-gray-500" /> Analysis Summary
                                </h3>
                                <div className="p-5 bg-gray-50 rounded-lg border border-gray-100 text-gray-700 whitespace-pre-line">
                                  {analysis}
                                </div>
                              </div>

                              <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                  <BarChart3 className="h-5 w-5 mr-2 text-gray-500" /> Key Nutrients
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  <NutrientCard
                                    label="Calories"
                                    value="240"
                                    unit="kcal"
                                    color="bg-black"
                                    icon="🔥"
                                    percentage={60}
                                  />
                                  <NutrientCard
                                    label="Protein"
                                    value="5"
                                    unit="g"
                                    color="bg-gray-700"
                                    icon="🥩"
                                    percentage={25}
                                  />
                                  <NutrientCard
                                    label="Carbs"
                                    value="30"
                                    unit="g"
                                    color="bg-gray-500"
                                    icon="🍚"
                                    percentage={45}
                                  />
                                  <NutrientCard
                                    label="Fat"
                                    value="12"
                                    unit="g"
                                    color="bg-gray-300"
                                    icon="🧈"
                                    percentage={35}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="p-6 bg-gray-50">
                              <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <PieChart className="h-5 w-5 mr-2 text-gray-500" /> Nutrition Breakdown
                              </h3>

                              <div className="bg-white p-4 rounded-lg border border-gray-100 mb-6">
                                <EnhancedNutritionChart />
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1 text-yellow-500" /> Potential Concerns
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {["Added Sugar", "Preservatives", "Artificial Colors", "High Sodium"].map(
                                      (tag, i) => (
                                        <Badge
                                          key={i}
                                          variant="outline"
                                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                        >
                                          {tag}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium mb-2 flex items-center">
                                    <Check className="h-4 w-4 mr-1 text-green-500" /> Benefits
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {["Fiber Source", "No Trans Fat", "Vitamin C"].map((tag, i) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="bg-green-50 text-green-700 border-green-200"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 border-t bg-gray-50">
                            <h3 className="text-lg font-semibold mb-4">Detailed Nutrition Facts</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                              <NutritionFactsTable />
                              <div className="md:col-span-1 lg:col-span-2">
                                <h4 className="text-sm font-medium mb-3">Ingredients</h4>
                                <div className="p-4 bg-white rounded-lg border border-gray-100 text-sm">
                                  <p className="text-gray-700">
                                    {text ||
                                      "Sugar, Enriched Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Vegetable Oil (Palm, Palm Kernel, and/or Coconut), Cocoa (Processed with Alkali), High Fructose Corn Syrup, Leavening (Baking Soda and/or Calcium Phosphate), Salt, Soy Lecithin, Chocolate, Natural and Artificial Flavor."}
                                  </p>

                                  <div className="mt-4 pt-4 border-t">
                                    <h5 className="text-xs font-semibold uppercase text-gray-500 mb-2">
                                      Ingredient Analysis
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        "Sugar",
                                        "Enriched Flour",
                                        "Vegetable Oil",
                                        "Cocoa",
                                        "High Fructose Corn Syrup",
                                        "Salt",
                                        "Soy Lecithin",
                                        "Natural Flavor",
                                        "Artificial Flavor",
                                      ].map((ingredient, i) => (
                                        <Badge
                                          key={i}
                                          variant="outline"
                                          className={`${i < 3 ? "bg-red-50 text-red-700 border-red-200" : i < 6 ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-green-50 text-green-700 border-green-200"}`}
                                        >
                                          {ingredient}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between bg-gray-50 border-t">
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex items-center gap-1">
                              <Save className="h-4 w-4" /> Save to History
                            </Button>
                            <Button variant="outline" className="flex items-center gap-1">
                              <Share2 className="h-4 w-4" /> Share Results
                            </Button>
                          </div>
                          <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-1">
                            <Download className="h-4 w-4" /> Download Report
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="grid gap-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
                  <p className="text-gray-500 mt-2">View and compare your previous ingredient scans</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="search"
                        placeholder="Search scans..."
                        className="pl-8 h-10 w-[250px] rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div className="relative">
                      <select className="h-10 rounded-md border border-gray-200 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-black">
                        <option>All Categories</option>
                        <option>Snacks</option>
                        <option>Beverages</option>
                        <option>Dairy</option>
                        <option>Packaged Foods</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Filter by date"
                        className="pl-8 h-10 w-[150px] rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                  <Button variant="outline">Export Data</Button>
                </div>

                <ScanHistory />
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="mt-0">
              <div className="grid gap-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Nutrition Dashboard</h1>
                  <p className="text-gray-500 mt-2">Track your nutrition trends and insights</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[
                    { title: "Total Scans", value: "28", change: "+4", icon: <FileText className="h-4 w-4" /> },
                    { title: "Healthy Items", value: "65%", change: "+2%", icon: <Check className="h-4 w-4" /> },
                    {
                      title: "Items with Warnings",
                      value: "8",
                      change: "-2",
                      icon: <AlertCircle className="h-4 w-4" />,
                    },
                    {
                      title: "Average Health Score",
                      value: "7.4",
                      change: "+0.2",
                      icon: <BarChart3 className="h-4 w-4" />,
                    },
                  ].map((stat, i) => (
                    <Card key={i}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <div className="h-4 w-4 text-gray-500">{stat.icon}</div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                          {stat.change} from last month
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Nutrition Trends</CardTitle>
                      <CardDescription>Your consumption patterns over time</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto text-gray-300" />
                        <p className="mt-2 text-sm text-gray-500">Nutrition trend charts will appear here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Common Ingredients</CardTitle>
                      <CardDescription>Most frequent ingredients in your scanned products</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { name: "Sugar", count: 24, percentage: 85 },
                          { name: "Natural Flavors", count: 18, percentage: 65 },
                          { name: "Salt", count: 16, percentage: 57 },
                          { name: "Citric Acid", count: 12, percentage: 43 },
                          { name: "Preservatives", count: 10, percentage: 36 },
                        ].map((ingredient, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{ingredient.name}</span>
                              <span className="text-sm text-gray-500">{ingredient.count} products</span>
                            </div>
                            <Progress value={ingredient.percentage} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Nutritional Recommendations</CardTitle>
                    <CardDescription>Personalized suggestions based on your scan history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {[
                        {
                          title: "Reduce Sugar Intake",
                          description:
                            "Your scanned products show high sugar content. Consider alternatives with less added sugar.",
                          icon: <AlertCircle className="h-5 w-5" />,
                        },
                        {
                          title: "More Whole Grains",
                          description: "Try products with whole grains for better nutritional value and fiber content.",
                          icon: <Check className="h-5 w-5" />,
                        },
                        {
                          title: "Watch Sodium Levels",
                          description:
                            "Many of your scanned items have high sodium content. Look for low-sodium options.",
                          icon: <AlertCircle className="h-5 w-5" />,
                        },
                      ].map((rec, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="p-1.5 bg-gray-100 rounded-full">{rec.icon}</div>
                            <h3 className="font-medium">{rec.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
             <AccountSettings/>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
