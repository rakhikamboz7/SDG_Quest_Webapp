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
  const walkingControls = useAnimation()

  const [isBlinking, setIsBlinking] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [walkingStep, setWalkingStep] = useState(0)

  // Cute colors matching reference
  const colors = {
    furMain: "#D2691E",
    furLight: "#F4A460",
    furDark: "#8B4513",
    earInner: "#DEB887",
    nose: "#000",
    eyeShine: "#FFF",
  }

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

  // Natural blinking
  const startBlinking = () => {
    const blinkSequence = async () => {
      while (show) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000 + 2000))
        setIsBlinking(true)
        await eyeControls.start({
          scaleY: [1, 0.1, 1],
          transition: { duration: 0.15, ease: "easeInOut" },
        })
        setIsBlinking(false)
      }
    }
    blinkSequence()
  }

  // PROPER WALKING ANIMATION - Standing upright and walking naturally
  const naturalWalkingAnimation = () => {
    // Alternating leg steps - like a real walk
    leftLegControls.start({
      rotate: [0, 30, -15, 0],
      y: [0, -5, 0, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    rightLegControls.start({
      rotate: [0, -15, 30, 0],
      y: [0, 0, -5, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 0.4,
      },
    })

    // Natural arm swinging opposite to legs
    leftArmControls.start({
      rotate: [0, -25, 15, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 0.4, // Opposite to right leg
      },
    })

    rightArmControls.start({
      rotate: [0, 15, -25, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Subtle body sway while walking
    bodyControls.start({
      y: [0, -8, 0, -8, 0],
      rotate: [0, 1, 0, -1, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Head bob
    headControls.start({
      y: [0, -3, 0, -3, 0],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }

  // WELCOME ANIMATION - Walking with only face and hands visible above quiz card
  const welcomeAnimation = async () => {
    setCurrentMessage(messages.welcome)

    // Start natural walking
    naturalWalkingAnimation()

    // Walk from left to right, showing only above quiz card
    await walkingControls.start({
      x: [-400, 400],
      transition: { duration: 4, ease: "linear" },
    })

    // Stop at center and wave
    leftLegControls.stop()
    rightLegControls.stop()
    leftArmControls.stop()
    rightArmControls.stop()
    bodyControls.stop()
    headControls.stop()

    await walkingControls.start({
      x: [400, 0],
      transition: { duration: 1, ease: "easeOut" },
    })

    setShowMessage(true)

    // Cute wave
    await leftArmControls.start({
      rotate: [0, -60, 20, -40, 0],
      y: [0, -15, 0, -10, 0],
      transition: { duration: 1, repeat: 3, ease: "easeInOut" },
    })

    // Continue walking and exit
    naturalWalkingAnimation()
    await walkingControls.start({
      x: [0, 400],
      transition: { duration: 2, ease: "easeIn" },
    })

    setShowMessage(false)
    onAnimationComplete?.()
  }

  // PEEKING MODE - Half teddy over the card (like reference image)
  const peekingAnimation = async () => {
    // Stop all animations
    leftLegControls.stop()
    rightLegControls.stop()
    bodyControls.stop()
    leftArmControls.stop()
    rightArmControls.stop()

    // Position for half-teddy peeking over
    await controls.start({
      x: 0,
      y: 0,
      rotate: 0,
      transition: { duration: 0.5 },
    })

    // Gentle movements
    headControls.start({
      y: [0, -4, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Ear wiggle
    earControls.start({
      rotate: [0, 8, -8, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Paw movements
    leftArmControls.start({
      y: [0, -3, 0],
      rotate: [0, -5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    rightArmControls.start({
      y: [0, -3, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 3,
      },
    })
  }

  // COMPLETION ANIMATION - Peek from BELOW quiz card, lift leg, wave
  const completionAnimation = async () => {
    setCurrentMessage(getCompletionMessage())

    // Position below the quiz card
    await controls.start({
      x: 0,
      y: 60, // Below the quiz card
      rotate: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    })

    setShowMessage(true)

    // Lift one leg (playful pose)
    await rightLegControls.start({
      rotate: -45,
      y: -20,
      transition: { duration: 0.6, ease: "easeOut" },
    })

    // Wave hello with left hand
    await leftArmControls.start({
      rotate: [0, -70, 30, -50, 0],
      y: [0, -25, 0, -15, 0],
      transition: { duration: 1, repeat: 4, ease: "easeInOut" },
    })

    // Happy bouncing
    bodyControls.start({
      y: [0, -12, 0],
      transition: {
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Happy head movements
    headControls.start({
      y: [0, -8, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 1.5,
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

  // WALKING MODE - Only face and hands visible above quiz card
  if (mode === "welcome") {
    return (
      <motion.div
        animate={walkingControls}
        className="absolute top-0 left-0 transform -translate-y-1/2 z-30"
        style={{ originX: 0.5, originY: 1 }}
      >
        <div className="relative w-32 h-24">
          {/* Head - Cute and round */}
          <motion.div
            animate={headControls}
            className="absolute left-1/2 top-0 w-20 h-20 bg-[#D2691E] rounded-full border-2 border-[#8B4513]
                       transform -translate-x-1/2 shadow-lg"
          >
            {/* Cute ears */}
            <motion.div animate={earControls} className="absolute left-1 -top-1 w-7 h-7 bg-[#8B4513] rounded-full">
              <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>
            <motion.div animate={earControls} className="absolute right-1 -top-1 w-7 h-7 bg-[#8B4513] rounded-full">
              <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>

            {/* Cute eyes with shine */}
            <motion.div animate={eyeControls} className="absolute left-1/4 top-1/3 w-3 h-3 bg-black rounded-full">
              {!isBlinking && <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"></div>}
            </motion.div>
            <motion.div animate={eyeControls} className="absolute right-1/4 top-1/3 w-3 h-3 bg-black rounded-full">
              {!isBlinking && <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"></div>}
            </motion.div>

            {/* Cute nose */}
            <div className="absolute left-1/2 top-1/2 w-2 h-1.5 bg-black rounded-full transform -translate-x-1/2"></div>

            {/* Happy mouth */}
            <div className="absolute left-1/2 bottom-1/3 w-1 h-1 bg-black rounded-full transform -translate-x-1/2"></div>
            <div className="absolute left-1/2 bottom-1/4 w-4 h-1 border-b-2 border-black rounded-full transform -translate-x-1/2"></div>
          </motion.div>

          {/* Cute small hands/paws */}
          <motion.div
            animate={leftArmControls}
            className="absolute left-0 bottom-2 w-6 h-6 bg-[#D2691E] rounded-full border border-[#8B4513] shadow-md"
          >
            <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-[#F4A460] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

          <motion.div
            animate={rightArmControls}
            className="absolute right-0 bottom-2 w-6 h-6 bg-[#D2691E] rounded-full border border-[#8B4513] shadow-md"
          >
            <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-[#F4A460] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>
        </div>

        {/* Message Bubble */}
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-xl px-3 py-2 shadow-lg border-2 border-teal-200 max-w-xs"
          >
            <div className="text-xs font-medium text-gray-800 text-center">{currentMessage}</div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  // PEEKING MODE - Half teddy over the card (matching reference)
  if (mode === "peeking") {
    return (
      <motion.div
        animate={controls}
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
        style={{ originX: 0.5, originY: 1 }}
      >
        <div className="relative w-36 h-24">
          {/* Head - Half visible over card */}
          <motion.div
            animate={headControls}
            className="absolute left-1/2 top-0 w-24 h-24 bg-[#D2691E] rounded-full border-2 border-[#8B4513]
                       transform -translate-x-1/2 shadow-lg"
          >
            {/* Ears */}
            <motion.div animate={earControls} className="absolute left-2 -top-2 w-8 h-8 bg-[#8B4513] rounded-full">
              <div className="absolute left-1/2 top-1/2 w-5 h-5 bg-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>
            <motion.div animate={earControls} className="absolute right-2 -top-2 w-8 h-8 bg-[#8B4513] rounded-full">
              <div className="absolute left-1/2 top-1/2 w-5 h-5 bg-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>

            {/* Cute eyes */}
            <motion.div animate={eyeControls} className="absolute left-1/4 top-1/3 w-3.5 h-3.5 bg-black rounded-full">
              {!isBlinking && <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full"></div>}
            </motion.div>
            <motion.div animate={eyeControls} className="absolute right-1/4 top-1/3 w-3.5 h-3.5 bg-black rounded-full">
              {!isBlinking && <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full"></div>}
            </motion.div>

            {/* Nose */}
            <div className="absolute left-1/2 top-1/2 w-3 h-2 bg-black rounded-full transform -translate-x-1/2"></div>

            {/* Happy smile */}
            <div className="absolute left-1/2 bottom-1/3 w-6 h-2 border-b-2 border-black rounded-full transform -translate-x-1/2"></div>
          </motion.div>

          {/* Paws on the edge - like reference image */}
          <motion.div
            animate={leftArmControls}
            className="absolute left-2 bottom-0 w-10 h-8 bg-[#D2691E] rounded-full border border-[#8B4513] shadow-md"
          >
            <div className="absolute left-1/2 top-1/2 w-7 h-6 bg-[#F4A460] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Paw pads */}
            <div className="absolute left-1/2 top-1/3 w-1.5 h-1.5 bg-[#8B4513] rounded-full transform -translate-x-1/2"></div>
          </motion.div>

          <motion.div
            animate={rightArmControls}
            className="absolute right-2 bottom-0 w-10 h-8 bg-[#D2691E] rounded-full border border-[#8B4513] shadow-md"
          >
            <div className="absolute left-1/2 top-1/2 w-7 h-6 bg-[#F4A460] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Paw pads */}
            <div className="absolute left-1/2 top-1/3 w-1.5 h-1.5 bg-[#8B4513] rounded-full transform -translate-x-1/2"></div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // COMPLETION MODE - Full teddy peeking from below
  return (
    <motion.div animate={controls} className="absolute bottom-0 right-1/4 z-30" style={{ originX: 0.5, originY: 1 }}>
      {/* Full cute teddy */}
      <div className="relative w-32 h-32">
        {/* Body */}
        <motion.div
          animate={bodyControls}
          className="absolute left-1/2 top-1/2 w-20 h-18 bg-[#D2691E] rounded-full border-2 border-[#8B4513]
                     transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
        >
          <div className="absolute left-1/2 top-1/2 w-14 h-12 bg-[#F4A460] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

        {/* Legs */}
        <motion.div
          animate={leftLegControls}
          className="absolute left-1/3 bottom-1 w-8 h-8 bg-[#D2691E] rounded-full border border-[#8B4513] shadow-md
                     transform -translate-x-1/2 origin-top"
        >
          <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-[#F4A460] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

        <motion.div
          animate={rightLegControls}
          className="absolute right-1/3 bottom-1 w-8 h-8 bg-[#D2691E] rounded-full border border-[#8B4513] shadow-md
                     transform translate-x-1/2 origin-top"
        >
          <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-[#F4A460] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>

        {/* Arms */}
        <motion.div
          animate={leftArmControls}
          className="absolute left-1/4 top-1/2 w-16 h-6 bg-[#D2691E] border border-[#8B4513]
                     rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-bottom shadow-md"
        ></motion.div>

        <motion.div
          animate={rightArmControls}
          className="absolute right-1/4 top-1/2 w-16 h-6 bg-[#D2691E] border border-[#8B4513]
                     rounded-full transform translate-x-1/2 -translate-y-1/2 rotate-45 origin-bottom shadow-md"
        ></motion.div>

        {/* Head */}
        <motion.div
          animate={headControls}
          className="absolute left-1/2 top-1/4 w-18 h-18 bg-[#D2691E] rounded-full border-2 border-[#8B4513]
                     transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
        >
          {/* Ears */}
          <motion.div animate={earControls} className="absolute left-1 -top-1 w-6 h-6 bg-[#8B4513] rounded-full">
            <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>
          <motion.div animate={earControls} className="absolute right-1 -top-1 w-6 h-6 bg-[#8B4513] rounded-full">
            <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

          {/* Eyes */}
          <motion.div animate={eyeControls} className="absolute left-1/4 top-1/3 w-3 h-3 bg-black rounded-full">
            {!isBlinking && <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"></div>}
          </motion.div>
          <motion.div animate={eyeControls} className="absolute right-1/4 top-1/3 w-3 h-3 bg-black rounded-full">
            {!isBlinking && <div className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full"></div>}
          </motion.div>

          {/* Nose */}
          <div className="absolute left-1/2 top-1/2 w-2 h-1.5 bg-black rounded-full transform -translate-x-1/2"></div>

          {/* Happy mouth */}
          <div className="absolute left-1/2 bottom-1/3 w-4 h-1.5 border-b-2 border-black rounded-full transform -translate-x-1/2"></div>
        </motion.div>
      </div>

      {/* Message Bubble */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-20 -left-24 bg-white rounded-xl px-4 py-2 shadow-lg border-2 border-teal-200 max-w-xs"
        >
          <div className="text-sm font-medium text-gray-800 text-center">{currentMessage}</div>
          <div className="absolute top-full left-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TeddyBear
