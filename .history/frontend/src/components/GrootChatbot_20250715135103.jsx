"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import greenGroot from "../assets/green_groot.png"
import dryGroot from "../assets/dry_groot.png"

/**
 * GrootChatbot component.
 */
const GrootChatbot = ({ isCorrect, showFeedback, onAnimationComplete }) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  const correctMessages = [
    "I am Groot! 🌱 (Great job!)",
    "I am Groot! ✨ (Excellent!)",
    "I am Groot! 🎯 (Perfect!)",
    "I am Groot! 🌟 (Amazing!)",
    "I am Groot! 💚 (Well done!)",
  ]

  const incorrectMessages = [
    "I am Groot... 🍂 (Try again!)",
    "I am Groot... 😔 (Keep learning!)",
    "I am Groot... 🤔 (Almost there!)",
    "I am Groot... 💭 (Think again!)",
    "I am Groot... 📚 (Study more!)",
  ]

  useEffect(() => {
    if (showFeedback && isCorrect !== null) {
      const messages = isCorrect ? correctMessages : incorrectMessages
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(randomMessage)
      setShowMessage(true)

      // Hide message after 3 seconds
      const timer = setTimeout(() => {
        setShowMessage(false)
        onAnimationComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showFeedback, isCorrect])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Groot Character */}
      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Groot Image Container */}
        <motion.div
          className="w-24 h-24 rounded-full overflow-hidden shadow-2xl border-4 border-white bg-white"
          animate={
            showFeedback
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, isCorrect ? 10 : -10, 0],
                }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <img
            src={isCorrect ? greenGroot : dryGroot}
            alt={isCorrect ? "Happy Groot" : "Sad Groot"}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Floating Animation */}
        <motion.div
          className="absolute inset-0"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Glow Effect */}
        <motion.div
          className={`absolute inset-0 rounded-full blur-xl opacity-30 ${isCorrect ? "bg-green-400" : "bg-orange-400"}`}
          animate={
            showFeedback
              ? {
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }
              : {}
          }
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* Sparkles for Correct Answer */}
        {showFeedback && isCorrect && (
          <>
            <motion.div
              className="absolute -top-2 -left-2 text-2xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.2 }}
            >
              ✨
            </motion.div>
            <motion.div
              className="absolute -top-1 -right-3 text-xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.4 }}
            >
              🌟
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -right-1 text-lg"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.6 }}
            >
              💚
            </motion.div>
          </>
        )}

        {/* Wilted Leaves for Incorrect Answer */}
        {showFeedback && !isCorrect && (
          <>
            <motion.div
              className="absolute -top-1 -left-1 text-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2 }}
            >
              🍂
            </motion.div>
            <motion.div
              className="absolute -bottom-1 -right-2 text-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.4 }}
            >
              🍃
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Message Bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="absolute bottom-full right-0 mb-4 max-w-xs"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-lg border-2 ${
                isCorrect
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800"
                  : "bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 text-orange-800"
              }`}
            >
              <p className="text-sm font-medium text-center">{currentMessage}</p>

              {/* Speech Bubble Tail */}
              <div
                className={`absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent ${
                  isCorrect ? "border-t-green-100" : "border-t-orange-100"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle Animation Indicator */}
      {!showFeedback && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  )
}

export default GrootChatbot
