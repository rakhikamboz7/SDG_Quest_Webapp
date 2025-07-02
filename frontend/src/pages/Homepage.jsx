"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, useInView, useScroll, useTransform, useAnimation } from "framer-motion"
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Lightbulb,
  Target,
  Award,
  Users,
  BookOpen,
  TrendingUp,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Calendar,
  Brain,
  Heart,
  Sparkles,
  Trophy,
  Rocket,
  Leaf,
  Droplets,
  Grid3X3,
  Circle,
} from "lucide-react"
import { AnimatePresence } from "framer-motion"

// Import SDG Goal Icons
import goal1 from "../assets/goal1.ico"
import goal2 from "../assets/goal2.ico"
import goal3 from "../assets/goal3.ico"
import goal4 from "../assets/goal4.svg.ico"
import goal5 from "../assets/goal5.svg.ico"
import goal6 from "../assets/goal6.svg.ico"
import goal7 from "../assets/goal7.png.ico"
import goal8 from "../assets/goal8.svg.ico"
import goal9 from "../assets/goal9.svg.ico"
import goal10 from "../assets/goal10.png.ico"
import goal11 from "../assets/goal11.svg.ico"
import goal12 from "../assets/goal12.svg.ico"
import goal13 from "../assets/goal13.svg.ico"
import goal14 from "../assets/goal14.svg.ico"
import goal15 from "../assets/goal15.svg.ico"
import goal16 from "../assets/goal16.svg.ico"
import goal17 from "../assets/goal17.svg.ico"

const PRIMARY_COLOR = "#005a54"

// SDG Goals data with actual icons
const sdgGoals = [
  { id: 1, icon: goal1, color: "#E5243B", name: "No Poverty" },
  { id: 2, icon: goal2, color: "#DDA63A", name: "Zero Hunger" },
  { id: 3, icon: goal3, color: "#4C9F38", name: "Good Health" },
  { id: 4, icon: goal4, color: "#C5192D", name: "Quality Education" },
  { id: 5, icon: goal5, color: "#FF3A21", name: "Gender Equality" },
  { id: 6, icon: goal6, color: "#26BDE2", name: "Clean Water" },
  { id: 7, icon: goal7, color: "#FCC30B", name: "Clean Energy" },
  { id: 8, icon: goal8, color: "#A21942", name: "Economic Growth" },
  { id: 9, icon: goal9, color: "#FD6925", name: "Innovation" },
  { id: 10, icon: goal10, color: "#DD1367", name: "Reduced Inequalities" },
  { id: 11, icon: goal11, color: "#FD9D24", name: "Sustainable Cities" },
  { id: 12, icon: goal12, color: "#BF8B2E", name: "Responsible Consumption" },
  { id: 13, icon: goal13, color: "#3F7E44", name: "Climate Action" },
  { id: 14, icon: goal14, color: "#0A97D9", name: "Life Below Water" },
  { id: 15, icon: goal15, color: "#56C02B", name: "Life on Land" },
  { id: 16, icon: goal16, color: "#00689D", name: "Peace & Justice" },
  { id: 17, icon: goal17, color: "#19486A", name: "Partnerships" },
]

const videos = [
  { id: "0XTBYMfZyrM", title: "Introduction to SDGs", description: "Learn the basics of sustainable development" },
  { id: "NU6rc_vm9rs", title: "Climate Action Explained", description: "Understanding SDG 13 and climate change" },
  { id: "ZVqSC_hN2lk", title: "SDGs Overview", description: "Complete guide to all 17 goals" },
  { id: "dQw4w9WgXcQ", title: "Global Goals 2030", description: "The roadmap to a sustainable future" },
  { id: "eBGIQ7ZuuiU", title: "Achieving SDGs by 2030", description: "How we can reach our targets" },
  { id: "RX2elsVjY-c", title: "Responsible Consumption", description: "SDG 12 in action" },
]

const flashcards = [
  {
    question: "Which SDG aims to achieve zero hunger?",
    image: "/src/assets/hunger.jpg",
    hint: "SDG 2 focuses on ending hunger and promoting sustainable agriculture.",
    answer: "SDG 2: Zero Hunger",
  },
  {
    question: "What does SDG 13 advocate for?",
    image: "/src/assets/about_us-removebg-preview.png",
    hint: "It's all about taking urgent action to combat climate change.",
    answer: "SDG 13: Climate Action",
  },
  {
    question: "Which goal promotes gender equality?",
    image: "/src/assets/sngine_dcb0169096430d9a40dd0a232003d1c7.jpg",
    hint: "SDG 5 aims to achieve gender equality and empower all women and girls.",
    answer: "SDG 5: Gender Equality",
  },
  {
    question: "Which SDG focuses on quality education?",
    image: "/src/assets/quality-education.webp",
    hint: "SDG 4 ensures inclusive and equitable quality education and promotes lifelong learning opportunities.",
    answer: "SDG 4: Quality Education",
  },
  {
    question: "What is the main objective of SDG 6?",
    image: "/src/assets/clean-water.jpg",
    hint: "It aims to ensure availability and sustainable management of water and sanitation for all.",
    answer: "SDG 6: Clean Water and Sanitation",
  },
]

const stats = [
  { number: "17", label: "SDG Goals", icon: Target },
  { number: "10K+", label: "Active Learners", icon: Users },
  { number: "50K+", label: "Quizzes Completed", icon: Award },
  { number: "95%", label: "Success Rate", icon: TrendingUp },
]

const features = [
  {
    icon: BookOpen,
    title: "Interactive Learning",
    description: "Comprehensive content on all 17 SDG goals with engaging multimedia resources.",
    color: "#3B82F6",
  },
  {
    icon: Target,
    title: "Smart Quizzes",
    description: "Test your knowledge with adaptive quizzes tailored to your learning progress.",
    color: "#10B981",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics and achievement milestones.",
    color: "#F59E0B",
  },
  {
    icon: Award,
    title: "Rewards & Badges",
    description: "Earn recognition for your achievements and showcase your SDG expertise.",
    color: "#EF4444",
  },
  {
    icon: Users,
    title: "Community Action",
    description: "Connect with like-minded individuals and participate in real-world SDG initiatives.",
    color: "#8B5CF6",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "Be part of a worldwide movement working towards sustainable development goals.",
    color: "#06B6D4",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Environmental Science Student",
    content:
      "SDG Quest transformed how I understand sustainability. The interactive approach made complex concepts easy to grasp.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Dr. Michael Chen",
    role: "Sustainability Consultant",
    content: "An excellent platform for both beginners and experts. The quiz system is particularly well-designed.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Emma Rodriguez",
    role: "High School Teacher",
    content: "My students love the gamified learning experience. It's made teaching SDGs so much more engaging.",
    rating: 5,
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

// Interactive SDG Animation Component
const InteractiveSDGAnimation = () => {
  const [animationPhase, setAnimationPhase] = useState("circle") // "circle" or "grid"
  const [visibleIcons, setVisibleIcons] = useState(0)
  const [hoveredIcon, setHoveredIcon] = useState(null)

  useEffect(() => {
    // Show icons one by one in circle formation
    const iconInterval = setInterval(() => {
      setVisibleIcons((prev) => {
        if (prev < 17) {
          return prev + 1
        } else {
          clearInterval(iconInterval)
          return prev
        }
      })
    }, 200) // Show one icon every 200ms

    return () => clearInterval(iconInterval)
  }, [])

  // Calculate circle positions - responsive radius
  const getCirclePosition = (index, total = 17) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2 // Start from top
    // Responsive radius based on screen size
    const radius =
      typeof window !== "undefined" ? (window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 160 : 200) : 200
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  }

  const getGridPosition = (index) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640
    const isTablet = typeof window !== "undefined" && window.innerWidth < 1024

    const cols = isMobile ? 4 : isTablet ? 5 : 6
    const rows = Math.ceil(17 / cols)
    const col = index % cols
    const row = Math.floor(index / cols)
    const spacing = isMobile ? 70 : isTablet ? 80 : 90
    const offsetX = (-(cols - 1) * spacing) / 2
    const offsetY = (-(rows - 1) * spacing) / 2 + 30 // Move grid up significantly

    return {
      x: col * spacing + offsetX,
      y: row * spacing + offsetY,
    }
  }

  const toggleView = (newPhase) => {
    if (newPhase !== animationPhase) {
      setAnimationPhase(newPhase)
    }
  }

  // Responsive icon sizes
  const getIconSize = () => {
    if (typeof window === "undefined") return { circle: 48, grid: 56 }
    const width = window.innerWidth
    if (width < 640) return { circle: 40, grid: 48 }
    if (width < 1024) return { circle: 48, grid: 56 }
    return { circle: 56, grid: 64 }
  }

  const iconSizes = getIconSize()

  return (
    <div className="relative w-full h-[450px] sm:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden mt-4">
      {/* Background Effects - Simplified */}
      <div className="absolute inset-0">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            background: [
              `radial-gradient(circle at 20% 20%, ${PRIMARY_COLOR}40 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 80%, ${PRIMARY_COLOR}40 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 80%, ${PRIMARY_COLOR}40 0%, transparent 50%)`,
              `radial-gradient(circle at 80% 20%, ${PRIMARY_COLOR}40 0%, transparent 50%)`,
              `radial-gradient(circle at 20% 20%, ${PRIMARY_COLOR}40 0%, transparent 50%)`,
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Subtle Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hover Tooltip */}
      <AnimatePresence>
        {hoveredIcon && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute top-10 sm:top-8 left-1/2 transform -translate-x-1/2 z-20 px-3 py-2 rounded-lg text-white font-medium text-xs sm:text-sm shadow-lg"
            style={{ backgroundColor: hoveredIcon.color }}
          >
            {hoveredIcon.name}
            <div
              className="absolute top-15 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
              style={{ borderTopColor: hoveredIcon.color }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SDG Icons Animation */}
      <div className="relative">
        {sdgGoals.map((goal, index) => {
          const isVisible = index < visibleIcons
          const circlePos = getCirclePosition(index)
          const gridPos = getGridPosition(index)

          return (
            <motion.div
              key={goal.id}
              className="absolute cursor-pointer"
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={
                isVisible
                  ? {
                      opacity: 1,
                      scale: 1,
                      x: animationPhase === "circle" ? circlePos.x : gridPos.x,
                      y: animationPhase === "circle" ? circlePos.y : gridPos.y,
                    }
                  : {
                      opacity: 0,
                      scale: 0,
                      x: 0,
                      y: 0,
                    }
              }
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5, type: "spring", stiffness: 200 },
                x: { duration: 1.5, type: "spring", stiffness: 100, damping: 20 },
                y: { duration: 1.5, type: "spring", stiffness: 100, damping: 20 },
              }}
              onMouseEnter={() => setHoveredIcon(goal)}
              onMouseLeave={() => setHoveredIcon(null)}
              style={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <motion.div className="relative">
                {/* Icon Container */}
                <motion.div
                  className="flex items-center bottom-30 justify-center shadow-lg border-2 border-white/20 backdrop-blur-sm relative overflow-hidden"
                  style={{
                    backgroundColor: `${goal.color}20`,
                  }}
                  animate={{
                    borderRadius: animationPhase === "circle" ? "50%" : "7%",
                    width: animationPhase === "circle" ? iconSizes.circle : iconSizes.grid,
                    height: animationPhase === "circle" ? iconSizes.circle : iconSizes.grid,
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                >
                  {/* Icon Image */}
                  <motion.img
                    src={goal.icon}
                    alt={goal.name}
                    className="object-contain"
                    animate={{
                      width: animationPhase === "circle" ? iconSizes.circle * 0.5 : iconSizes.grid * 0.8,
                      height: animationPhase === "circle" ? iconSizes.circle * 0.5 : iconSizes.grid * 0.8,
                    }}
                    transition={{ duration: 1.5 }}
                  />

                  {/* Goal Number */}
                  <motion.div
                    className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center text-white shadow-md font-bold"
                    style={{
                      backgroundColor: goal.color,
                      width: typeof window !== "undefined" && window.innerWidth < 640 ? "18px" : "20px",
                      height: typeof window !== "undefined" && window.innerWidth < 640 ? "18px" : "20px",
                      fontSize: typeof window !== "undefined" && window.innerWidth < 640 ? "10px" : "11px",
                    }}
                    animate={{
                      scale: animationPhase === "circle" ? 0.8 : 1,
                    }}
                    transition={{ duration: 1.5 }}
                  >
                    {goal.id}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )
        })}

        {/* Center Logo/Text - Perfectly centered in circular motion */}
        <AnimatePresence>
          {animationPhase === "circle" && (
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: visibleIcons >= 17 ? 1 : 0,
                scale: visibleIcons >= 17 ? 1 : 0,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="rounded-full ml-9 mb-24 flex items-center justify-center shadow-xl border-4 border-white/20 backdrop-blur-sm"
                style={{
                  backgroundColor: `${PRIMARY_COLOR}20`,
                  width:
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? "60px"
                      : typeof window !== "undefined" && window.innerWidth < 1024
                        ? "80px"
                        : "96px",
                  height:
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? "60px"
                      : typeof window !== "undefined" && window.innerWidth < 1024
                        ? "80px"
                        : "96px",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  scale: { duration: 2, repeat: Number.POSITIVE_INFINITY },
                  rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                }}
              >
                <span
                  className="font-bold"
                  style={{
                    color: PRIMARY_COLOR,
                    fontSize:
                      typeof window !== "undefined" && window.innerWidth < 680
                        ? "34px"
                        : typeof window !== "undefined" && window.innerWidth < 1024
                          ? "18px"
                          : "24px",
                  }}
                >
                   2030 Goals
                </span>
              </motion.div>
              <motion.p
                className="mt-1 font-medium text-gray-600"
                style={{
                  fontSize:
                    typeof window !== "undefined" && window.innerWidth < 640
                      ? "10px"
                      : typeof window !== "undefined" && window.innerWidth < 1024
                        ? "12px"
                        : "14px",
                }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
               
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Controls - At the top */}
        <motion.div
          className="absolute top-32 ml-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg z-30"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: visibleIcons >= 17 ? 1 : 0,
            y: visibleIcons >= 17 ? 0 : -20,
          }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          <motion.button
            onClick={() => toggleView("circle")}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
              animationPhase === "circle"
                ? "text-white shadow-lg"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
            style={{
              backgroundColor: animationPhase === "circle" ? PRIMARY_COLOR : "transparent",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Circle size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Circle</span>
          </motion.button>

          <motion.button
            onClick={() => toggleView("grid")}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm ${
              animationPhase === "grid" ? "text-white shadow-lg" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
            style={{
              backgroundColor: animationPhase === "grid" ? PRIMARY_COLOR : "transparent",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Grid3X3 size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Grid</span>
          </motion.button>
        </motion.div>

        {/* Connection Lines (only in circle mode) */}
        {animationPhase === "circle" && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <g transform="translate(50%, 50%)">
              {sdgGoals.map((_, index) => {
                if (index >= visibleIcons) return null
                const pos1 = getCirclePosition(index)
                const pos2 = getCirclePosition((index + 1) % 17)

                return (
                  <motion.line
                    key={`connection-${index}`}
                    x1={pos1.x}
                    y1={pos1.y}
                    x2={pos2.x}
                    y2={pos2.y}
                    stroke={PRIMARY_COLOR}
                    strokeWidth="1"
                    opacity="0.3"
                    strokeDasharray="3,3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                  />
                )
              })}
            </g>
          </svg>
        )}
      </div>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-2 left-2/1 transform -translate-x-1/2 px-3 py-1 sm:px-4 sm:py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: visibleIcons >= 17 ? 1 : 0, y: visibleIcons >= 17 ? 0 : 20 }}
        transition={{ delay: 4, duration: 0.8 }}
      >
        <span className="text-xs sm:text-sm font-medium text-gray-700">Use buttons above to switch views</span>
      </motion.div>
    </div>
  )
}

// Enhanced Hero Section with SDG Animation
const HeroSection = () => {
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background - Simplified */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              rgba(0, 90, 84, 0.03) 0%, 
              rgba(255, 255, 255, 0.98) 20%, 
              rgba(76, 159, 56, 0.02) 40%, 
              rgba(255, 255, 255, 0.99) 60%, 
              rgba(0, 90, 84, 0.04) 80%, 
              rgba(255, 255, 255, 0.97) 100%)`,
          }}
        />

        {/* Simplified Nature Elements */}
        <div className="absolute inset-0">
          {/* Floating Leaves */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`leaf-${i}`}
              className="absolute hidden sm:block"
              style={{
                left: `${15 + i * 20}%`,
                top: `${25 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 6 + i * 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.8,
              }}
            >
              <Leaf
                size={16 + (i % 2) * 4}
                className="text-green-400 opacity-25"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
            </motion.div>
          ))}

          {/* Water Droplets */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`droplet-${i}`}
              className="absolute hidden sm:block"
              style={{
                right: `${10 + i * 25}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, 30, 0],
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5 + i * 1.2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 1,
              }}
            >
              <Droplets
                size={14 + (i % 2) * 3}
                className="text-blue-400 opacity-35"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Sparkles size={14} className="mr-2" />
              </motion.div>
              Students Shaping Tomorrow's World
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
            >
              <span className="text-gray-900">Empower Your</span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                SDG Journey
              </motion.span>
              <br />
              <span className="text-gray-900">Build Our Future</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl"
            >
              Connect with nature, learn through action, and become part of the global movement achieving the{" "}
              <motion.span
                className="font-semibold"
                style={{ color: PRIMARY_COLOR }}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                2030 Sustainable Development Goals
              </motion.span>
              . Your learning creates real impact.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8"
            >
              <motion.button
                onClick={() => navigate("/sdg-wheel")}
                className="group px-6 sm:px-8 py-3 sm:py-4 text-white rounded-full font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 relative overflow-hidden"
                style={{ backgroundColor: PRIMARY_COLOR }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Rocket size={18} className="sm:w-5 sm:h-5" />
                </motion.div>
                <span>Begin Your Impact</span>
              </motion.button>

              <motion.button
                onClick={() => navigate("/about")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-700 rounded-full font-semibold text-base sm:text-lg border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookOpen size={18} className="sm:w-5 sm:h-5" />
                <span>Explore SDGs</span>
              </motion.button>
            </motion.div>

            {/* Stats with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 bottom-40 sm:gap-6"
            >
              {stats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div
                    key={index}
                    className="text-center group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <motion.div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                        style={{ backgroundColor: `${PRIMARY_COLOR}20` }}
                        animate={{
                          boxShadow: [
                            `0 0 0 0 ${PRIMARY_COLOR}20`,
                            `0 0 0 10px ${PRIMARY_COLOR}05`,
                            `0 0 0 0 ${PRIMARY_COLOR}20`,
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                        }}
                      >
                        <IconComponent size={20} className="sm:w-6 sm:h-6" style={{ color: PRIMARY_COLOR }} />
                      </motion.div>
                    </div>
                    <motion.div
                      className="text-xl sm:text-2xl font-bold text-gray-900"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.5,
                      }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Interactive SDG Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative w-full order-1 lg:order-2"
          >
            <InteractiveSDGAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// New Engaging Features Highlight Section
const EngagingFeaturesSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  const engagingFeatures = [
    {
      icon: Calendar,
      title: "Daily Fresh Content",
      subtitle: "Stay Updated Every Day",
      description:
        "Access newly curated SDG content, insights, and real-world case studies updated daily to keep your learning journey fresh and relevant.",
      color: "#FF6B6B",
      delay: 0.1,
    },
    {
      icon: Brain,
      title: "Smart Quiz Engine",
      subtitle: "Adaptive Learning Experience",
      description:
        "Our AI-powered quiz system adapts to your learning pace, providing personalized challenges that grow with your knowledge and expertise.",
      color: "#4ECDC4",
      delay: 0.2,
    },
    {
      icon: Heart,
      title: "Pledge & Contribute",
      subtitle: "Make Real Impact",
      description:
        "Transform learning into action by making meaningful pledges and contributing to SDG initiatives that create tangible change in your community.",
      color: "#45B7D1",
      delay: 0.3,
    },
  ]

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <section
      ref={ref}
      className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${PRIMARY_COLOR.replace(
              "#",
              "%23",
            )}' fillOpacity='0.1'%3E%3Cpolygon points='50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4 sm:mb-6"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Zap size={18} className="text-purple-600 mr-2" />
            <span className="text-purple-800 font-semibold text-sm sm:text-base">Why Choose SDG Quest?</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
            Experience the{" "}
            <span
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent"
              style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Future
            </span>{" "}
            of Learning
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover what makes our platform the most engaging and effective way to master the Sustainable Development
            Goals
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {engagingFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Card Background with Gradient Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {/* Animated Icon */}
                  <motion.div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 relative overflow-hidden"
                    style={{ backgroundColor: `${feature.color}20` }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <IconComponent size={28} className="sm:w-9 sm:h-9" style={{ color: feature.color }} />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                      style={{ backgroundColor: `${feature.color}10` }}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm font-semibold" style={{ color: feature.color }}>
                        {feature.subtitle}
                      </p>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                  </div>

                  {/* Animated Bottom Border */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 rounded-b-3xl"
                    style={{ backgroundColor: feature.color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: feature.delay }}
                  />

                  {/* Floating Particles */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 rounded-full"
                    style={{ backgroundColor: feature.color }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.5,
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12 sm:mt-16"
        >
          <motion.button
            onClick={() => (window.location.href = "/sdg-wheel")}
            className="group px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 mx-auto relative overflow-hidden"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Trophy size={20} className="sm:w-6 sm:h-6" />
            <span>Start Your SDG Journey Today</span>
            <ArrowRight
              size={18}
              className="sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

// Features Section Component
const FeaturesSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Comprehensive <span style={{ color: PRIMARY_COLOR }}>Learning Platform</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to master the Sustainable Development Goals in one powerful platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <IconComponent size={28} className="sm:w-8 sm:h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                <div
                  className="absolute bottom-0 left-0 w-full h-1 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  style={{ backgroundColor: feature.color }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Interactive Quiz Card Component
const InteractiveQuizCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const shuffleCards = () => {
    setShowHint(false)
    setShowAnswer(false)
    const randomIndex = Math.floor(Math.random() * flashcards.length)
    setCurrentIndex(randomIndex)
  }

  const currentCard = flashcards[currentIndex]

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Test Your <span style={{ color: PRIMARY_COLOR }}>SDG Knowledge</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600">
            Challenge yourself with our interactive flashcards and discover how much you know about the SDGs
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12"
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              {currentCard.question}
            </h3>

            <div className="relative mb-6 sm:mb-8">
              <img
                src={currentCard.image || "/placeholder.svg"}
                alt="SDG Visual"
                className="w-full max-w-md mx-auto h-48 sm:h-64 object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 sm:mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb size={18} className="text-yellow-600" />
                    <span className="font-semibold text-yellow-800 text-sm sm:text-base">Hint:</span>
                  </div>
                  <p className="text-yellow-700 text-sm sm:text-base">{currentCard.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 sm:mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle size={18} className="text-green-600" />
                    <span className="font-semibold text-green-800 text-sm sm:text-base">Answer:</span>
                  </div>
                  <p className="text-green-700 font-medium text-sm sm:text-base">{currentCard.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <motion.button
              onClick={shuffleCards}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              style={{ backgroundColor: PRIMARY_COLOR }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Shuffle size={16} className="sm:w-5 sm:h-5" />
              <span>Shuffle Card</span>
            </motion.button>

            <motion.button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lightbulb size={16} className="sm:w-5 sm:h-5" />
              <span>{showHint ? "Hide Hint" : "Show Hint"}</span>
            </motion.button>

            <motion.button
              onClick={() => setShowAnswer(!showAnswer)}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CheckCircle size={16} className="sm:w-5 sm:h-5" />
              <span>{showAnswer ? "Hide Answer" : "Show Answer"}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Video Carousel Component
const VideoCarousel = () => {
  const carouselRef = useRef(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 400
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Featured Learning Resources</h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our curated collection of educational videos to deepen your understanding of the SDGs
          </p>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-sm bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-sm rounded-full flex items-center justify-center bg-black/70 text-white hover:bg-white/20 transition-all duration-300"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 sm:space-x-6 pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-72 sm:w-80 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="aspect-video relative">
                  <iframe
                    title={video.title}
                    src={`https://www.youtube.com/embed/${video.id}`}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-2">{video.title}</h3>
                  <p className="text-gray-300 text-sm">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
const TestimonialsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            What Our <span style={{ color: PRIMARY_COLOR }}>Learners Say</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied learners who have transformed their understanding of sustainable development
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic text-sm sm:text-base">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => {
  const navigate = useNavigate()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-16 sm:py-20 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${PRIMARY_COLOR} 0%, #004d47 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Start Your SDG Journey?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join our global community of learners and make a real impact on the world's most pressing challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.button
              onClick={() => navigate("/sdg-wheel")}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-full font-semibold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={18} className="sm:w-5 sm:h-5" />
              <span>Start Learning Now</span>
            </motion.button>
            <motion.button
              onClick={() => navigate("/signin")}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white border-2 border-white rounded-full font-semibold text-base sm:text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
              <span>Join Community</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main HomePage Component
const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <EngagingFeaturesSection />
      <FeaturesSection />
      <InteractiveQuizCard />
      <VideoCarousel />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}

export default HomePage
