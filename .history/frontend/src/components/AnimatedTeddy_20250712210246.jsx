"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

const TeddyBear = ({ show, mode = "peeking", score, onAnimationComplete }) => {
  const controls = useAnimation()
  const leftArmControls = useAnimation()
  const rightArmControls = useAnimation()
  const headControls = useAnimation()
  const earControls = useAnimation()
  const eyeControls = useAnimation()
  const leftLegControls = useAnimation()
  const rightLegControls = useAnimation()
  const bodyControls = useAnimation()

  const [isBlinking, setIsBlinking] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  // Color variables
  const colors = {
    furMain: "#795447",
    furLight: "#A1887F",
    furDark: "#3E2723",
    background: "#FBF190",
  }

  // Messages
  const messages = {
    welcome: "Let's learn about SDG Goal! 🎯",
    completion: {
      perfect: ["Perfect! You're amazing! 🏆", "Flawless victory! 🌟"],
      excellent: ["Great job! 🎯", "Well done! 👏"],
      good: ["Good effort! 💪", "Keep learning! 📚"],
    },
  }

  const getCompletionMessage = () => {
    if (score === 5) return messages.completion.perfect[Math.floor(Math.random() * messages.completion.perfect.length)]
    if (score >= 4)
      return messages.completion.excellent[Math.floor(Math.random() * messages.completion.excellent.length)]
    return messages.completion.good[Math.floor(Math.random() * messages.completion.good.length)]
  }

  // Natural blinking animation
  const startBlinking = () => {
    const blinkSequence = async () => {
      while (show) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000 + 2000))
        setIsBlinking(true)
        await eyeControls.start({
          scaleY: [1, 0.05, 1],
          transition: { duration: 0.2, ease: "easeInOut" },
        })
        setIsBlinking(false)
      }
    }
    blinkSequence()
  }

  // Walking animation
  const walkingAnimation = () => {
    // Alternating leg movement
    leftLegControls.start({
      rotate: [0, 20, -20, 0],
      y: [0, -5, 5, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    rightLegControls.start({
      rotate: [0, -20, 20, 0],
      y: [0, 5, -5, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 0.4, // Offset for alternating steps
      },
    })

    // Body bounce while walking
    bodyControls.start({
      y: [0, -8, 0],
      transition: {
        duration: 0.4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Head bob while walking
    headControls.start({
      y: [0, -3, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 0.4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }

  // Welcome animation sequence with walking
  const welcomeAnimation = async () => {
    setCurrentMessage(messages.welcome)

    // Start walking animation
    walkingAnimation()

    // Walk in from left
    await controls.start({
      x: [-300, -50],
      transition: { duration: 2, ease: "easeOut" },
    })

    // Stop walking and wave
    leftLegControls.stop()
    rightLegControls.stop()
    bodyControls.stop()
    headControls.stop()

    setShowMessage(true)

    // Wave hello with left arm
    await leftArmControls.start({
      rotate: [0, -45, 20, -30, 0],
      transition: { duration: 1, repeat: 2, ease: "easeInOut" },
    })

    // Start walking again and exit
    walkingAnimation()

    await controls.start({
      x: [-50, 300],
      transition: { duration: 2, ease: "easeIn" },
    })

    setShowMessage(false)
    onAnimationComplete?.()
  }

  // Peeking animation - positioned above quiz card like in image
  const peekingAnimation = async () => {
    // Stop all walking animations
    leftLegControls.stop()
    rightLegControls.stop()
    bodyControls.stop()

    // Position above quiz card (like peeking over)
    await controls.start({
      x: 0,
      y: -20, // Above the quiz card
      rotate: 0,
      transition: { duration: 0.5 },
    })

    // Gentle head movements
    headControls.start({
      y: [0, -5, 0],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Ear wiggle
    earControls.start({
      rotate: [0, 8, -8, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Subtle arm movement
    leftArmControls.start({
      rotate: [0, -10, 0],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }

  // Completion animation - diagonal hiding position
  const completionAnimation = async () => {
    setCurrentMessage(getCompletionMessage())

    // Walk in from right side
    walkingAnimation()

    await controls.start({
      x: [200, 50],
      y: [0, 0],
      transition: { duration: 1.5, ease: "easeOut" },
    })

    // Stop walking and get into hiding position
    leftLegControls.stop()
    rightLegControls.stop()
    bodyControls.stop()
    headControls.stop()

    // Diagonal tilt hiding position (like peeking from behind)
    await controls.start({
      rotate: -15, // Diagonal tilt
      y: 40, // Lower position (hiding below)
      x: 30, // Slightly to the right
      transition: { duration: 0.8, ease: "easeOut" },
    })

    setShowMessage(true)

    // Wave with left hand
    await leftArmControls.start({
      rotate: [0, -45, 20, -30, 0],
      y: [0, -15, 0],
      transition: { duration: 0.8, repeat: 3, ease: "easeInOut" },
    })

    // Happy head movements
    headControls.start({
      y: [0, -8, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }

  useEffect(() => {
    if (!show) return

    startBlinking()

    if (mode === "welcome") {
      welcomeAnimation()
    } else if (mode === "peeking") {
      peekingAnimation()
    } else if (mode === "completion") {
      completionAnimation()
    }
  }, [show, mode, score])

  if (!show) return null

  return (
    <motion.div
      animate={controls}
      className={`absolute z-30 ${
        mode === "peeking"
          ? "top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
          : // Above quiz card
            mode === "completion"
            ? "bottom-0 right-0"
            : // Bottom right for completion
              "bottom-0 left-0"
      }`}
      style={{ originX: 0.5, originY: 1 }}
    >
      {/* Teddy Bear */}
      <div className="relative w-48 h-48">
        {/* Body */}
        <motion.div
          animate={bodyControls}
          className="absolute left-1/2 top-1/2 w-32 h-28 bg-[#795447] rounded-full border-2 border-[#3E2723]
                     transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute left-1/2 top-1/2 w-24 h-20 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

        {/* Legs with walking animation */}
        <motion.div
          animate={leftLegControls}
          className="absolute left-1/3 bottom-2 w-16 h-16 bg-[#795447] rounded-full border-2 border-[#3E2723]
                     transform -translate-x-1/2 origin-top"
        >
          <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

        <motion.div
          animate={rightLegControls}
          className="absolute right-1/3 bottom-2 w-16 h-16 bg-[#795447] rounded-full border-2 border-[#3E2723]
                     transform translate-x-1/2 origin-top"
        >
          <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

        {/* Arms */}
        <motion.div
          animate={leftArmControls}
          className="absolute left-1/4 top-1/2 w-32 h-14 bg-[#795447] border-2 border-[#3E2723]
                     rounded-[30%_50%_30%_50%] transform -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-bottom"
        ></motion.div>

        <motion.div
          animate={rightArmControls}
          className="absolute right-1/4 top-1/2 w-32 h-14 bg-[#795447] border-2 border-[#3E2723]
                     rounded-[50%_50%_30%_50%] transform translate-x-1/2 -translate-y-1/2 rotate-45 origin-bottom"
        ></motion.div>

        {/* Head */}
        <motion.div
          animate={headControls}
          className="absolute left-1/2 top-1/4 w-28 h-28 bg-[#795447] rounded-full border-2 border-[#3E2723]
                     transform -translate-x-1/2 -translate-y-1/2"
        >
          {/* Snout */}
          <div className="absolute left-1/2 bottom-1/4 w-16 h-16 bg-[#A1887F] rounded-full transform -translate-x-1/2"></div>

          {/* Nose */}
          <div className="absolute left-1/2 bottom-1/3 w-10 h-8 bg-[#3E2723] rounded-full transform -translate-x-1/2"></div>

          {/* Mouth */}
          <div className="absolute left-1/2 bottom-1/4 w-8 h-3 bg-[#3E2723] rounded-full transform -translate-x-1/2"></div>

          {/* Eyes */}
          <motion.div
            animate={eyeControls}
            className="absolute left-1/4 top-1/3 w-6 h-6 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"
          >
            {!isBlinking && <div className="absolute right-1 bottom-1 w-2 h-2 bg-[#A1887F] rounded-full"></div>}
          </motion.div>
          <motion.div
            animate={eyeControls}
            className="absolute right-1/4 top-1/3 w-6 h-6 bg-black rounded-full transform translate-x-1/2 -translate-y-1/2"
          >
            {!isBlinking && <div className="absolute right-1 bottom-1 w-2 h-2 bg-[#A1887F] rounded-full"></div>}
          </motion.div>
        </motion.div>

        {/* Ears */}
        <motion.div
          animate={earControls}
          className="absolute left-1/4 top-2 w-16 h-16 bg-[#795447] rounded-full border-2 border-[#3E2723]
                     transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
        <motion.div
          animate={earControls}
          className="absolute right-1/4 top-2 w-16 h-16 bg-[#795447] rounded-full border-2 border-[#3E2723]
                     transform translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
      </div>

      {/* Message Bubble */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bg-white rounded-xl px-4 py-2 shadow-lg border-2 border-teal-200 max-w-xs
                      ${
                        mode === "completion"
                          ? "-top-16 -left-32"
                          : mode === "peeking"
                            ? "-top-12 left-1/2 transform -translate-x-1/2"
                            : "-top-16 left-1/2 transform -translate-x-1/2"
                      }`}
        >
          <div className="text-sm font-medium text-gray-800 text-center">{currentMessage}</div>
          <div
            className={`absolute w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white
                          ${mode === "completion" ? "top-full left-8" : "top-full left-1/2 transform -translate-x-1/2"}`}
          ></div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TeddyBear
