"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Play,
  ExternalLink,
  BookOpen,
  Target,
  Users,
  Lightbulb,
  CheckCircle,
  Globe,
  ChevronRight,
} from "lucide-react"
import { getSDGGoal, urlFor } from "../lib/sanity"

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
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 z-50"
        style={{ width: `${readingProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${readingProgress}%` }}
      />

      {/* Hero Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden min-h-[500px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={`/images/sdg-goals/goal-${goal.goalNumber}.${goal.goalNumber === 8 ? "webp" : "jpg"}`}
            alt={goal.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.src = "/placeholder.svg?height=500&width=1200"
            }}
          />
          {/* Enhanced Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, 
                ${goal.color}E6 0%, 
                ${goal.color}CC 25%, 
                ${goal.color}B3 50%, 
                ${goal.color}CC 75%, 
                ${goal.color}E6 100%
              )`,
            }}
          />
          {/* Additional texture overlay
          <div className="absolute inset-0 bg-black bg-opacity-20" /> */}

          {/* Animated Pattern Overlay */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              background: [
                `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 min-h-[500px] flex items-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center mb-6 w-full"
          >
            <button
              onClick={() => navigate("/sdg-wheel")}
              className="mr-6 p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm border border-white border-opacity-30"
            >
              <ArrowLeft className="text-black" size={24} />
            </button>

            <div className="flex items-center space-x-6 flex-1">
              <motion.button
                onClick={handleShowTip}
                className="relative w-24 h-24 rounded-full border-4 border-white flex justify-center items-center overflow-hidden hover:scale-105 transition-transform duration-300 bg-white bg-opacity-20 backdrop-blur-sm shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderColor: "rgba(255,255,255,0.8)" }}
              >
                <img
                  src={goal.icon || "/placeholder.svg"}
                  alt={goal.title}
                  className="w-16 h-16 object-contain"
                  crossOrigin="anonymous"
                />

                <AnimatePresence>
                  {showTip && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-white text-gray-800 p-4 rounded-lg shadow-2xl w-80 border-l-4 z-20"
                      style={{ borderLeftColor: goal.color }}
                    >
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="text-yellow-500 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <h4 className="font-semibold mb-1">💡 Did you know?</h4>
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
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-6xl font-bold mb-3 text-shadow-lg"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Goal {goal.goalNumber}
                </motion.h1>
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl md:text-3xl font-medium mb-4 text-shadow"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {goal.title}
                </motion.h2>

                {/* Add shortDescription here */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="text-lg md:text-xl font-medium mb-4 text-shadow opacity-90"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {goal.shortDescription}
                </motion.p>

                {/* <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl leading-relaxed max-w-3xl text-shadow"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  {goal.overview}
                </motion.p> */}
              </div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col space-y-4"
              >
                <motion.button
                  onClick={() => navigate(`/quiz/${goal.goalNumber}`)}
                  className="bg-white text-gray-800 font-bold px-8 py-4 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center space-x-3 border-2 border-white border-opacity-30"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Target size={24} style={{ color: goal.color }} />
                  <span>Take Quiz</span>
                </motion.button>

                {/* <Link to={`/goal/${goal.goalNumber}`}>
                  <motion.button
                    className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-gray-800 transition-all duration-300 shadow-xl flex items-center space-x-3 backdrop-blur-sm"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen size={24} />
                    <span>📚 Learn More</span>
                  </motion.button>
                </Link> */}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-8 left-8 text-white opacity-75">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            className="flex items-center space-x-2 text-sm"
          >
            <Globe size={16} />
            <span>UN Sustainable Development Goals 2030</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 bg-white shadow-md z-40">
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
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 whitespace-nowrap ${
                    isActive
                      ? "border-blue-500 text-blue-600 bg-blue-50"
                      : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  whileHover={{ y: -1 }}
                >
                  <IconComponent size={18} />
                  <span>{tab.label}</span>
                  {isCompleted && <CheckCircle size={16} className="text-green-500" />}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                {goal.heroImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <img
                      src={urlFor(goal.heroImage).width(800).height(400).url() || "/placeholder.svg"}
                      alt={goal.title}
                      className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  onViewportEnter={() => markSectionComplete("overview")}
                >
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Overview</h3>
                  <div className="prose prose-lg max-w-none text-gray-700">
                    {goal.description && goal.description.length > 0 ? (
                      // Render rich text from Sanity
                      <div>
                        {goal.description.map((block, index) => (
                          <p key={index} className="mb-4 leading-relaxed">
                            {block.children?.map((child) => child.text).join("")}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="leading-relaxed">{goal.overview}</p>
                    )}
                  </div>
                </motion.div>
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
              <div className="bg-white rounded-xl shadow-lg p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onViewportEnter={() => markSectionComplete("details")}
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Key Objectives</h3>
                  <div className="grid gap-4">
                    {goal.keyPoints?.map((point, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: goal.color }}
                        >
                          {index + 1}
                        </div>
                        <p className="text-gray-700 leading-relaxed">{point}</p>
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
              <div className="bg-white rounded-xl shadow-lg p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onViewportEnter={() => markSectionComplete("videos")}
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Related Videos</h3>
                  {goal.videos && goal.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {goal.videos.map((video, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="aspect-video">
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
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">{video.title}</h4>
                            {video.description && <p className="text-sm text-gray-600">{video.description}</p>}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Play className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500">No videos available for this goal yet.</p>
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
              <div className="bg-white rounded-xl shadow-lg p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onViewportEnter={() => markSectionComplete("resources")}
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Additional Resources</h3>
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
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {resource.title}
                              </h4>
                              {resource.description && (
                                <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                              )}
                            </div>
                            <ExternalLink
                              className="text-gray-400 group-hover:text-blue-600 transition-colors"
                              size={20}
                            />
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ExternalLink className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500">No additional resources available for this goal yet.</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === "interactive" && (
            <motion.div
              key="interactive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-xl shadow-lg p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onViewportEnter={() => markSectionComplete("interactive")}
                >
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">Interactive Elements</h3>
                  {goal.interactiveElements && goal.interactiveElements.length > 0 ? (
                    <div className="space-y-6">
                      {goal.interactiveElements.map((element, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-3 mb-4">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                              style={{ backgroundColor: goal.color }}
                            >
                              {element.type === "quiz" && <Target size={20} />}
                              {element.type === "infographic" && <Globe size={20} />}
                              {element.type === "challenge" && <Users size={20} />}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{element.title}</h4>
                              <span className="text-sm text-gray-500 capitalize">{element.type}</span>
                            </div>
                          </div>

                          <div className="prose prose-sm max-w-none text-gray-700">
                            {element.content?.map((block, blockIndex) => (
                              <p key={blockIndex} className="mb-2">
                                {block.children?.map((child) => child.text).join("")}
                              </p>
                            ))}
                          </div>

                          <motion.button
                            className="mt-4 inline-flex items-center px-4 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: goal.color }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Play size={16} className="mr-2" />
                            Start{" "}
                            {element.type === "quiz" ? "Quiz" : element.type === "challenge" ? "Challenge" : "Activity"}
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500 mb-4">No interactive elements available for this goal yet.</p>
                      <motion.button
                        onClick={() => navigate(`/quiz/${goal.goalNumber}`)}
                        className="inline-flex items-center px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: goal.color }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Target size={20} className="mr-2" />
                        Take Quiz Instead
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-t border-gray-200 py-8"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Learning Progress</h4>
                  <p className="text-sm text-gray-600">
                    {completedSections.size} of {tabs.length} sections completed
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        completedSections.has(tab.id) ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <motion.button
                  onClick={() => navigate(`/quiz/${goal.goalNumber}`)}
                  className="inline-flex items-center px-6 py-3 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ backgroundColor: goal.color }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target size={20} className="mr-2" />
                  Test Your Knowledge
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Footer */}
      <div className="bg-gray-50 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <motion.button
              onClick={() => {
                const prevGoal = goal.goalNumber === 1 ? 17 : goal.goalNumber - 1
                navigate(`/goal/${prevGoal}`)
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              whileHover={{ x: -2 }}
            >
              <ArrowLeft size={20} />
              <span>Previous Goal</span>
            </motion.button>

            <motion.button
              onClick={() => navigate("/sdg-wheel")}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Globe size={20} />
              <span>Back to Wheel</span>
            </motion.button>

            <motion.button
              onClick={() => {
                const nextGoal = goal.goalNumber === 17 ? 1 : goal.goalNumber + 1
                navigate(`/goal/${nextGoal}`)
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              whileHover={{ x: 2 }}
            >
              <span>Next Goal</span>
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoalContent
