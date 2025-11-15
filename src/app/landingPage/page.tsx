"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"
import {
  Shield,
  FileText,
  ImageIcon,
  Brain,
  Users,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  Play,
  RotateCcw,
  EyeOff,
  Sparkles,
  Star,
  TrendingUp,
  Cpu,
} from "lucide-react"

interface RedactableText {
  id: string
  text: string
  type: "financial" | "personal" | "sensitive"
  isRedacted: boolean
  position: { x: number; y: number }
}

interface FloatingShape {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
}

export default function LandingPage() {
  const [redactableTexts, setRedactableTexts] = useState<RedactableText[]>([
    { id: "1", text: "John Smith", type: "personal", isRedacted: false, position: { x: 0, y: 0 } },
    { id: "2", text: "$125,000.00", type: "financial", isRedacted: false, position: { x: 0, y: 0 } },
    { id: "3", text: "555-123-4567", type: "personal", isRedacted: false, position: { x: 0, y: 0 } },
    { id: "4", text: "Account #: 4532-1234-5678-9012", type: "financial", isRedacted: false, position: { x: 0, y: 0 } },
    { id: "5", text: "SSN: 123-45-6789", type: "sensitive", isRedacted: false, position: { x: 0, y: 0 } },
    { id: "6", text: "john.smith@email.com", type: "personal", isRedacted: false, position: { x: 0, y: 0 } },
  ])

  const [isAutoRedacting, setIsAutoRedacting] = useState(false)
  const [showRedactionTypes, setShowRedactionTypes] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [floatingShapes, setFloatingShapes] = useState<FloatingShape[]>([])
  const [statsVisible, setStatsVisible] = useState(false)
  const [currentStats, setCurrentStats] = useState({ accuracy: 0, documents: 0, clients: 0 })

  // Initialize floating shapes
  useEffect(() => {
    const shapes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 60 + 20,
      color: ["bg-indigo-200/20", "bg-purple-200/20", "bg-blue-200/20", "bg-pink-200/20"][
        Math.floor(Math.random() * 4)
      ],
      duration: Math.random() * 20 + 10,
    }))
    setFloatingShapes(shapes)
    setIsVisible(true)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Animated counter for stats
  useEffect(() => {
    if (statsVisible) {
      const animateCounter = (target: number, setter: (value: number) => void, duration = 2000) => {
        let start = 0
        const increment = target / (duration / 16)
        const timer = setInterval(() => {
          start += increment
          if (start >= target) {
            setter(target)
            clearInterval(timer)
          } else {
            setter(Math.floor(start))
          }
        }, 16)
      }

      animateCounter(99.9, (val) => setCurrentStats((prev) => ({ ...prev, accuracy: val })))
      animateCounter(10000000, (val) => setCurrentStats((prev) => ({ ...prev, documents: val })))
      animateCounter(500, (val) => setCurrentStats((prev) => ({ ...prev, clients: val })))
    }
  }, [statsVisible])

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "stats-section") {
              setStatsVisible(true)
            }
            entry.target.classList.add("animate-in")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleTextClick = (id: string) => {
    setRedactableTexts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRedacted: !item.isRedacted } : item)),
    )
  }

  const autoRedactAll = async () => {
    setIsAutoRedacting(true)

    for (let i = 0; i < redactableTexts.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      setRedactableTexts((prev) => prev.map((item, index) => (index === i ? { ...item, isRedacted: true } : item)))
    }

    setIsAutoRedacting(false)
  }

  const resetRedaction = () => {
    setRedactableTexts((prev) => prev.map((item) => ({ ...item, isRedacted: false })))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {floatingShapes.map((shape) => (
          <div
            key={shape.id}
            className={`absolute rounded-full ${shape.color} blur-xl animate-float`}
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              animationDuration: `${shape.duration}s`,
              animationDelay: `${shape.id * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Interactive Cursor Effect */}
      <div
        className="fixed w-6 h-6 bg-indigo-400/30 rounded-full pointer-events-none z-50 transition-all duration-300 ease-out blur-sm"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: "scale(1)",
        }}
      />

      {/* Navigation */}
     
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>

        <div className="container mx-auto relative">
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className={`mb-6 bg-indigo-100 text-indigo-700 border-indigo-200 animate-bounce-slow transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <Sparkles className="h-4 w-4 mr-2 animate-spin-slow" />
              Intelligent Document Redaction System
            </Badge>

            <h1
              className={`text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
            >
              <span className="inline-block animate-fade-in-up">Secure Your</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 block animate-gradient-x animate-fade-in-up delay-200">
                Documents
              </span>
              <span className="text-4xl md:text-5xl text-gray-600 font-normal block animate-fade-in-up delay-400">
                with AI Precision
              </span>
            </h1>

            <p
              className={`text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              Protect sensitive information with our advanced AI models. Click on any sensitive text below to see
              instant redaction in action.
            </p>
          </div>

          {/* Interactive Demo */}
          <div
            className={`max-w-5xl mx-auto transition-all duration-1000 delay-1200 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200 overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]">
              {/* Demo Header */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 animate-pulse-slow"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 animate-bounce-slow" />
                    <span className="font-semibold text-lg">Financial_Report_2024.pdf</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={autoRedactAll}
                      disabled={isAutoRedacting}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 transform hover:scale-105 transition-all duration-300"
                    >
                      {isAutoRedacting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Auto Redacting...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Auto Redact
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={resetRedaction}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 transform hover:scale-105 transition-all duration-300"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                <div className="bg-white rounded-xl p-8 shadow-sm border hover:shadow-md transition-all duration-300">
                  <div className="space-y-6 text-gray-800 leading-relaxed">
                    <div className="border-b pb-4 animate-fade-in">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">CONFIDENTIAL FINANCIAL REPORT</h2>
                      <p className="text-sm text-gray-500">Document ID: FR-2024-001 | Classification: Restricted</p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-lg font-semibold animate-fade-in delay-100">
                        <strong>Client Information:</strong>
                      </p>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-6 rounded-xl space-y-3 animate-fade-in delay-200">
                        <p className="flex items-center">
                          <span className="text-gray-600 w-16">Name:</span>
                          <span
                            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                              redactableTexts[0].isRedacted
                                ? "bg-blue-500 text-transparent select-none animate-pulse shadow-lg"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-md"
                            }`}
                            onClick={() => handleTextClick("1")}
                          >
                            {redactableTexts[0].isRedacted ? "████████" : redactableTexts[0].text}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-gray-600 w-16">Email:</span>
                          <span
                            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                              redactableTexts[5].isRedacted
                                ? "bg-blue-500 text-transparent select-none animate-pulse shadow-lg"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-md"
                            }`}
                            onClick={() => handleTextClick("6")}
                          >
                            {redactableTexts[5].isRedacted ? "████████████████" : redactableTexts[5].text}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-gray-600 w-16">Phone:</span>
                          <span
                            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                              redactableTexts[2].isRedacted
                                ? "bg-blue-500 text-transparent select-none animate-pulse shadow-lg"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200 hover:shadow-md"
                            }`}
                            onClick={() => handleTextClick("3")}
                          >
                            {redactableTexts[2].isRedacted ? "████████████" : redactableTexts[2].text}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-gray-600 w-16">SSN:</span>
                          <span
                            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                              redactableTexts[4].isRedacted
                                ? "bg-purple-500 text-transparent select-none animate-pulse shadow-lg"
                                : "bg-purple-100 text-purple-800 hover:bg-purple-200 hover:shadow-md"
                            }`}
                            onClick={() => handleTextClick("5")}
                          >
                            {redactableTexts[4].isRedacted ? "███████████" : redactableTexts[4].text}
                          </span>
                        </p>
                      </div>

                      <p className="text-lg font-semibold animate-fade-in delay-300">
                        <strong>Financial Summary:</strong>
                      </p>
                      <div className="bg-gradient-to-r from-gray-50 to-red-50/30 p-6 rounded-xl space-y-3 animate-fade-in delay-400">
                        <p className="flex items-center">
                          <span className="text-gray-600 w-32">Portfolio Value:</span>
                          <span
                            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                              redactableTexts[1].isRedacted
                                ? "bg-red-500 text-transparent select-none animate-pulse shadow-lg"
                                : "bg-red-100 text-red-800 hover:bg-red-200 hover:shadow-md"
                            }`}
                            onClick={() => handleTextClick("2")}
                          >
                            {redactableTexts[1].isRedacted ? "██████████" : redactableTexts[1].text}
                          </span>
                        </p>
                        <p className="flex items-center">
                          <span className="text-gray-600 w-32">Account:</span>
                          <span
                            className={`inline-block px-4 py-2 rounded-lg cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                              redactableTexts[3].isRedacted
                                ? "bg-red-500 text-transparent select-none animate-pulse shadow-lg"
                                : "bg-red-100 text-red-800 hover:bg-red-200 hover:shadow-md"
                            }`}
                            onClick={() => handleTextClick("4")}
                          >
                            {redactableTexts[3].isRedacted ? "████████████████████████" : redactableTexts[3].text}
                          </span>
                        </p>
                        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-400">
                          <p className="text-sm text-gray-600 flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-yellow-600" />
                            This document contains sensitive financial and personal information protected under federal
                            privacy regulations.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              {showRedactionTypes && (
                <div className="bg-white border-t p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Cpu className="h-5 w-5 mr-2 text-indigo-600" />
                      AI Detection Types
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRedactionTypes(false)}
                      className="hover:bg-gray-100 transition-all duration-300"
                    >
                      <EyeOff className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                      <div className="w-4 h-4 bg-red-500 rounded animate-pulse"></div>
                      <div>
                        <p className="font-medium text-red-800">Financial Data</p>
                        <p className="text-sm text-red-600">Account numbers, amounts</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                      <div className="w-4 h-4 bg-blue-500 rounded animate-pulse delay-100"></div>
                      <div>
                        <p className="font-medium text-blue-800">Personal Info</p>
                        <p className="text-sm text-blue-600">Names, emails, phones</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
                      <div className="w-4 h-4 bg-purple-500 rounded animate-pulse delay-200"></div>
                      <div>
                        <p className="font-medium text-purple-800">Sensitive Data</p>
                        <p className="text-sm text-purple-600">SSN, government IDs</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Instructions */}
            <div className="text-center mt-8 animate-fade-in delay-500">
              <p className="text-lg text-gray-600 mb-6 flex items-center justify-center">
                <span className="animate-bounce mr-2">👆</span>
                <strong>Try it yourself!</strong>
                <span className="ml-2">Click on any highlighted text to redact it instantly</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50 bg-transparent transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  Watch Full Demo
                  <Play className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white scroll-animate">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-indigo-100 text-indigo-700 animate-bounce-slow">
              <Brain className="h-4 w-4 mr-2 animate-pulse" />
              AI-Powered Features
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                AutoRedact
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced machine learning models ensure precise, reliable, and compliant document redaction
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ImageIcon,
                title: "Image Redaction",
                description:
                  "Advanced UNet model for precise image segmentation and redaction of sensitive visual content.",
                color: "indigo",
                features: ["Drag & drop upload", "Real-time preview", "Instant download"],
              },
              {
                icon: FileText,
                title: "Document Processing",
                description:
                  "GLiNER model for Named Entity Recognition to automatically detect and redact sensitive information.",
                color: "purple",
                features: ["PDF & image support", "Batch processing", "Smart entity detection"],
              },
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description:
                  "Intelligent recognition of financial data, personal information, and other sensitive content types.",
                color: "green",
                features: ["99.9% accuracy rate", "Custom entity training", "Multi-language support"],
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Comprehensive dashboard to manage your redaction history, recent files, and team workflows.",
                color: "blue",
                features: ["Team workspaces", "Processing history", "Usage analytics"],
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description:
                  "Bank-grade security with encrypted processing, secure file storage, and compliance-ready features.",
                color: "red",
                features: ["End-to-end encryption", "GDPR compliant", "SOC 2 certified"],
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Process thousands of documents in minutes with our optimized AI pipeline and cloud infrastructure.",
                color: "yellow",
                features: ["Batch processing", "API integration", "Real-time results"],
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-indigo-200 transition-all duration-500 hover:shadow-xl group transform hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-8">
                  <div
                    className={`bg-${feature.color}-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-${feature.color}-200 transition-all duration-300 group-hover:scale-110`}
                  >
                    <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {feature.features.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center group-hover:text-gray-700 transition-colors duration-300"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 group-hover:scale-110 transition-transform duration-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats-section"
        className="py-20 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden scroll-animate"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 animate-pulse-slow"></div>
        <div className="container mx-auto relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in">Trusted by Industry Leaders</h2>
            <p className="text-xl text-indigo-100 animate-fade-in delay-200">
              Join thousands of organizations protecting their sensitive data
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-fade-in-up">
              <div className="text-4xl font-bold mb-2">{statsVisible ? `${currentStats.accuracy}%` : "0%"}</div>
              <div className="text-indigo-100">Accuracy Rate</div>
              <TrendingUp className="h-6 w-6 mx-auto mt-2 text-green-300 animate-bounce-slow" />
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-100">
              <div className="text-4xl font-bold mb-2">
                {statsVisible ? `${Math.floor(currentStats.documents / 1000000)}M+` : "0M+"}
              </div>
              <div className="text-indigo-100">Documents Processed</div>
              <FileText className="h-6 w-6 mx-auto mt-2 text-blue-300 animate-bounce-slow delay-100" />
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-200">
              <div className="text-4xl font-bold mb-2">{statsVisible ? `${currentStats.clients}+` : "0+"}</div>
              <div className="text-indigo-100">Enterprise Clients</div>
              <Users className="h-6 w-6 mx-auto mt-2 text-purple-300 animate-bounce-slow delay-200" />
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-fade-in-up delay-300">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-indigo-100">Support Available</div>
              <Shield className="h-6 w-6 mx-auto mt-2 text-yellow-300 animate-bounce-slow delay-300" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white scroll-animate">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-indigo-100 text-indigo-700 animate-bounce-slow">
              <Star className="h-4 w-4 mr-2 animate-spin-slow" />
              Ready to Get Started?
            </Badge>
            <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-in">
              Secure Your Documents
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 block animate-gradient-x">
                in Minutes, Not Hours
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in delay-200">
              Join thousands of organizations that trust AutoRedact for their document security needs. Start your free
              trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-400">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-12 py-6 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 py-6 rounded-2xl border-indigo-200 text-indigo-600 hover:bg-indigo-50 bg-transparent transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                Schedule Demo
                <Users className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-6 animate-fade-in delay-600">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 scroll-animate">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="animate-fade-in">
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold">AutoRedact</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered document redaction for enterprise security and compliance.
              </p>
              <div className="flex space-x-4">
                {["f", "t", "in"].map((social, index) => (
                  <div
                    key={social}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer transform hover:scale-110 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-sm font-bold">{social}</span>
                  </div>
                ))}
              </div>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "API", "Integrations"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Support",
                links: ["Help Center", "Documentation", "Security", "Privacy"],
              },
            ].map((section, index) => (
              <div key={section.title} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 200}ms` }}>
                <h4 className="font-semibold mb-4 text-lg">{section.title}</h4>
                <ul className="space-y-3 text-gray-400">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-white transition-all duration-300 hover:translate-x-1">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 animate-fade-in delay-1000">
            <p>&copy; 2024 AutoRedact. All rights reserved. Built with ❤️ for document security.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-fade-in {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease-out;
        }
        
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
