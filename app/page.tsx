"use client"

import { useRef } from "react"
import { useRouter } from 'next/navigation';
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Scan, Sparkles, BarChart3, Shield, ChevronDown } from "lucide-react"
import NutriScanModel from "@/components/nutriscan-model"
import FeatureCard from "@/components/feature-card"
import TestimonialCard from "@/components/testimonial-card"
import PricingCard from "@/components/pricing-card"
import { MobileMenu } from "@/components/mobile-menu"
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

export default function LandingPage() {
  // References for scroll animations
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const testimonialsRef = useRef(null)
  const pricingRef = useRef(null)
  const ctaRef = useRef(null)
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
//handlefunction
const handleUploadclick =() =>{
  if(!isLoaded){
    return;
  }
  if(isSignedIn){
    router.push("/upload");
  }else{
    router.push("/sign-in");
  }
}

  // Scroll animations
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroY = useTransform(scrollY, [0, 300], [0, 100])

  // Check if sections are in view
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.2 })
  const howItWorksInView = useInView(howItWorksRef, { once: false, amount: 0.2 })
  const testimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.2 })
  const pricingInView = useInView(pricingRef, { once: false, amount: 0.2 })
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.2 })

  // Features data
  const features = [
    {
      icon: <Scan className="h-8 w-8" />,
      title: "Instant Food Recognition",
      description: "Our AI can identify thousands of foods from a single photo with remarkable accuracy.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Detailed Nutrition Analysis",
      description: "Get comprehensive breakdown of calories, macros, vitamins, and minerals in your meals.",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Personalized Recommendations",
      description: "Receive tailored dietary suggestions based on your health goals and preferences.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Allergen Alerts",
      description: "Automatically detect and warn about potential allergens in your food.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Progress Tracking",
      description: "Monitor your nutritional intake over time with intuitive charts and insights.",
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Recipe Suggestions",
      description: "Get healthy recipe ideas based on your dietary preferences and nutritional needs.",
    },
  ]

  // Testimonials data
  const testimonials = [
    {
      quote: "NutriScan AI has completely changed how I approach my meals. The accuracy is impressive!",
      name: "Sarah Johnson",
      title: "Fitness Coach",
      rating: 5,
    },
    {
      quote:
        "As someone with dietary restrictions, this app has been a lifesaver. It detects allergens I need to avoid.",
      name: "Michael Chen",
      title: "Software Engineer",
      rating: 5,
    },
    {
      quote: "I've lost 15 pounds since I started using NutriScan AI to track my nutrition. Highly recommend!",
      name: "Emily Rodriguez",
      title: "Marketing Director",
      rating: 5,
    },
  ]

  // Pricing data
  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for casual users",
      features: ["10 scans per month", "Basic nutritional information", "Food identification", "Calorie counting"],
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      description: "Ideal for health enthusiasts",
      features: [
        "Unlimited scans",
        "Detailed nutritional analysis",
        "Personalized recommendations",
        "Meal history and tracking",
        "Allergen alerts",
      ],
      highlighted: true,
    },
    {
      name: "Family",
      price: "$19.99",
      period: "/month",
      description: "Perfect for households",
      features: [
        "Everything in Premium",
        "Up to 5 user profiles",
        "Family meal planning",
        "Shared grocery lists",
        "Priority support",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Scan className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">NutriScan AI</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-gray-600 transition-colors">
                How It Works
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Pricing
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
               {/* if signed in then show user button */}
              <SignedIn>
                <UserButton/>
              </SignedIn>
              {/* If not sign in i will render this */}
              <SignedOut>
              <Button variant="outline" className="hidden md:inline-flex" onClick={() => router.push('/sign-in')}>
                Log in
              </Button>
              <Button className="hidden md:inline-flex bg-black text-white hover:bg-gray-800" onClick={handleUploadclick}>Get Started</Button>
              <MobileMenu />
              </SignedOut>
              
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with 3D Model */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 relative overflow-hidden" ref={heroRef}>
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Analyze Your Food with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-black">
                  AI Precision
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                NutriScan AI instantly analyzes your meals, providing detailed nutritional information and personalized
                health insights in seconds.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-base" onClick={handleUploadclick}>
                  Start Scanning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="px-8 py-6 text-base">
                  Watch Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-2" />
                <span>No credit card required • Cancel anytime</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="h-[400px] md:h-[500px] w-full"
            >
              <NutriScanModel />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
        >
          <Link href="#features" className="flex flex-col items-center text-sm text-gray-500 hover:text-gray-800">
            <span className="mb-2">Scroll to explore</span>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Brands Section */}
      <motion.section
        className="py-12 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-gray-500 mb-8">
            TRUSTED BY LEADING HEALTH & FITNESS BRANDS
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-70">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8">
                <div className="w-24 h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28" ref={featuresRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Advanced Features Powered by AI</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover how NutriScan AI transforms your relationship with food through cutting-edge technology.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} inView={featuresInView} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gray-50" ref={howItWorksRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">How NutriScan AI Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to transform your nutrition journey</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Take a Photo",
                description: "Simply snap a picture of your meal using the NutriScan AI app.",
              },
              {
                step: "02",
                title: "AI Analysis",
                description: "Our advanced AI instantly identifies foods and calculates nutritional content.",
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Review detailed nutritional information and personalized recommendations.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="text-6xl font-bold text-gray-100 absolute -top-10 left-0">{step.step}</div>
                <div className="bg-white p-8 rounded-xl border border-gray-100 relative z-10">
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-base">
              Try It Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28" ref={testimonialsRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of satisfied users who have transformed their nutrition with NutriScan AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} inView={testimonialsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 bg-gray-50" ref={pricingRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={pricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Choose the plan that fits your nutritional needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} plan={plan} index={index} inView={pricingInView} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28" ref={ctaRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-black text-white rounded-2xl p-8 md:p-16"
            initial={{ opacity: 0, y: 50 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Nutrition Journey Today</h2>
              <p className="text-lg text-gray-300 mb-10">
                Join thousands of users who have transformed their relationship with food using NutriScan AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base">Download App</Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-base">
                  Learn More
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <Scan className="h-6 w-6 mr-2" />
                <span className="text-lg font-bold">NutriScan AI</span>
              </Link>
              <p className="text-gray-600 mb-4">Transforming nutrition through artificial intelligence.</p>
              <div className="flex space-x-4">
                {["twitter", "facebook", "instagram", "linkedin"].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-gray-500">
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-gray-600 hover:text-gray-900">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} NutriScan AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
