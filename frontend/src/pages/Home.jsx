"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { ChevronRight, Play, Target, Users, Lightbulb, Trophy, Sparkles, Zap, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"
import { getSDGGoals } from "../lib/sanity"
import { goalDetails } from "../goalDetail"

const EnhancedSDGWheel = () => {
  const [goals, setGoals] = useState(Object.values(goalDetails))
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [spinHistory, setSpinHistory] = useState([])
  const [userProgress, setUserProgress] = useState(new Set())
  const [showCelebration, setShowCelebration] = useState(false)
  const [showKnowledgeBite, setShowKnowledgeBite] = useState(false)
  const [currentKnowledgeBite, setCurrentKnowledgeBite] = useState("")
  const [streakCount, setStreakCount] = useState(0)
  const [showStreak, setShowStreak] = useState(false)
  const [achievements, setAchievements] = useState([])
  const [showAchievement, setShowAchievement] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState(null)
  const [spinButtonText, setSpinButtonText] = useState("Spin the Wheel!")
  const [isHovering, setIsHovering] = useState(false)
  const [hoveredGoal, setHoveredGoal] = useState(null)

  const wheelRef = useRef(null)
  const contentControls = useAnimation()

  // Load goals from Sanity with fallback
  useEffect(() => {
    const loadGoals = async () => {
      try {
        const fetchedGoals = await getSDGGoals()
        if (fetchedGoals && fetchedGoals.length > 0) {
          setGoals(fetchedGoals)
        } else {
          // Use static data as fallback
          setGoals(Object.values(goalDetails))
        }
      } catch (error) {
        console.error("Error loading SDG goals, using static data:", error)
        // Use static data as fallback
        setGoals(Object.values(goalDetails))
      }
    }
    loadGoals()
  }, [])

  // Achievement system
  const checkAchievements = (newSpinCount, newProgressSize) => {
    const newAchievements = []

    if (newSpinCount === 1)
      newAchievements.push({
        id: "first-spin",
        title: "First Spin!",
        icon: "🎯",
        description: "Welcome to your SDG journey!",
      })
    if (newSpinCount === 5)
      newAchievements.push({ id: "explorer", title: "Explorer", icon: "🗺️", description: "You've spun 5 times!" })
    if (newSpinCount === 10)
      newAchievements.push({
        id: "adventurer",
        title: "Adventurer",
        icon: "⭐",
        description: "Double digits - 10 spins!",
      })
    if (newProgressSize === 5)
      newAchievements.push({
        id: "learner",
        title: "Quick Learner",
        icon: "📚",
        description: "Discovered 5 different goals!",
      })
    if (newProgressSize === 10)
      newAchievements.push({ id: "scholar", title: "SDG Scholar", icon: "🎓", description: "Explored 10 goals!" })
    if (newProgressSize === 17)
      newAchievements.push({
        id: "master",
        title: "SDG Master!",
        icon: "👑",
        description: "You've discovered all 17 goals!",
      })

    newAchievements.forEach((achievement) => {
      if (!achievements.find((a) => a.id === achievement.id)) {
        setAchievements((prev) => [...prev, achievement])
        setCurrentAchievement(achievement)
        setShowAchievement(true)
        setTimeout(() => setShowAchievement(false), 4000)
      }
    })
  }

  const calculateRotationForGoal = (goalNumber) => {
    const segmentAngle = 360 / 17
    return -((goalNumber + 3) * segmentAngle + segmentAngle / 2)
  }

  const spinWheel = () => {
    if (isSpinning || goals.length === 0) return

    setSpinButtonText("🌟 Spinning...")
    setIsSpinning(true)
    setShowContent(false)

    const newGoalNumber = Math.floor(Math.random() * 17) + 1
    const targetRotation = calculateRotationForGoal(newGoalNumber)
    const fullRotations = -(3 + Math.floor(Math.random() * 3)) * 360
    const newRotation = fullRotations + targetRotation

    setWheelRotation(newRotation)

    // Update history and progress
    const updatedHistory = [...spinHistory]
    if (updatedHistory.length >= 5) updatedHistory.shift()
    updatedHistory.push(newGoalNumber)
    setSpinHistory(updatedHistory)

    const newSpinCount = spinCount + 1
    setSpinCount(newSpinCount)

    // Show knowledge bite during spin
    const selectedGoalData = goals.find((g) => g.goalNumber === newGoalNumber)
    if (selectedGoalData?.knowledgeBite) {
      setTimeout(() => {
        setCurrentKnowledgeBite(selectedGoalData.knowledgeBite)
        setShowKnowledgeBite(true)
      }, 3000)
    }

    setTimeout(() => {
      setIsSpinning(false)
      setSelectedGoal(newGoalNumber)
      setShowContent(true)
      setSpinButtonText("Spin Again!")

      const newProgress = new Set([...userProgress, newGoalNumber])
      setUserProgress(newProgress)

      // Check for achievements
      checkAchievements(newSpinCount, newProgress.size)

   

      // Update streak
      if (
        updatedHistory.length >= 2 &&
        updatedHistory[updatedHistory.length - 1] !== updatedHistory[updatedHistory.length - 2]
      ) {
        setStreakCount((prev) => prev + 1)
        if (streakCount > 0 && streakCount % 3 === 0) {
          setShowStreak(true)
          setTimeout(() => setShowStreak(false), 3000)
        }
      }

      setTimeout(() => setShowKnowledgeBite(false), 6000)
    }, 3500)
  }

  const handleGoalClick = (goalNumber, e) => {
    e.preventDefault()
    if (isSpinning || goals.length === 0) return

    if (selectedGoal === goalNumber) {
      setShowContent(!showContent)
      return
    }

    setIsSpinning(true)
    setShowContent(false)
    setSpinButtonText("🌟 Spinning...")

    const targetRotation = calculateRotationForGoal(goalNumber)
    const fullRotation = -360
    const newRotation = fullRotation + targetRotation

    setWheelRotation(newRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setSelectedGoal(goalNumber)
      setShowContent(true)
      setSpinButtonText("Spin Again!")
      setUserProgress((prev) => new Set([...prev, goalNumber]))

      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }, 1500)
  }

  useEffect(() => {
    if (showContent) {
      contentControls.start("visible")
    } else {
      contentControls.start("hidden")
    }
  }, [showContent, contentControls])

  const currentGoal = selectedGoal ? goals.find((goal) => goal.goalNumber === selectedGoal) : null
  const primaryColor = "#005f5a"



  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 py-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Floating Celebration Particles */}
     
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && currentAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl shadow-2xl p-6 max-w-sm border-4 border-yellow-300"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{currentAchievement.icon}</div>
              <h3 className="text-xl font-bold mb-1">🏆 Achievement Unlocked!</h3>
              <h4 className="text-lg font-semibold">{currentAchievement.title}</h4>
              <p className="text-sm opacity-90">{currentAchievement.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streak Notification */}
      <AnimatePresence>
        {showStreak && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100 }}
            className="fixed top-32 right-8 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-xl p-4"
          >
            <div className="flex items-center space-x-2">
              <Zap className="text-yellow-300" size={24} />
              <div>
                <h4 className="font-bold">🔥 Streak: {streakCount}</h4>
                <p className="text-sm">You're on fire!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Knowledge Bite */}
      <AnimatePresence>
        {showKnowledgeBite && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl p-6 max-w-md border-l-4 border-yellow-400"
          >
            <div className="flex items-start space-x-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
              >
                <Lightbulb className="text-yellow-500 mt-1 flex-shrink-0" size={24} />
              </motion.div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">💡 Did you know?</h4>
                <p className="text-sm text-gray-600">{currentKnowledgeBite}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress and Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-white rounded-xl shadow-lg p-4 flex items-center justify-between w-full max-w-4xl"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="text-yellow-500" size={20} />
            <span className="text-sm font-medium text-gray-700">Progress: {userProgress.size}/17</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="text-blue-500" size={20} />
            <span className="text-sm font-medium text-gray-700">Spins: {spinCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="text-purple-500" size={20} />
            <span className="text-sm font-medium text-gray-700">Streak: {streakCount}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-3 w-32">
            <motion.div
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(userProgress.size / 17) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-xs text-gray-500 font-medium">{Math.round((userProgress.size / 17) * 100)}%</span>
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="mb-8 text-4xl font-bold text-center bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Sustainable Development Goals
      </motion.h1>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-start lg:flex-row lg:items-start lg:justify-between">
          {/* SDG Wheel Container */}
          <div className="relative flex items-center justify-center w-full max-w-md lg:w-2/5 mb-8 lg:mb-0">
            {/* Magical Background Effects */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-20 blur-xl"
              style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Spinning Wheel */}
            <motion.div
              className="relative"
              style={{ width: "min(100%, 400px)", height: "min(100%, 400px)" }}
              initial={{ rotate: 0 }}
              animate={{
                rotate: wheelRotation,
                transition: {
                  type: isSpinning ? "spring" : "tween",
                  duration: isSpinning ? 3.5 : 1.5,
                  ease: isSpinning ? "easeOut" : [0.42, 0, 0.58, 1],
                  bounce: isSpinning ? 0.25 : 0,
                },
              }}
              onHoverStart={() => setIsHovering(true)}
              onHoverEnd={() => setIsHovering(false)}
            >
              <svg
                ref={wheelRef}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 500"
                className="w-full h-full transition-transform duration-1000 ease-in-out"
              >
                <g transform="translate(250, 250)">
                  {goals.map((goal, index) => {
                    const innerRadius = 80
                    const outerRadius = 200
                    const startAngle = ((index * 360) / 17) * (Math.PI / 180)
                    const endAngle = (((index + 1) * 360) / 17) * (Math.PI / 180)

                    const innerStartX = innerRadius * Math.cos(startAngle)
                    const innerStartY = innerRadius * Math.sin(startAngle)
                    const innerEndX = innerRadius * Math.cos(endAngle)
                    const innerEndY = innerRadius * Math.sin(endAngle)

                    const outerStartX = outerRadius * Math.cos(startAngle)
                    const outerStartY = outerRadius * Math.sin(startAngle)
                    const outerEndX = outerRadius * Math.cos(endAngle)
                    const outerEndY = outerRadius * Math.sin(endAngle)

                    const iconAngle = (startAngle + endAngle) / 2
                    const iconRadius = (innerRadius + outerRadius) / 2
                    const iconX = iconRadius * Math.cos(iconAngle)
                    const iconY = iconRadius * Math.sin(iconAngle)

                    const textRadius = outerRadius - 25
                    const textX = textRadius * Math.cos(iconAngle)
                    const textY = textRadius * Math.sin(iconAngle)

                    const path = [
                      `M ${innerStartX} ${innerStartY}`,
                      `L ${outerStartX} ${outerStartY}`,
                      `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}`,
                      `L ${innerEndX} ${innerEndY}`,
                      `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY}`,
                      "Z",
                    ].join(" ")

                    const isExplored = userProgress.has(goal.goalNumber)
                    const isSelected = selectedGoal === goal.goalNumber
                    const isHovered = hoveredGoal === goal.goalNumber

                    return (
                      <motion.g
                        key={goal.goalNumber}
                        className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                        onClick={(e) => handleGoalClick(goal.goalNumber, e)}
                        onMouseEnter={() => setHoveredGoal(goal.goalNumber)}
                        onMouseLeave={() => setHoveredGoal(null)}
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.path
                          d={path}
                          fill={goal.color}
                          stroke="white"
                          strokeWidth={isSelected ? "3" : isHovered ? "2" : "1"}
                          opacity={isExplored ? 1 : 0.8}
                          animate={{
                            filter: isSelected
                              ? "brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.8))"
                              : isHovered
                                ? "brightness(1.1) drop-shadow(0 0 5px rgba(255,255,255,0.5))"
                                : "brightness(1)",
                          }}
                        />

                        {/* Progress indicator */}
                        {isExplored && (
                          <motion.circle
                            cx={textX}
                            cy={textY - 15}
                            r="4"
                            fill="white"
                            stroke={goal.color}
                            strokeWidth="2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}

                        <text
                          x={textX}
                          y={textY}
                          fill="white"
                          fontSize="16"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{ pointerEvents: "none" }}
                        >
                          {goal.goalNumber}
                        </text>

                        {goal.icon && (
                          <foreignObject
                            x={iconX - 15}
                            y={iconY - 15}
                            width="30"
                            height="30"
                            style={{ pointerEvents: "none" }}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src={goal.icon || "/placeholder.svg"}
                                alt={`Goal ${goal.goalNumber}`}
                                width="24"
                                height="24"
                                className="object-contain"
                                crossOrigin="anonymous"
                              />
                            </div>
                          </foreignObject>
                        )}

                        <title>{`Goal ${goal.goalNumber}: ${goal.title}`}</title>
                      </motion.g>
                    )
                  })}

                  {/* Enhanced Center Circle */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="80"
                    fill={primaryColor}
                    animate={{
                      filter: isSpinning
                        ? "drop-shadow(0 0 20px rgba(0,95,90,0.8))"
                        : "drop-shadow(0 0 10px rgba(0,95,90,0.3))",
                    }}
                  />
                  <circle cx="0" cy="0" r="70" fill="white" stroke={primaryColor} strokeWidth="2" />
                  <text
                    x="0"
                    y="-10"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={primaryColor}
                    fontSize="20"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    SDGs
                  </text>
                  <text
                    x="0"
                    y="20"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={primaryColor}
                    fontSize="14"
                    className="pointer-events-none"
                  >
                    2030 Agenda
                  </text>
                </g>
              </svg>
            </motion.div>

            {/* Enhanced Indicator */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <motion.div
                className="relative"
                animate={{
                  scale: isSpinning ? [1, 1.3, 1] : 1,
                  rotate: isSpinning ? [0, 10, -10, 0] : 0,
                }}
                transition={{
                  repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
                  duration: 0.5,
                }}
              >
                <div
                  className="w-0 h-0"
                  style={{
                    borderLeft: "15px solid transparent",
                    borderRight: "15px solid transparent",
                    borderBottom: `20px solid ${primaryColor}`,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                  }}
                />
                {isSpinning && (
                  <motion.div
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Enhanced Spin Button */}
            <motion.button
              onClick={spinWheel}
              disabled={isSpinning}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white px-8 py-3 rounded-full font-medium shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              style={{
                background: isSpinning
                  ? `linear-gradient(45deg, ${primaryColor}, #007a73)`
                  : `linear-gradient(45deg, ${primaryColor}, #004d47)`,
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: isSpinning ? "0 0 30px rgba(0,95,90,0.6)" : "0 10px 25px rgba(0,0,0,0.2)",
              }}
            >
              <div className="flex items-center space-x-2">
                {isSpinning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                    >
                      <Sparkles size={20} />
                    </motion.div>
                    <span>Spinning...</span>
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    <span>{spinButtonText}</span>
                  </>
                )}
              </div>
            </motion.button>

            {/* Spin History */}
            {spinHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex items-center space-x-3"
              >
                <span className="text-xs text-gray-600 font-medium">Recent:</span>
                <div className="flex space-x-1">
                  {spinHistory.map((goalNumber, idx) => {
                    const goal = goals.find((g) => g.goalNumber === goalNumber)
                    return (
                      <motion.button
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-md hover:scale-110 transition-transform"
                        style={{ backgroundColor: goal?.color || "#888" }}
                        onClick={(e) => handleGoalClick(goalNumber, e)}
                        title={`Goal ${goalNumber}: ${goal?.title}`}
                        whileHover={{ scale: 1.2, y: -2 }}
                      >
                        {goalNumber}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Enhanced Goal Information Panel */}
          <motion.div
            className="w-full lg:w-3/5 lg:pl-12"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
            initial="hidden"
            animate={contentControls}
          >
            {currentGoal ? (
              <motion.div
                className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5, boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }}
              >
                {/* Goal Header */}
                <div className="p-6 text-white relative overflow-hidden" style={{ backgroundColor: currentGoal.color }}>
                  <div className="absolute inset-0 bg-opacity-10" />
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    animate={{
                      background: [
                        `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                        `radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                        `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                      ],
                    }}
                    // transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center mb-4">
                      <motion.div
                        className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {currentGoal.icon && (
                          <img
                            src={currentGoal.icon || "/placeholder.svg"}
                            alt={`Goal ${currentGoal.goalNumber}`}
                            width="32"
                            height="32"
                            className="object-contain"
                          />
                        )}
                      </motion.div>
                      <div>
                        <motion.h2
                          className="text-3xl font-bold"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                        >
                          Goal {currentGoal.goalNumber}
                        </motion.h2>
                        <motion.h3
                          className="text-xl font-medium opacity-90"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          {currentGoal.title}
                        </motion.h3>
                      </div>
                    </div>

                    <motion.p
                      className="text-lg opacity-90 leading-relaxed"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {currentGoal.description || goalDetails[currentGoal.goalNumber].description}
                    </motion.p>
                  </div>
                </div>

                {/* Goal Content */}
                <div className="p-6">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="mb-6"
                  >
                    <p className="text-gray-700 leading-relaxed">{currentGoal.description}</p>
                  </motion.div>

                  {/* Interactive Action Cards */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
                  >
                    <motion.div
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center cursor-pointer border border-blue-200"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                       <Link
                         to={`/goal/${currentGoal.goalNumber}`}
                        className="text-blue-700 font-semibold duration-300 hover:scale-105"
                      
                      >
                        <BookOpen className="text-blue-600 mx-auto mb-2" size={24} />                     
                        Learn more
                      </Link>
                      <p className="text-sm text-blue-600">Detailed information</p>
                    </motion.div>

                    <Link to={`/quiz/${currentGoal.goalNumber}`}>
                      <motion.div
                        className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center cursor-pointer border border-green-200"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Target className="text-green-600 mx-auto mb-2" size={24} />
                        <h4 className="font-semibold text-green-800 mb-1">🎯 Take Quiz</h4>
                        <p className="text-sm text-green-600">Test your knowledge</p>
                      </motion.div>
                    </Link>

                    <motion.div
                      className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center cursor-pointer border border-purple-200"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Users className="text-purple-600 mx-auto mb-2" size={24} />
                      <h4 className="font-semibold text-purple-800 mb-1">🤝 Take Action</h4>
                      <p className="text-sm text-purple-600">Make a difference</p>
                    </motion.div>
                  </motion.div>

                  {/* Navigation and Actions */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
                  >
                    <div className="flex space-x-4">
                      <motion.button
                        onClick={() => {
                          const prevGoalId = currentGoal.goalNumber === 1 ? 17 : currentGoal.goalNumber - 1
                          handleGoalClick(prevGoalId, { preventDefault: () => {} })
                        }}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        whileHover={{ x: -2 }}
                      >
                        <ChevronRight size={16} className="transform rotate-180 mr-1" />
                        Previous
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          const nextGoalId = currentGoal.goalNumber === 17 ? 1 : currentGoal.goalNumber + 1
                          handleGoalClick(nextGoalId, { preventDefault: () => {} })
                        }}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        whileHover={{ x: 2 }}
                      >
                        Next
                        <ChevronRight size={16} className="ml-1" />
                      </motion.button>
                    </div>                

                  
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white rounded-xl shadow-xl p-8 text-center border border-gray-100"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="mb-6">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                  >
                    <span className="text-3xl">🌍</span>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">🌟 UN Sustainable Development Goals</h2>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    🎯 Explore the 17 interconnected global goals designed to create a better future for all! Each goal
                    addresses critical challenges facing humanity and our planet.
                    <br />
                    <strong>🎮 Ready to start your learning adventure?</strong>
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-3 mb-6">
                  {goals.slice(0, 17).map((goal, idx) => (
                    <motion.button
                      key={goal.goalNumber}
                      whileHover={{ scale: 1.2, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ backgroundColor: goal.color }}
                      onClick={(e) => handleGoalClick(goal.goalNumber, e)}
                      title={`Goal ${goal.goalNumber}: ${goal.title}`}
                    >
                      {goal.goalNumber}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={spinWheel}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={20} className="mr-2" />🚀 Start Your Adventure!
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EnhancedSDGWheel
