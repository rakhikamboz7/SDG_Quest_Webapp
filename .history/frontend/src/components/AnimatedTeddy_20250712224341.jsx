"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

const TeddyBear = ({ show, mode = "peeking", score, onAnimationComplete }) => {
  const controls = useAnimation()
  const headControls = useAnimation()
  const eyeControls = useAnimation()
  const earControls = useAnimation()
  const leftArmControls = useAnimation()
  const rightArmControls = useAnimation()
  const sparkleControls = useAnimation()
  const glowControls = useAnimation()
  const questionMarkControls = useAnimation()

  const [isBlinking, setIsBlinking] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [showQuestionMark, setShowQuestionMark] = useState(false)

  // 🎨 Gorgeous Color Palette
  const colors = {
    furMain: "#D2691E",
    furLight: "#F4A460",
    furAccent: "#DEB887",
    furDark: "#8B4513",
    earInner: "#FFB6C1",
    eyeColor: "#000",
    eyeShine: "#FFF",
    noseColor: "#FF69B4",
    cheekBlush: "#FFB6C1",
  }

  // 💬 Beautiful Messages
  const messages = {
    welcome: "✨ Ready for an amazing SDG adventure? ✨",
    completion: {
      perfect: ["🏆 You're absolutely incredible! 🏆", "✨ Perfect score! You're a star! ✨"],
      excellent: ["🎯 Amazing work! So proud! 🎯", "🌟 Excellent job! You rock! 🌟"],
      good: ["💪 Great effort! Keep shining! 💪", "📚 You're learning so well! 📚"],
    },
  }

  const getCompletionMessage = () => {
    if (score === 5) return messages.completion.perfect[Math.floor(Math.random() * messages.completion.perfect.length)]
    if (score >= 4)
      return messages.completion.excellent[Math.floor(Math.random() * messages.completion.excellent.length)]
    return messages.completion.good[Math.floor(Math.random() * messages.completion.good.length)]
  }

  // ✨ Magical Blinking Animation
  const startBlinking = () => {
    const blinkSequence = async () => {
      while (show) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 4000 + 3000))
        setIsBlinking(true)
        await eyeControls.start({
          scaleY: [1, 0.1, 1],
          transition: { duration: 0.2, ease: "easeInOut" },
        })
        setIsBlinking(false)
      }
    }
    blinkSequence()
  }

  // 🌟 Sparkle Effects
  const startSparkles = () => {
    sparkleControls.start({
      scale: [0, 1.5, 0],
      rotate: [0, 180, 360],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }

  // ✨ Magical Glow Effect
  const startGlow = () => {
    glowControls.start({
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }

  // ❓ Question Mark Animation
  const startQuestionMark = () => {
    setShowQuestionMark(true)
    questionMarkControls.start({
      y: [0, -8, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }

  // 🎭 CENTER WELCOME ANIMATION
  const centerWelcomeAnimation = async () => {
    setCurrentMessage(messages.welcome)

    // Magical entrance from center
    await controls.start({
      scale: [0, 1.2, 1],
      rotate: [0, 360],
      opacity: [0, 1],
      transition: { duration: 1.5, ease: "easeOut" },
    })

    setShowMessage(true)
    startSparkles()
    startGlow()

    // Happy bouncing
    controls.start({
      y: [0, -20, 0],
      transition: {
        duration: 1,
        repeat: 3,
        ease: "easeInOut",
      },
    })

    // Cute head movements
    headControls.start({
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 2,
        repeat: 2,
        ease: "easeInOut",
      },
    })

    // Ear wiggle
    earControls.start({
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 1,
        repeat: 4,
        ease: "easeInOut",
      },
    })

    // Wave goodbye with LEFT hand
    await leftArmControls.start({
      rotate: [0, -60, 30, -45, 0],
      y: [0, -15, 0, -10, 0],
      transition: { duration: 1.2, repeat: 3, ease: "easeInOut" },
    })

    // Magical exit
    await controls.start({
      scale: [1, 0],
      y: [0, -100],
      opacity: [1, 0],
      transition: { duration: 1, ease: "easeIn" },
    })

    setShowMessage(false)
    onAnimationComplete?.()
  }

  // 👀 ABOVE QUIZ CARD ANIMATION (with Question Mark)
  const aboveQuizAnimation = async () => {
    // Gentle entrance
    await controls.start({
      opacity: [0, 1],
      y: [20, 0],
      scale: [0.8, 1],
      transition: { duration: 0.8, ease: "easeOut" },
    })

    // Start question mark
    startQuestionMark()

    // Gentle floating
    controls.start({
      y: [0, -8, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Head movements
    headControls.start({
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Ear flutter
    earControls.start({
      rotate: [0, 8, -8, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Gentle left arm sway
    leftArmControls.start({
      rotate: [0, -10, 10, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Gentle right arm sway (opposite)
    rightArmControls.start({
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 3,
      },
    })
  }

  // 🎉 MOVE TO RIGHT SIDE AND WAVE (Natural Right Hand Waving)
  const moveToRightAndWaveAnimation = async () => {
    setCurrentMessage(getCompletionMessage())
    setShowQuestionMark(false) // Hide question mark

    // Stop all current animations
    controls.stop()
    headControls.stop()
    earControls.stop()
    leftArmControls.stop()
    rightArmControls.stop()

    // Move from above quiz card to right side
    await controls.start({
      x: [0, 200], // Move to right
      y: [0, 100], // Move down to right side
      scale: [1, 0.9, 1], // Slight scale for smooth transition
      transition: { duration: 1.2, ease: "easeInOut" },
    })

    setShowMessage(true)
    startSparkles()
    startGlow()

    // Natural RIGHT hand waving (more natural movement)
    rightArmControls.start({
      rotate: [0, -45, 15, -30, 0], // Natural waving motion
      y: [0, -10, 0, -5, 0], // Slight up-down movement
      transition: {
        duration: 1.8, // Slower, more natural
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Keep left arm still and natural
    leftArmControls.start({
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Happy head bobbing
    headControls.start({
      y: [0, -8, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Ear dancing
    earControls.start({
      rotate: [0, 15, -15, 0],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    // Gentle body sway
    controls.start({
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 1,
      },
    })
  }

  useEffect(() => {
    if (!show) return

    startBlinking()

    if (mode === "welcome") {
      centerWelcomeAnimation()
    } else if (mode === "peeking") {
      aboveQuizAnimation()
    } else if (mode === "completion") {
      moveToRightAndWaveAnimation()
    }
  }, [show, mode, score])

  if (!show) return null

  // 🎭 CENTER WELCOME TEDDY
  if (mode === "welcome") {
    return (
      <motion.div
        animate={controls}
        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      >
        {/* Magical Glow Background */}
        <motion.div
          animate={glowControls}
          className="absolute w-96 h-96 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-full blur-3xl opacity-30"
        />

        {/* Sparkles */}
        <motion.div animate={sparkleControls} className="absolute -top-10 -left-10 text-4xl">
          ✨
        </motion.div>
        <motion.div
          animate={sparkleControls}
          className="absolute -top-5 right-5 text-3xl"
          style={{ animationDelay: "0.5s" }}
        >
          ⭐
        </motion.div>
        <motion.div
          animate={sparkleControls}
          className="absolute bottom-0 -left-5 text-3xl"
          style={{ animationDelay: "1s" }}
        >
          💫
        </motion.div>
        <motion.div
          animate={sparkleControls}
          className="absolute -bottom-5 right-0 text-4xl"
          style={{ animationDelay: "1.5s" }}
        >
          🌟
        </motion.div>

        {/* Gorgeous Teddy */}
        <div className="relative w-48 h-48 drop-shadow-2xl">
          {/* Body with gradient */}
          <div className="absolute left-1/2 top-1/2 w-32 h-28 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-3 border-[#8B4513] shadow-2xl transform -translate-x-1/2 -translate-y-1/2">
            <div className="absolute left-1/2 top-1/2 w-24 h-20 bg-gradient-to-br from-[#F4A460] to-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Heart on chest */}
            <div className="absolute left-1/2 top-1/2 text-2xl transform -translate-x-1/2 -translate-y-1/2">💖</div>
          </div>

          {/* Arms */}
          <motion.div
            animate={leftArmControls}
            className="absolute left-1/4 top-1/2 w-28 h-12 bg-gradient-to-r from-[#D2691E] to-[#8B4513] border-2 border-[#8B4513] rounded-full transform -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-bottom shadow-xl"
          />
          <motion.div
            animate={rightArmControls}
            className="absolute right-1/4 top-1/2 w-28 h-12 bg-gradient-to-r from-[#D2691E] to-[#8B4513] border-2 border-[#8B4513] rounded-full transform translate-x-1/2 -translate-y-1/2 rotate-45 origin-bottom shadow-xl"
          />

          {/* Legs */}
          <div className="absolute left-1/3 bottom-2 w-16 h-16 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-2 border-[#8B4513] shadow-xl transform -translate-x-1/2">
            <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-gradient-to-br from-[#F4A460] to-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          <div className="absolute right-1/3 bottom-2 w-16 h-16 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-2 border-[#8B4513] shadow-xl transform translate-x-1/2">
            <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-gradient-to-br from-[#F4A460] to-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Gorgeous Head */}
          <motion.div
            animate={headControls}
            className="absolute left-1/2 top-1/4 w-32 h-32 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-3 border-[#8B4513] shadow-2xl transform -translate-x-1/2 -translate-y-1/2"
          >
            {/* Cute Ears */}
            <motion.div
              animate={earControls}
              className="absolute left-2 -top-2 w-12 h-12 bg-gradient-to-br from-[#8B4513] to-[#654321] rounded-full shadow-lg"
            >
              <div className="absolute left-1/2 top-1/2 w-8 h-8 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>
            <motion.div
              animate={earControls}
              className="absolute right-2 -top-2 w-12 h-12 bg-gradient-to-br from-[#8B4513] to-[#654321] rounded-full shadow-lg"
            >
              <div className="absolute left-1/2 top-1/2 w-8 h-8 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            </motion.div>

            {/* Sparkling Eyes */}
            <motion.div
              animate={eyeControls}
              className="absolute left-1/4 top-1/3 w-5 h-5 bg-black rounded-full shadow-inner"
            >
              {!isBlinking && (
                <>
                  <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute bottom-0 left-1 w-1 h-1 bg-white rounded-full opacity-60"></div>
                </>
              )}
            </motion.div>
            <motion.div
              animate={eyeControls}
              className="absolute right-1/4 top-1/3 w-5 h-5 bg-black rounded-full shadow-inner"
            >
              {!isBlinking && (
                <>
                  <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute bottom-0 left-1 w-1 h-1 bg-white rounded-full opacity-60"></div>
                </>
              )}
            </motion.div>

            {/* Rosy Cheeks */}
            <div className="absolute left-4 top-1/2 w-6 h-6 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-full opacity-70 blur-sm"></div>
            <div className="absolute right-4 top-1/2 w-6 h-6 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-full opacity-70 blur-sm"></div>

            {/* Cute Nose */}
            <div className="absolute left-1/2 top-1/2 w-4 h-3 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] rounded-full transform -translate-x-1/2 shadow-sm"></div>

            {/* Happy Smile */}
            <div className="absolute left-1/2 bottom-1/3 w-8 h-3 border-b-3 border-[#8B4513] rounded-full transform -translate-x-1/2"></div>
            <div className="absolute left-1/2 bottom-1/4 w-2 h-2 bg-[#8B4513] rounded-full transform -translate-x-1/2"></div>
          </motion.div>
        </div>

        {/* Magical Message Bubble */}
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute -bottom-32 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-2xl px-6 py-4 shadow-2xl border-3 border-white backdrop-blur-sm"
          >
            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 text-center">
              {currentMessage}
            </div>
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-white"></div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  // 👀 ABOVE QUIZ CARD TEDDY (with Question Mark) OR RIGHT SIDE COMPLETION TEDDY
  return (
    <motion.div
      animate={controls}
      className={
        mode === "peeking"
          ? "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          : "absolute top-1/2 right-4 transform -translate-y-1/2 z-30"
      }
    >
      {/* Magical Glow (only for completion) */}
      {mode === "completion" && (
        <motion.div
          animate={glowControls}
          className="absolute -inset-8 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 rounded-full blur-2xl opacity-40"
        />
      )}

      {/* Sparkles around teddy (only for completion) */}
      {mode === "completion" && (
        <>
          <motion.div animate={sparkleControls} className="absolute -top-5 -left-5 text-2xl">
            ✨
          </motion.div>
          <motion.div
            animate={sparkleControls}
            className="absolute -top-3 right-2 text-xl"
            style={{ animationDelay: "0.5s" }}
          >
            ⭐
          </motion.div>
          <motion.div
            animate={sparkleControls}
            className="absolute top-5 -right-3 text-2xl"
            style={{ animationDelay: "1s" }}
          >
            💫
          </motion.div>
        </>
      )}

      <div className="relative w-40 h-32 drop-shadow-xl">
        {/* Question Mark (only during peeking mode) */}
        {showQuestionMark && mode === "peeking" && (
          <motion.div
            animate={questionMarkControls}
            className="absolute -top-8 right-2 text-4xl font-bold text-blue-600 drop-shadow-lg z-10"
          >
            ❓
          </motion.div>
        )}

        {/* Body (for completion mode, show more body) */}
        {mode === "completion" && (
          <div className="absolute left-1/2 top-16 w-24 h-20 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-2 border-[#8B4513] shadow-xl transform -translate-x-1/2">
            <div className="absolute left-1/2 top-1/2 w-18 h-14 bg-gradient-to-br from-[#F4A460] to-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Heart on chest */}
            <div className="absolute left-1/2 top-1/3 text-lg transform -translate-x-1/2">💖</div>
          </div>
        )}

        {/* Arms */}
        <motion.div
          animate={leftArmControls}
          className="absolute left-3 top-8 w-20 h-8 bg-gradient-to-r from-[#D2691E] to-[#8B4513] border-2 border-[#8B4513] rounded-full transform -rotate-45 origin-bottom shadow-lg"
        />
        <motion.div
          animate={rightArmControls}
          className="absolute right-3 top-8 w-20 h-8 bg-gradient-to-r from-[#D2691E] to-[#8B4513] border-2 border-[#8B4513] rounded-full transform rotate-45 origin-bottom shadow-lg"
        />

        {/* Gorgeous Head */}
        <motion.div
          animate={headControls}
          className="absolute left-1/2 top-0 w-28 h-28 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-3 border-[#8B4513] shadow-2xl transform -translate-x-1/2"
        >
          {/* Cute Ears */}
          <motion.div
            animate={earControls}
            className="absolute left-2 -top-2 w-10 h-10 bg-gradient-to-br from-[#8B4513] to-[#654321] rounded-full shadow-lg"
          >
            <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>
          <motion.div
            animate={earControls}
            className="absolute right-2 -top-2 w-10 h-10 bg-gradient-to-br from-[#8B4513] to-[#654321] rounded-full shadow-lg"
          >
            <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>

          {/* Sparkling Eyes */}
          <motion.div animate={eyeControls} className="absolute left-1/4 top-1/3 w-4 h-4 bg-black rounded-full">
            {!isBlinking && (
              <>
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute bottom-0 left-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
              </>
            )}
          </motion.div>
          <motion.div animate={eyeControls} className="absolute right-1/4 top-1/3 w-4 h-4 bg-black rounded-full">
            {!isBlinking && (
              <>
                <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                <div className="absolute bottom-0 left-0.5 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
              </>
            )}
          </motion.div>

          {/* Rosy Cheeks */}
          <div className="absolute left-3 top-1/2 w-4 h-4 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-full opacity-70 blur-sm"></div>
          <div className="absolute right-3 top-1/2 w-4 h-4 bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] rounded-full opacity-70 blur-sm"></div>

          {/* Cute Nose */}
          <div className="absolute left-1/2 top-1/2 w-3 h-2 bg-gradient-to-br from-[#FF69B4] to-[#FF1493] rounded-full transform -translate-x-1/2"></div>

          {/* Happy Smile */}
          <div className="absolute left-1/2 bottom-1/3 w-6 h-2 border-b-2 border-[#8B4513] rounded-full transform -translate-x-1/2"></div>
        </motion.div>

        {/* Cute Paws (for peeking mode) */}
        {mode === "peeking" && (
          <>
            <div className="absolute left-3 bottom-0 w-12 h-10 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-2 border-[#8B4513] shadow-lg">
              <div className="absolute left-1/2 top-1/2 w-8 h-7 bg-gradient-to-br from-[#F4A460] to-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-1/3 w-2 h-2 bg-[#8B4513] rounded-full transform -translate-x-1/2"></div>
            </div>

            <div className="absolute right-3 bottom-0 w-12 h-10 bg-gradient-to-br from-[#D2691E] to-[#8B4513] rounded-full border-2 border-[#8B4513] shadow-lg">
              <div className="absolute left-1/2 top-1/2 w-8 h-7 bg-gradient-to-br from-[#F4A460] to-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-1/3 w-2 h-2 bg-[#8B4513] rounded-full transform -translate-x-1/2"></div>
            </div>
          </>
        )}
      </div>

      {/* Gorgeous Message Bubble (only for completion) */}
      {showMessage && mode === "completion" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="absolute -top-24 -left-32 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100 rounded-2xl px-4 py-3 shadow-2xl border-3 border-white backdrop-blur-sm max-w-xs"
        >
          <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 text-center">
            {currentMessage}
          </div>
          <div className="absolute top-full right-8 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TeddyBear
