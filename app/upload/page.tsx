"use client"

import type React from "react"

import { useState, useRef } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NutritionChart from "@/components/nutrition-chart"
import ScanHistory from "@/components/scan-history"
import DashboardHeader from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"

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
                      <Card className="col-span-full">
                        <CardHeader className="flex flex-row items-start justify-between">
                          <div>
                            <CardTitle>Nutrition Analysis Results</CardTitle>
                            <CardDescription>
                              AI-powered analysis of {productType || "your product"}
                              {companyName && ` by ${companyName}`}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={handleSpeak}>
                              <Play className="h-4 w-4 mr-1" /> Play
                            </Button>
                            <Button variant="outline" size="sm" onClick={handlePause}>
                              <Pause className="h-4 w-4 mr-1" /> Pause
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleResume}>
                              <SkipForward className="h-4 w-4 mr-1" /> Resume
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2 space-y-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h3 className="font-medium mb-2">Analysis</h3>
                                <p className="text-gray-700 whitespace-pre-line">{analysis}</p>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                  { label: "Calories", value: "240 kcal", color: "bg-black" },
                                  { label: "Protein", value: "5g", color: "bg-gray-700" },
                                  { label: "Carbs", value: "30g", color: "bg-gray-500" },
                                  { label: "Fat", value: "12g", color: "bg-gray-300" },
                                ].map((stat, i) => (
                                  <div key={i} className="p-4 border rounded-lg">
                                    <div className={`w-8 h-1 ${stat.color} mb-2`}></div>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                    <p className="text-xl font-bold">{stat.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm font-medium">Nutrition Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <NutritionChart />
                                </CardContent>
                              </Card>

                              <div className="mt-4 space-y-2">
                                <h4 className="text-sm font-medium">Ingredient Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                  {["Gluten", "Sugar", "Natural Flavors", "Preservatives", "Artificial Colors"].map(
                                    (tag, i) => (
                                      <Badge key={i} variant="outline">
                                        {tag}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline">Save to History</Button>
                          <Button variant="outline">Download Report</Button>
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
              <div className="grid gap-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                  <p className="text-gray-500 mt-2">Manage your account preferences and settings</p>
                </div>

                <div className="grid gap-6 md:grid-cols-5">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>Manage your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/placeholder.svg?height=64&width=64" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">
                            Change Avatar
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Name</label>
                          <input
                            type="text"
                            defaultValue="John Doe"
                            className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>

                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Email</label>
                          <input
                            type="email"
                            defaultValue="john.doe@example.com"
                            className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-black hover:bg-gray-800 text-white">Save Changes</Button>
                    </CardFooter>
                  </Card>

                  <Card className="md:col-span-3">
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                      <CardDescription>Customize your NutriScan experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Default Language</h4>
                            <p className="text-sm text-gray-500">Set your preferred language for analysis</p>
                          </div>
                          <select className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black">
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Spanish</option>
                            <option>French</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Default Voice</h4>
                            <p className="text-sm text-gray-500">Set your preferred voice for playback</p>
                          </div>
                          <select className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black">
                            <option>English (US)</option>
                            <option>English (UK)</option>
                            <option>Hindi</option>
                            <option>Spanish</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Dark Mode</h4>
                            <p className="text-sm text-gray-500">Toggle between light and dark theme</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Notifications</h4>
                            <p className="text-sm text-gray-500">Receive alerts and updates</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" defaultChecked className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

