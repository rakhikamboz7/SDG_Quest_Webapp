"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Play,
  ExternalLink,
  BookOpen,
  Target,
  Lightbulb,
  CheckCircle,
  Globe,
  Award,
  Users,
} from "lucide-react"
import { getSDGGoal, renderRichText } from "../lib/sanity"

const GoalContent = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [goal, setGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTip, setShowTip] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [readingProgress, setReadingProgress] = useState(0)
  const [completedSections, setCompletedSections] = useState(new Set())

  useEffect(() => {
    const loadGoal = async () => {
      if (!id) return

      try {
        setLoading(true)
        const goalData = await getSDGGoal(Number.parseInt(id))
        setGoal(goalData)
      } catch (error) {
        console.error("Error loading goal:", error)
      } finally {
        setLoading(false)
      }
    }

    loadGoal()
  }, [id])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleShowTip = () => {
    setShowTip(true)
    setTimeout(() => setShowTip(false), 8000)
  }

  const markSectionComplete = (section) => {
    setCompletedSections((prev) => new Set([...prev, section]))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading SDG content...</p>
        </motion.div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Goal not found</h2>
          <p className="text-gray-600 mb-6">The requested SDG goal could not be loaded.</p>
          <button
            onClick={() => navigate("/sdg-wheel")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to SDG Wheel
          </button>
        </motion.div>
      </div>
    )
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "details", label: "Key Points", icon: Target },
    { id: "videos", label: "Videos", icon: Play },
    { id: "resources", label: "Resources", icon: ExternalLink },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 z-50"
        style={{
          width: `${readingProgress}%`,
          background: `linear-gradient(135deg, ${goal.color || "#667eea"}, ${goal.color ? goal.color + "80" : "#764ba2"})`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${readingProgress}%` }}
      />

      {/* Hero Section with Goal-Specific Colors */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${goal.color || "#667eea"} 0%, ${goal.color ? goal.color + "DD" : "#764ba2"} 100%)`,
        }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              background: [
                `radial-gradient(circle at 20% 20%, ${goal.color || "#667eea"}40 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 80%, ${goal.color || "#667eea"}40 0%, transparent 50%)`,
                `radial-gradient(circle at 20% 80%, ${goal.color || "#667eea"}40 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 20%, ${goal.color || "#667eea"}40 0%, transparent 50%)`,
                `radial-gradient(circle at 20% 20%, ${goal.color || "#667eea"}40 0%, transparent 50%)`,
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />

          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-8 w-full"
          >
            <button
              onClick={() => navigate("/sdg-wheel")}
              className="mr-8 p-4 bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 transition-all duration-300 backdrop-blur-sm border border-white border-opacity-20"
            >
              <ArrowLeft className="text-black" size={24} />
            </button>

            <div className="flex items-center space-x-8 flex-1">
              <motion.button
                onClick={handleShowTip}
                className="relative w-28 h-28 rounded-full border-2 border-white border-opacity-30 flex justify-center items-center overflow-hidden hover:scale-105 transition-transform duration-300 bg-white bg-opacity-10 backdrop-blur-sm shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: `0 0 30px ${goal.color || "#667eea"}40`,
                }}
              >
                {goal.icon ? (
                  <img
                    src={goal.icon || "/placeholder.svg"}
                    alt={goal.title}
                    className="w-25 h-25 object-contain"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error("Error loading goal icon:", goal.icon)
                      e.target.style.display = "none"
                      e.target.parentNode.innerHTML = `<div class="w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">${goal.goalNumber}</div>`
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
                    {goal.goalNumber}
                  </div>
                )}

                <AnimatePresence>
                  {showTip && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 bg-white text-gray-800 p-6 rounded-xl shadow-2xl w-80 border-l-4 z-20"
                      style={{ borderLeftColor: goal.color || "#667eea" }}
                    >
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="font-semibold mb-2">💡 Did you know?</h4>
                          <p className="text-sm text-gray-600">{goal.knowledgeBite}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              <div className="text-white flex-1">
               

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl md:text-7xl font-bold mb-4 text-white"
                >
                  Goal {goal.goalNumber}
                </motion.h1>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl md:text-4xl font-light mb-6 text-gray-200"
                >
                  {goal.title}
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl md:text-2xl font-light text-gray-300 leading-relaxed max-w-3xl"
                >
                  {goal.shortDescription}
                </motion.p>
              </div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col space-y-4"
              >
                <motion.button
                  onClick={() => navigate(`/quiz/${goal.goalNumber}`)}
                  className="group relative overflow-hidden bg-white text-gray-900 font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-3">
                    <Target size={24} style={{ color: goal.color || "#667eea" }} />
                    <span>Take Quiz</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => navigate(`/action/${goal.goalNumber}`)}
                  className="group bg-transparent border-2 border-white border-opacity-30 text-white font-medium px-8 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-3">
                    <Users size={24} />
                    <span>Take Action</span>
                  </div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-8 left-8 text-white opacity-60">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="flex items-center space-x-2 text-sm"
          >
            <Award size={16} />
            <span>Building a Better Future Together</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white shadow-lg z-40 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              const isCompleted = completedSections.has(tab.id)

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-8 py-4 font-medium transition-all duration-300 border-b-3 whitespace-nowrap relative ${
                    isActive
                      ? "text-white shadow-lg"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  style={{
                    backgroundColor: isActive ? goal.color || "#667eea" : "transparent",
                    borderBottomColor: isActive ? goal.color || "#667eea" : "transparent",
                  }}
                  whileHover={{ y: -1 }}
                >
                  <IconComponent size={18} />
                  <span className={isActive ? "text-white" : ""}>{tab.label}</span>
                  {isCompleted && <CheckCircle size={16} className="text-green-400" />}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white bg-opacity-10 rounded-t-lg"
                      layoutId="activeTab"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-12 rounded-full mr-4"
                          style={{ backgroundColor: goal.color || "#667eea" }}
                        />
                        <h3 className="text-3xl font-bold text-gray-800">Overview</h3>
                      </div>
                      <button
                        onClick={() => markSectionComplete("overview")}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          completedSections.has("overview")
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {completedSections.has("overview") ? (
                          <>
                            <CheckCircle size={16} className="inline mr-2" />
                            Completed
                          </>
                        ) : (
                          "Mark as Completed"
                        )}
                      </button>
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                      {goal.description && Array.isArray(goal.description) && goal.description.length > 0 ? (
                        <div className="space-y-4">
                          <p className="text-xl leading-relaxed">{renderRichText(goal.description)}</p>
                        </div>
                      ) : (
                        <p className="text-xl leading-relaxed">{goal.overview}</p>
                      )}
                    </div>

                    {/* Key Statistics or Facts */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8 p-6 rounded-xl"
                      style={{ backgroundColor: `${goal.color || "#667eea"}10` }}
                    >
                      <h4 className="text-lg font-semibold mb-3" style={{ color: goal.color || "#667eea" }}>
                        💡 Key Insight
                      </h4>
                      <p className="text-gray-700 italic">
                        {goal.knowledgeBite ||
                          "This goal is essential for creating a sustainable and equitable future for all."}
                      </p>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Sidebar with Hero Image */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sticky top-24"
                  >
                    {/* Hero Image with Animation */}
                    {goal.heroImage && (
                      <motion.div
                        className="relative overflow-hidden rounded-2xl shadow-2xl mb-6 group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.img
                          src={goal.heroImage}
                          alt={goal.title}
                          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          onError={(e) => {
                            console.error("Error loading hero image:", goal.heroImage)
                            e.target.src = "/placeholder.svg?height=320&width=400"
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        <motion.div
                          className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <span className="text-sm font-bold" style={{ color: goal.color || "#667eea" }}>
                            SDG {goal.goalNumber}
                          </span>
                        </motion.div>

                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-white font-bold text-lg leading-tight">{goal.title}</h4>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Cards */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-4"
                    >
                      <motion.div
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        whileHover={{ y: -2 }}
                        onClick={() => navigate(`/quiz/${goal.goalNumber}`)}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${goal.color || "#667eea"}20` }}
                          >
                            <Target size={24} style={{ color: goal.color || "#667eea" }} />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-800">Test Knowledge</h5>
                            <p className="text-sm text-gray-600">Take the interactive quiz</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                        whileHover={{ y: -2 }}
                        onClick={() => navigate(`/action/${goal.goalNumber}`)}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${goal.color || "#667eea"}20` }}
                          >
                            <Users size={24} style={{ color: goal.color || "#667eea" }} />
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-800">Take Action</h5>
                            <p className="text-sm text-gray-600">Make a real difference</p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-12 rounded-full mr-4"
                        style={{ backgroundColor: goal.color || "#667eea" }}
                      />
                      <h3 className="text-3xl font-bold text-gray-800">Key Objectives</h3>
                    </div>
                    <button
                      onClick={() => markSectionComplete("details")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        completedSections.has("details")
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {completedSections.has("details") ? (
                        <>
                          <CheckCircle size={16} className="inline mr-2" />
                          Completed
                        </>
                      ) : (
                        "Mark as Completed"
                      )}
                    </button>
                  </div>

                  <div className="grid gap-6">
                    {goal.keyPoints?.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-6 p-6 rounded-xl hover:shadow-lg transition-all duration-300"
                        style={{ backgroundColor: `${goal.color || "#667eea"}05` }}
                        whileHover={{ x: 5 }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg"
                          style={{ backgroundColor: goal.color || "#667eea" }}
                        >
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed text-lg">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "videos" && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-12 rounded-full mr-4"
                        style={{ backgroundColor: goal.color || "#667eea" }}
                      />
                      <h3 className="text-3xl font-bold text-gray-800">Related Videos</h3>
                    </div>
                    <button
                      onClick={() => markSectionComplete("videos")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        completedSections.has("videos")
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {completedSections.has("videos") ? (
                        <>
                          <CheckCircle size={16} className="inline mr-2" />
                          Completed
                        </>
                      ) : (
                        "Mark as Completed"
                      )}
                    </button>
                  </div>

                  {goal.videos && goal.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {goal.videos.map((video, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                          whileHover={{ y: -5 }}
                        >
                          <div className="aspect-video relative">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${video.youtubeId}`}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            />
                          </div>
                          <div className="p-6 bg-white">
                            <h4 className="font-bold text-gray-800 mb-3 text-lg">{video.title}</h4>
                            {video.description && <p className="text-gray-600 leading-relaxed">{video.description}</p>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Play className="mx-auto text-gray-400 mb-6" size={64} />
                      <h4 className="text-xl font-semibold text-gray-600 mb-2">No Videos Available</h4>
                      <p className="text-gray-500">Educational videos for this goal will be added soon.</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-12 rounded-full mr-4"
                        style={{ backgroundColor: goal.color || "#667eea" }}
                      />
                      <h3 className="text-3xl font-bold text-gray-800">Additional Resources</h3>
                    </div>
                    <button
                      onClick={() => markSectionComplete("resources")}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        completedSections.has("resources")
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {completedSections.has("resources") ? (
                        <>
                          <CheckCircle size={16} className="inline mr-2" />
                          Completed
                        </>
                      ) : (
                        "Mark as Completed"
                      )}
                    </button>
                  </div>

                  {goal.resources && goal.resources.length > 0 ? (
                    <div className="space-y-4">
                      {goal.resources.map((resource, index) => (
                        <motion.a
                          key={index}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="block p-6 rounded-xl hover:shadow-lg transition-all duration-300 group border border-gray-100"
                          style={{ backgroundColor: `${goal.color || "#667eea"}03` }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg mb-2">
                                {resource.title}
                              </h4>
                              {resource.description && (
                                <p className="text-gray-600 leading-relaxed">{resource.description}</p>
                              )}
                            </div>
                            <ExternalLink
                              className="text-gray-400 group-hover:text-blue-600 transition-colors ml-4"
                              size={24}
                            />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <ExternalLink className="mx-auto text-gray-400 mb-6" size={64} />
                      <h4 className="text-xl font-semibold text-gray-600 mb-2">No Resources Available</h4>
                      <p className="text-gray-500">Additional learning resources will be added soon.</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default GoalContent
