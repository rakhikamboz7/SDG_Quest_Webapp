"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * @typedef {Object} AnimatedTeddyBearProps
 * @property {string} goalId
 * @property {() => void} [onAnimationComplete]
 * @property {"welcome" | "completion"} [mode]
 * @property {number} [score]
 */

const AnimatedTeddyBear = ({ goalId, onAnimationComplete, mode = "welcome", score }) => {
  const controls = useAnimation()
  const eyeControls = useAnimation()
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  const welcomeMessages = {
    "1": "Hi there! Let's learn about No Poverty together! 🏠",
    "2": "Ready to explore Zero Hunger? Let's go! 🌾",
    "3": "Time to discover Good Health and Well-being! 🏥",
    "4": "Let's dive into Quality Education! 📚",
    "5": "Exploring Gender Equality today! ⚖️",
    "6": "Clean Water and Sanitation awaits! 💧",
    "7": "Let's power up with Clean Energy! ⚡",
    "8": "Economic Growth adventure begins! 📈",
    "9": "Innovation and Infrastructure time! 🏭",
    "10": "Reducing Inequalities together! 🤝",
    "11": "Sustainable Cities journey starts! 🏙️",
    "12": "Responsible Consumption quest! ♻️",
    "13": "Climate Action mission! 🌍",
    "14": "Life Below Water exploration! 🐟",
    "15": "Life on Land adventure! 🌳",
    "16": "Peace and Justice journey! ⚖️",
    "17": "Partnerships for Goals! 🤝",
  }

  useEffect(() => {
    if (mode === "welcome") {
      const message = welcomeMessages[goalId] || "Let's start this amazing quiz! 🎯"
      setCurrentMessage(message)

      const animateWelcomeSequence = async () => {
        await controls.start({
          x: [-300, 0],
          y: [0, -10, 0],
          scale: [0.8, 1.1, 1],
          transition: { duration: 1.2, ease: "easeOut" },
        })

        setShowMessage(true)

        await controls.start({
          y: [0, -8, 0],
          transition: {
            duration: 1.5,
            repeat: 2,
            ease: "easeInOut",
          },
        })

        setTimeout(async () => {
          setShowMessage(false)
          await controls.start({
            x: [0, 400],
            y: [0, -20],
            scale: [1, 0.8],
            transition: { duration: 1, ease: "easeIn" },
          })
          onAnimationComplete?.()
        }, 2500)
      }

      animateWelcomeSequence()
    }
  }, [goalId, controls, eyeControls, onAnimationComplete, mode, score])

  if (mode === "welcome") {
    return (
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <motion.div animate={controls} className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <svg width="100" height="100" viewBox="0 0 120 120" className="drop-shadow-lg">
            <ellipse cx="60" cy="85" rx="22" ry="25" fill="#D2691E" />
            <circle cx="60" cy="50" r="20" fill="#DEB887" />
            <circle cx="47" cy="35" r="7" fill="#D2691E" />
            <circle cx="73" cy="35" r="7" fill="#D2691E" />
            <circle cx="47" cy="35" r="4" fill="#F5DEB3" />
            <circle cx="73" cy="35" r="4" fill="#F5DEB3" />
            <circle cx="54" cy="45" r="2.5" fill="#000" />
            <circle cx="66" cy="45" r="2.5" fill="#000" />
            <circle cx="54.5" cy="44" r="0.8" fill="#FFF" />
            <circle cx="66.5" cy="44" r="0.8" fill="#FFF" />
            <ellipse cx="60" cy="52" rx="1.5" ry="1" fill="#000" />
            <path d="M 58 55 Q 60 57 62 55" stroke="#000" strokeWidth="1" fill="none" />
            <ellipse cx="40" cy="70" rx="6" ry="12" fill="#D2691E" />
            <ellipse cx="80" cy="70" rx="6" ry="12" fill="#D2691E" />
            <ellipse cx="52" cy="100" rx="6" ry="10" fill="#D2691E" />
            <ellipse cx="68" cy="100" rx="6" ry="10" fill="#D2691E" />
            <ellipse cx="60" cy="80" rx="12" ry="15" fill="#F5DEB3" />
          </svg>

          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-xl px-4 py-2 shadow-lg border-2 border-teal-200 max-w-xs"
            >
              <div className="text-sm font-medium text-gray-800 text-center">{currentMessage}</div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white"></div>
            </motion.div>
          )}
        </motion.div>
      </div>
    )
  }

  return null
}

// 🧸 Cute Peeking Over Teddy (like first image - stays during quiz)
export const PeekingOverTeddy = ({ show }) => {
  const eyeControls = useAnimation()
  const headControls = useAnimation()
  const pawControls = useAnimation()
  const [isBlinking, setIsBlinking] = useState(false)

  // Natural blinking animation
  const startBlinking = () => {
    const blinkSequence = async () => {
      while (show) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 4000 + 3000))
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

  // Subtle head movement
  const startHeadMovement = () => {
    headControls.start({
      rotate: [0, 1, -1, 0],
      y: [0, -1, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })
  }

  // Subtle paw movement
  const startPawMovement = () => {
    pawControls.start({
      y: [0, -0.5, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 1,
      },
    })
  }

  useEffect(() => {
    if (show) {
      startBlinking()
      startHeadMovement()
      startPawMovement()
    }
  }, [show])

  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10"
    >
      <motion.div animate={headControls}>
        {/* Cute Cartoon Teddy Bear - Peeking Over Style */}
        <svg width="350" height="80" viewBox="0 0 120 80" className="drop-shadow-lg">
          {/* Quiz Card Edge Line */}
          <line x1="0" y1="65" x2="120" y2="65" stroke="#E5E7EB" strokeWidth="3" />

          {/* Bear Head */}
          <circle cx="60" cy="40" r="20" fill="#D2B48C" stroke="#CD853F" strokeWidth="1" />

          {/* Ears */}
          <circle cx="45" cy="25" r="8" fill="#CD853F" />
          <circle cx="75" cy="25" r="8" fill="#CD853F" />
          <circle cx="45" cy="25" r="5" fill="#F5DEB3" />
          <circle cx="75" cy="25" r="5" fill="#F5DEB3" />

          {/* Eyes with natural blinking */}
          <motion.g animate={eyeControls}>
            {!isBlinking ? (
              <>
                <circle cx="53" cy="37" r="3" fill="#000" />
                <circle cx="67" cy="37" r="3" fill="#000" />
                <circle cx="54" cy="35.5" r="1" fill="#FFF" />
                <circle cx="68" cy="35.5" r="1" fill="#FFF" />
              </>
            ) : (
              <>
                <path d="M 50 37 Q 53 35 56 37" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M 64 37 Q 67 35 70 37" stroke="#000" strokeWidth="2" fill="none" />
              </>
            )}
          </motion.g>

          {/* Cute rosy cheeks */}
          <circle cx="38" cy="42" r="3" fill="#FFB6C1" opacity="0.6" />
          <circle cx="82" cy="42" r="3" fill="#FFB6C1" opacity="0.6" />

          {/* Nose */}
          <ellipse cx="60" cy="45" rx="2" ry="1.5" fill="#8B4513" />

          {/* Happy mouth */}
          <path d="M 57 50 Q 60 53 63 50" stroke="#8B4513" strokeWidth="2" fill="none" />

          {/* Paws on the edge */}
          <motion.g animate={pawControls}>
            <ellipse cx="40" cy="62" rx="8" ry="6" fill="#CD853F" />
            <ellipse cx="80" cy="62" rx="8" ry="6" fill="#CD853F" />
            <ellipse cx="40" cy="62" rx="5" ry="4" fill="#F5DEB3" />
            <ellipse cx="80" cy="62" rx="5" ry="4" fill="#F5DEB3" />

            {/* Paw pads */}
            <circle cx="40" cy="60" r="1.5" fill="#8B4513" />
            <circle cx="80" cy="60" r="1.5" fill="#8B4513" />
          </motion.g>

          {/* Body hint (partially visible) */}
          <ellipse cx="60" cy="75" rx="15" ry="8" fill="#D2B48C" opacity="0.8" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

// 🎭 Shy Peeking Behind Teddy (like second image - appears after completion)
export const ShyPeekingTeddy = ({ goalId, score, show }) => {
  const controls = useAnimation()
  const eyeControls = useAnimation()
  const pawControls = useAnimation()
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)

  const completionMessages = {
    perfect: ["WOW! Perfect score! 🏆", "Amazing work! ⭐", "You're incredible! 🎉"],
    excellent: ["Great job! 🎯", "Well done! 👏", "Excellent! 🌟"],
    good: ["Good effort! 💪", "Keep learning! 📚", "You're improving! 🚀"],
  }

  const getCompletionMessage = (score) => {
    if (score === 5) {
      const messages = completionMessages.perfect
      return messages[Math.floor(Math.random() * messages.length)]
    } else if (score >= 4) {
      const messages = completionMessages.excellent
      return messages[Math.floor(Math.random() * messages.length)]
    } else {
      const messages = completionMessages.good
      return messages[Math.floor(Math.random() * messages.length)]
    }
  }

  const startBlinking = () => {
    const blinkSequence = async () => {
      let blinkCount = 0
      while (blinkCount < 8 && show) {
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1500))
        setIsBlinking(true)
        await eyeControls.start({
          scaleY: [1, 0.1, 1],
          transition: { duration: 0.2, ease: "easeInOut" },
        })
        setIsBlinking(false)
        blinkCount++
      }
    }
    blinkSequence()
  }

  const startSubtleWaving = () => {
    pawControls.start({
      rotate: [0, 15, -10, 15, 0],
      y: [0, -2, 0],
      transition: {
        duration: 2,
        repeat: 2,
        ease: "easeInOut",
        delay: 1,
      },
    })
  }

  useEffect(() => {
    if (show) {
      const message = getCompletionMessage(score)
      setCurrentMessage(message)

      const animateSequence = async () => {
        // Slide in shyly from right
        await controls.start({
          x: [80, 20],
          opacity: [0, 1],
          transition: { duration: 1, ease: "easeOut" },
        })

        setShowMessage(true)
        startBlinking()
        startSubtleWaving()

        // Gentle shy peeking movement
        controls.start({
          x: [20, 15, 20],
          y: [0, -2, 0],
          transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        })
      }

      animateSequence()
    }
  }, [show, score, controls, eyeControls, pawControls])

  if (!show) return null

  return (
    <motion.div animate={controls} className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
      {/* Shy Peeking Teddy - Behind Quiz Card */}
      <svg width="250" height="350" viewBox="0 20 100 120" className="drop-shadow-xl left-80">
        {/* Quiz Card Edge (like curtain) */}
        {/* <rect x="130" y="30" width="25" height="10" fill="#F3F4F6" opacity="0.8" /> */}

        {/* Bear Head - Peeking out shyly */}
        <circle cx="50" cy="45" r="18" fill="#D2B48C" stroke="#CD853F" strokeWidth="1" />

        {/* Ears */}
        <circle cx="38" cy="32" r="6" fill="#CD853F" />
        <circle cx="62" cy="32" r="6" fill="#CD853F" />
        <circle cx="38" cy="32" r="4" fill="#F5DEB3" />
        <circle cx="62" cy="32" r="4" fill="#F5DEB3" />

        {/* Eyes with shy blinking */}
        <motion.g animate={eyeControls}>
          {!isBlinking ? (
            <>
              <circle cx="44" cy="42" r="2.5" fill="#000" />
              <circle cx="56" cy="42" r="2.5" fill="#000" />
              <circle cx="44.5" cy="41" r="0.8" fill="#FFF" />
              <circle cx="56.5" cy="41" r="0.8" fill="#FFF" />
            </>
          ) : (
            <>
              <path d="M 41 42 Q 44 40 47 42" stroke="#000" strokeWidth="1.5" fill="none" />
              <path d="M 53 42 Q 56 40 59 42" stroke="#000" strokeWidth="1.5" fill="none" />
            </>
          )}
        </motion.g>

        {/* Extra rosy cheeks for shy expression */}
        <circle cx="32" cy="47" r="3" fill="#FFB6C1" opacity="0.8" />
        <circle cx="68" cy="47" r="3" fill="#FFB6C1" opacity="0.8" />

        {/* Nose */}
        <ellipse cx="50" cy="48" rx="1.5" ry="1.2" fill="#8B4513" />

        {/* Shy smile */}
        <path d="M 47 52 Q 50 55 53 52" stroke="#8B4513" strokeWidth="1.5" fill="none" />

        {/* Visible waving paw */}
        <motion.g animate={pawControls} style={{ transformOrigin: "30px 65px" }}>
          <ellipse cx="30" cy="65" rx="6" ry="8" fill="#CD853F" />
          <ellipse cx="30" cy="65" rx="4" ry="6" fill="#F5DEB3" />
          <circle cx="30" cy="63" r="1.5" fill="#8B4513" />
        </motion.g>

        {/* Body hint (mostly hidden) */}
        <ellipse cx="35" cy="195" rx="12" ry="15" fill="#D2B48C" opacity="0.6" />

        {/* Cute sparkles */}
        <motion.g
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <circle cx="75" cy="25" r="1" fill="#FFD700" />
          <circle cx="20" cy="35" r="0.8" fill="#FFD700" />
          <circle cx="80" cy="50" r="1.2" fill="#FFD700" />
        </motion.g>
      </svg>

      {/* Message Bubble - Positioned safely */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 15 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          className="absolute -top-20 -left-40 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl px-3 py-2 shadow-lg border-2 border-yellow-300 max-w-xs"
        >
          <div className="text-sm font-bold text-orange-800 text-center">{currentMessage}</div>
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-yellow-100"></div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Stats Teddy Face (unchanged)
export const StatsTeddyFace = ({ show, onComplete }) => {
  const controls = useAnimation()
  const eyeControls = useAnimation()
  const [isBlinking, setIsBlinking] = useState(false)

  useEffect(() => {
    if (show) {
      const animateSequence = async () => {
        await controls.start({
          scale: [0, 1.2, 1],
          opacity: [0, 1, 1],
          transition: { duration: 0.5, ease: "easeOut" },
        })

        for (let i = 0; i < 4; i++) {
          setIsBlinking(true)
          await eyeControls.start({
            scaleY: [1, 0.1, 1],
            transition: { duration: 0.15, ease: "easeInOut" },
          })
          setIsBlinking(false)
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        await new Promise((resolve) => setTimeout(resolve, 800))

        await controls.start({
          scale: [1, 0],
          opacity: [1, 0],
          transition: { duration: 0.3, ease: "easeIn" },
        })

        onComplete?.()
      }

      animateSequence()
    }
  }, [show, controls, eyeControls, onComplete])

  if (!show) return null

  return (
    <motion.div
      animate={controls}
      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-2xl border-3 border-teal-300">
        <svg width="60" height="60" viewBox="0 0 120 120" className="drop-shadow-lg">
          <circle cx="60" cy="60" r="30" fill="#D2B48C" />
          <circle cx="45" cy="40" r="8" fill="#CD853F" />
          <circle cx="75" cy="40" r="8" fill="#CD853F" />
          <circle cx="45" cy="40" r="5" fill="#F5DEB3" />
          <circle cx="75" cy="40" r="5" fill="#F5DEB3" />

          <motion.g animate={eyeControls}>
            {!isBlinking ? (
              <>
                <circle cx="52" cy="55" r="4" fill="#000" />
                <circle cx="68" cy="55" r="4" fill="#000" />
                <circle cx="53" cy="53" r="1.5" fill="#FFF" />
                <circle cx="69" cy="53" r="1.5" fill="#FFF" />
              </>
            ) : (
              <>
                <path d="M 48 55 Q 52 53 56 55" stroke="#000" strokeWidth="2" fill="none" />
                <path d="M 64 55 Q 68 53 72 55" stroke="#000" strokeWidth="2" fill="none" />
              </>
            )}
          </motion.g>

          <circle cx="35" cy="65" r="3" fill="#FFB6C1" opacity="0.7" />
          <circle cx="85" cy="65" r="3" fill="#FFB6C1" opacity="0.7" />
          <ellipse cx="60" cy="65" rx="2" ry="1.5" fill="#000" />
          <path d="M 55 72 Q 60 77 65 72" stroke="#000" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </motion.div>
  )
}

export default AnimatedTeddyBear