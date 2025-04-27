"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import Header from '../components/Header'
import Footer from '../components/Footer'
// With these imports:
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

const goalsData = [
  {
    id: 1,
    title: "No Poverty",
    icon: goal1,
    overview: "Goal 1 aims to end poverty in all its forms everywhere.",
    color: "#E5243B", // Red
    description:
      "Poverty is more than the lack of income and resources to ensure a sustainable livelihood. Its manifestations include hunger and malnutrition, limited access to education and other basic services, social discrimination and exclusion as well as the lack of participation in decision-making.",
  },
  {
    id: 2,
    title: "Zero Hunger",
    icon: goal2,
    overview: "Goal 2 seeks sustainable solutions to end hunger and achieve food security for all.",
    color: "#DDA63A", // Yellow
    description:
      "The food and agriculture sector offers key solutions for development, and is central for hunger and poverty eradication. It is time to rethink how we grow, share and consume our food.",
  },
  {
    id: 3,
    title: "Good Health and Well-Being",
    icon: goal3,
    overview: "Goal 3 ensures healthy lives and promotes well-being at all ages.",
    color: "#4C9F38", // Green
    description:
      "Ensuring healthy lives and promoting well-being at all ages is essential to sustainable development. Currently, the world is facing a global health crisis unlike any other — COVID-19 is spreading human suffering, destabilizing the global economy and upending the lives of billions of people around the globe.",
  },
  {
    id: 4,
    title: "Quality Education",
    icon: goal4,
    overview: "Goal 4 ensures inclusive and equitable quality education.",
    color: "#C5192D", // Red
    description:
      "Obtaining a quality education is the foundation to creating sustainable development. In addition to improving quality of life, access to inclusive education can help equip locals with the tools required to develop innovative solutions to the world's greatest problems.",
  },
  {
    id: 5,
    title: "Gender Equality",
    icon: goal5,
    overview: "Goal 5 aims to achieve gender equality and empower all women and girls.",
    color: "#FF3A21", // Orange-Red
    description:
      "Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world. There has been progress over the last decades, but we're still far from a world where women and men are equal.",
  },
  {
    id: 6,
    title: "Clean Water and Sanitation",
    icon: goal6,
    overview: "Goal 6 aims to ensure availability and sustainable management of water and sanitation for all.",
    color: "#26BDE2", // Light Blue
    description:
      "Clean, accessible water for all is an essential part of the world we want to live in and there is sufficient fresh water on the planet to achieve this. However, due to bad economics or poor infrastructure, millions of people die every year from diseases associated with inadequate water supply, sanitation and hygiene.",
  },
  {
    id: 7,
    title: "Affordable and Clean Energy",
    icon: goal7,
    overview: "Goal 7 ensures access to affordable, reliable, sustainable, and modern energy for all.",
    color: "#FCC30B", // Yellow
    description:
      "Energy is central to nearly every major challenge and opportunity the world faces today. Be it for jobs, security, climate change, food production or increasing incomes, access to energy for all is essential.",
  },
  {
    id: 8,
    title: "Decent Work and Economic Growth",
    icon: goal8,
    overview: "Goal 8 promotes sustained, inclusive economic growth.",
    color: "#A21942", // Burgundy
    description:
      "Sustained and inclusive economic growth can drive progress, create decent jobs for all and improve living standards. COVID-19 has disrupted billions of lives and endangered the global economy. The International Monetary Fund (IMF) expects a global recession as bad as or worse than in 2009.",
  },
  {
    id: 9,
    title: "Industry, Innovation and Infrastructure",
    icon: goal9,
    overview: "Goal 9 focuses on building resilient infrastructure and fostering innovation.",
    color: "#FD6925", // Orange
    description:
      "Investments in infrastructure – transport, irrigation, energy and information and communication technology – are crucial to achieving sustainable development and empowering communities in many countries.",
  },
  {
    id: 10,
    title: "Reduced Inequalities",
    icon: goal10,
    overview: "Goal 10 aims to reduce inequalities within and among countries.",
    color: "#DD1367", // Pink
    description:
      "Reducing inequalities and ensuring no one is left behind are integral to achieving the Sustainable Development Goals. Inequality within and among countries is a persistent cause for concern.",
  },
  {
    id: 11,
    title: "Sustainable Cities and Communities",
    icon: goal11,
    overview: "Goal 11 seeks to make cities inclusive, safe, resilient, and sustainable.",
    color: "#FD9D24", // Orange
    description:
      "The world is becoming increasingly urbanized. Since 2007, more than half the world's population has been living in cities, and that share is projected to rise to 60% by 2030. Cities and metropolitan areas are powerhouses of economic growth.",
  },
  {
    id: 12,
    title: "Responsible Consumption and Production",
    icon: goal12,
    overview: "Goal 12 promotes sustainable consumption and production patterns.",
    color: "#BF8B2E", // Gold
    description:
      "Sustainable consumption and production is about doing more and better with less. It is also about decoupling economic growth from environmental degradation, increasing resource efficiency and promoting sustainable lifestyles.",
  },
  {
    id: 13,
    title: "Climate Action",
    icon: goal13,
    overview: "Goal 13 calls for urgent action to combat climate change.",
    color: "#3F7E44", // Green
    description:
      "Climate change is affecting every country on every continent. It is disrupting national economies and affecting lives. Weather patterns are changing, sea levels are rising, and weather events are becoming more extreme.",
  },
  {
    id: 14,
    title: "Life Below Water",
    icon: goal14,
    overview: "Goal 14 aims to conserve and sustainably use oceans and seas.",
    color: "#0A97D9", // Blue
    description:
      "The world's oceans – their temperature, chemistry, currents and life – drive global systems that make the Earth habitable for humankind. Our rainwater, drinking water, weather, climate, coastlines, much of our food, and even the oxygen in the air we breathe, are all ultimately provided and regulated by the sea.",
  },
  {
    id: 15,
    title: "Life on Land",
    icon: goal15,
    overview: "Goal 15 focuses on protecting terrestrial ecosystems.",
    color: "#56C02B", // Green
    description:
      "Nature is critical to our survival: nature provides us with our oxygen, regulates our weather patterns, pollinates our crops, produces our food, feed and fibre. But it is under increasing stress.",
  },
  {
    id: 16,
    title: "Peace, Justice, and Strong Institutions",
    icon: goal16,
    overview: "Goal 16 promotes peaceful societies.",
    color: "#00689D", // Blue
    description:
      "Conflict, insecurity, weak institutions and limited access to justice remain a great threat to sustainable development. The number of people fleeing war, persecution and conflict exceeded 70 million in 2018, the highest level recorded by the UN refugee agency (UNHCR) in almost 70 years.",
  },
  {
    id: 17,
    title: "Partnerships for the Goals",
    icon: goal17,
    overview: "Goal 17 emphasizes strengthening global partnerships.",
    color: "#19486A", // Dark Blue
    description:
      "The SDGs can only be realized with strong global partnerships and cooperation. A successful development agenda requires inclusive partnerships — at the global, regional, national and local levels — built upon principles and values, and upon a shared vision and shared goals placing people and the planet at the centre.",
  },
]

const SDGWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [, setSpinCount] = useState(0)
  const [spinHistory, setSpinHistory] = useState([])
  const [spinSpeed] = useState(3) // Default spin duration
  const [spinButtonText, setSpinButtonText] = useState("Spin the Wheel")
  const wheelRef = useRef(null)
  const contentControls = useAnimation()

  // Refs for the wheel container and content panel
  const wheelContainerRef = useRef(null)
  const contentPanelRef = useRef(null)

  // Function to calculate the rotation needed to align a goal with the triangle
  const calculateRotationForGoal = (goalId) => {
    const segmentAngle = 360 / 17
    // The key fix: We need to rotate the wheel so that the goal is at the top (0 degrees)
    // Since the wheel rotates clockwise, we need to use a negative angle
    // We also need to offset by half a segment to center the goal at the triangle
    return -((goalId +4 ) * segmentAngle + segmentAngle / 2)
  }

  // Function to handle spinning the wheel
  const spinWheel = () => {
    if (isSpinning) return

    // Update spin button text
    setSpinButtonText("Spinning...")

    // Start spinning state
    setIsSpinning(true)
    setShowContent(false)

    // Generate a random goal ID (1-17)
    const newGoalId = Math.floor(Math.random() * 17) + 1

    // Calculate the exact rotation needed to align the selected goal with the triangle
    const targetRotation = calculateRotationForGoal(newGoalId)

    // Add multiple full rotations for visual effect (2-4 rotations)
    const fullRotations = -(2 + Math.floor(Math.random() * 3)) * 360
    const newRotation = fullRotations + targetRotation

    setWheelRotation(newRotation)

    // Update spin history
    const updatedHistory = [...spinHistory]
    if (updatedHistory.length >= 5) updatedHistory.shift() // Keep only last 5 spins
    updatedHistory.push(newGoalId)
    setSpinHistory(updatedHistory)

    // Increment spin counter
    setSpinCount((prevCount) => prevCount + 1)

    // After spinning animation completes, show the goal info
    setTimeout(() => {
      setIsSpinning(false)
      setSelectedGoal(newGoalId)
      setShowContent(true)
      setSpinButtonText("Spin Again")
    }, spinSpeed * 1000)
  }

  // Function to handle clicking on a specific goal
  const handleGoalClick = (goalId, e) => {
    e.preventDefault()

    if (isSpinning) return

    if (selectedGoal === goalId) {
      // Already selected, just toggle content visibility
      setShowContent(!showContent)
      return
    }

    setIsSpinning(true)
    setShowContent(false)
    setSpinButtonText("Spinning...")

    // Calculate rotation to align the selected goal with the triangle at the top
    const targetRotation = calculateRotationForGoal(goalId)

    // Add a full rotation for visual effect
    const fullRotation = -360
    const newRotation = fullRotation + targetRotation

    setWheelRotation(newRotation)

    // After spinning animation completes, show the goal info
    setTimeout(() => {
      setIsSpinning(false)
      setSelectedGoal(goalId)
      setShowContent(true)
      setSpinButtonText("Spin Again")
    }, 1500)
  }

  // Animate content when it becomes visible
  useEffect(() => {
    if (showContent) {
      contentControls.start("visible")
    } else {
      contentControls.start("hidden")
    }
  }, [showContent, contentControls])

  // Content animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  // Highlight animation for the selected segment
  const highlightVariants = {
    initial: { scale: 1, filter: "brightness(1)" },
    highlight: {
      scale: 1.05,
      filter: "brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))",
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        duration: 1,
      },
    },
  }

  // Get the currently selected goal data
  const currentGoal = selectedGoal ? goalsData.find((goal) => goal.id === selectedGoal) : null

  // Primary website colors
  const primaryColor = "#005f5a" // Primary teal color
  const textColor = "#000000" // Black

  return (
    <><Header />
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-white"> 
      <motion.h1
        className="mb-8 text-4xl font-bold text-center"
        style={{ color: primaryColor }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Sustainable Development Goals
      </motion.h1>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-start lg:flex-row lg:items-start lg:justify-between">
          {/* SDG Wheel Container - reduced left margin */}
          <div
            ref={wheelContainerRef}
            className="relative flex items-center justify-center w-full max-w-md lg:w-2/5 mb-8 lg:mb-0 lg:ml-0"
          >
            {/* Wheel Background Glow */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-10 blur-xl"
              style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* SDG Wheel */}
            <motion.div
              className="relative"
              style={{ width: "min(100%, 400px)", height: "min(100%, 400px)" }}
              initial={{ rotate: 0 }}
              animate={{
                rotate: wheelRotation,
                transition: {
                  type: isSpinning ? "spring" : "tween",
                  duration: isSpinning ? spinSpeed : 1.5,
                  ease: isSpinning ? "easeOut" : [0.42, 0, 0.58, 1],
                  bounce: isSpinning ? 0.25 : 0,
                },
              }}
            >
              <svg
                ref={wheelRef}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 500 500"
                className="w-full h-full transition-transform duration-1000 ease-in-out"
              >
                <g transform="translate(250, 250)">
                  {/* Create segments for all 17 SDGs */}
                  {goalsData.map((goal, index) => {
                    const innerRadius = 80
                    const outerRadius = 200

                    // Calculate coordinates for the segment path
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

                    // Calculate icon position (centered in the segment)
                    const iconAngle = (startAngle + endAngle) / 2
                    const iconRadius = (innerRadius + outerRadius) / 2
                    const iconX = iconRadius * Math.cos(iconAngle)
                    const iconY = iconRadius * Math.sin(iconAngle)

                    // Calculate text position for the goal number
                    const textRadius = outerRadius - 25
                    const textX = textRadius * Math.cos(iconAngle)
                    const textY = textRadius * Math.sin(iconAngle)

                    // Create the segment path
                    const path = [
                      `M ${innerStartX} ${innerStartY}`,
                      `L ${outerStartX} ${outerStartY}`,
                      `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEndX} ${outerEndY}`,
                      `L ${innerEndX} ${innerEndY}`,
                      `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStartX} ${innerStartY}`,
                      "Z",
                    ].join(" ")

                    return (
                      <motion.g
                        key={goal.id}
                        className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                        onClick={(e) => handleGoalClick(goal.id, e)}
                        variants={highlightVariants}
                        initial="initial"
                        animate={selectedGoal === goal.id ? "highlight" : "initial"}
                      >
                        <path d={path} fill={goal.color} stroke="white" strokeWidth="1" />

                        {/* Goal number */}
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
                          {goal.id}
                        </text>

                        {/* Icon */}
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
                              alt={`Goal ${goal.id}`}
                              width="24"
                              height="24"
                              className="object-contain"
                            />
                          </div>
                        </foreignObject>

                        <title>{`Goal ${goal.id}: ${goal.title}`}</title>
                      </motion.g>
                    )
                  })}

                  {/* Center circle */}
                  <circle cx="0" cy="0" r="80" fill={primaryColor} />
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

            {/* Indicator triangle at top - made more prominent */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <motion.div
                className="w-0 h-0"
                style={{
                  borderLeft: "12px solid transparent",
                  borderRight: "12px solid transparent",
                  borderBottom: `18px solid ${primaryColor}`,
                }}
                animate={{
                  scale: isSpinning ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
                  duration: 0.5,
                }}
              />
            </div>

            {/* Spin Button */}
            <motion.button
              onClick={spinWheel}
              disabled={isSpinning}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {spinButtonText}
            </motion.button>

            {/* Previous spins history */}
            {spinHistory.length > 0 && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <span className="text-xs" style={{ color: primaryColor }}>
                  Previous:{" "}
                </span>
                {spinHistory.map((id, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white"
                    style={{ backgroundColor: goalsData.find((g) => g.id === id)?.color || "#888" }}
                    onClick={(e) => handleGoalClick(id, e)}
                  >
                    {id}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Goal Information Panel - increased spacing and width */}
          <motion.div
            ref={contentPanelRef}
            className="w-full lg:w-3/5 lg:pl-12 lg:pr-0"
            variants={containerVariants}
            initial="hidden"
            animate={contentControls}
          >
            {currentGoal ? (
              <>
                <motion.div
                  className="p-6 rounded-lg shadow-xl border-l-4"
                  style={{
                    borderLeftColor: currentGoal.color,
                    backgroundColor: "white",
                    color: textColor,
                  }}
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg"
                      style={{ backgroundColor: currentGoal.color }}
                    >
                      <img
                        src={currentGoal.icon || "/placeholder.svg"}
                        alt={`Goal ${currentGoal.id}`}
                        width="24"
                        height="24"
                        className="object-contain"
                      />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                      Goal {currentGoal.id}: {currentGoal.title}
                    </h2>
                  </div>

                  <motion.p className="text-lg mb-4" variants={itemVariants}>
                    {currentGoal.overview}
                  </motion.p>

                  <motion.div className="mt-6" variants={itemVariants}>
                    <h3 className="text-xl font-semibold mb-2" style={{ color: primaryColor }}>
                      Description:
                    </h3>
                    <p>{currentGoal.description}</p>
                  </motion.div>

                  {/* Navigation buttons */}
                  <motion.div className="mt-6 flex justify-between" variants={itemVariants}>
                    <button
                      onClick={() => {
                        // Find previous goal (wrap around to 17 if at the beginning)
                        const prevGoalId = currentGoal.id === 1 ? 17 : currentGoal.id - 1
                        handleGoalClick(prevGoalId, { preventDefault: () => {} })
                      }}
                      className="flex items-center hover:underline"
                      style={{ color: primaryColor }}
                    >
                      <ChevronRight size={16} className="transform rotate-180 mr-1" /> Previous
                    </button>

                    <button
                      onClick={() => {
                        // Find next goal (wrap around to 1 if at the end)
                        const nextGoalId = currentGoal.id === 17 ? 1 : currentGoal.id + 1
                        handleGoalClick(nextGoalId, { preventDefault: () => {} })
                      }}
                      className="flex items-center hover:underline"
                      style={{ color: primaryColor }}
                    >
                      Next <ChevronRight size={16} className="ml-1" />
                    </button>
                  </motion.div>

                  {/* Read more button */}
                  <motion.div className="mt-4 flex justify-center" variants={itemVariants}>
                    <Link
                      to={`/goal/${currentGoal.id}`}
                      className="inline-flex items-center justify-center px-6 py-2 text-white rounded-full font-medium shadow-lg hover:bg-opacity-90 transition-colors"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Read more about this goal
                    </Link>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <motion.div
                className="p-6 rounded-lg shadow-xl text-center"
                style={{ backgroundColor: "white", color: textColor }}
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
                  UN Sustainable Development Goals
                </h2>
                <p className="mb-4">
                  Spin the wheel or click on a segment to learn about each of the 17 UN Sustainable Development Goals.
                  These global goals were established to create a better future for all by addressing the world&apos;s most
                  pressing challenges.
                </p>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {Array.from({ length: 17 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer text-white"
                      style={{ backgroundColor: goalsData[idx].color }}
                      onClick={(e) => handleGoalClick(idx + 1, e)}
                    >
                      {idx + 1}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
    </div><Footer /></>
  )
}

export default SDGWheel
