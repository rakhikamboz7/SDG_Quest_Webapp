"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * EnhancedParticles component for celebration effects.
 */
const EnhancedParticles = ({ show, score, totalQuestions }) => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show && score >= 4) {
      // Create particles based on score
      const particleCount = score === 5 ? 30 : 20
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        emoji: getRandomEmoji(),
        initialX: Math.random() * window.innerWidth,
        initialY: Math.random() * window.innerHeight,
        delay: Math.random() * 2,
      }))
      setParticles(newParticles)
    }
  }, [show, score])

  const getRandomEmoji = () => {
    const emojis = ["🎉", "✨", "🎊", "💫", "🌟", "🎈", "🏆", "👏", "🥳", "🎯", "💚", "🌿", "🍃"]
    return emojis[Math.floor(Math.random() * emojis.length)]
  }

  const particleVariants = {
    initial: {
      opacity: 0,
      scale: 0,
      y: 0,
    },
    animate: {
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0.8],
      y: [-50, -100, -150, -200],
      x: [0, Math.random() * 100 - 50, Math.random() * 150 - 75],
      rotate: [0, 180, 360],
      transition: {
        duration: 3,
        ease: "easeOut",
        times: [0, 0.2, 0.8, 1],
      },
    },
  }

  const confettiVariants = {
    initial: {
      opacity: 0,
      scale: 0,
      y: -100,
    },
    animate: {
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1, 0.5],
      y: [0, 200, 400, 600],
      x: [0, Math.random() * 200 - 100],
      rotate: [0, Math.random() * 720],
      transition: {
        duration: 4,
        ease: "easeIn",
      },
    },
  }

  if (!show || score < 4) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-2xl"
            style={{
              left: particle.initialX,
              top: particle.initialY,
            }}
            variants={particleVariants}
            initial="initial"
            animate="animate"
            exit="initial"
            transition={{ delay: particle.delay }}
          >
            {particle.emoji}
          </motion.div>
        ))}

        {/* Perfect score celebration */}
        {score === 5 && (
          <>
            {/* Confetti rain */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute w-3 h-3 rounded"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: -20,
                  backgroundColor: ["#10B981", "#059669", "#047857", "#065F46"][Math.floor(Math.random() * 4)],
                }}
                variants={confettiVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.1 }}
              />
            ))}

            {/* Center burst effect */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2, 1.5, 0],
                opacity: [0, 1, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <div className="text-6xl">🏆</div>
            </motion.div>

            {/* Perfect score text */}
            <motion.div
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg">
                PERFECT SCORE! 🌟
              </div>
            </motion.div>
          </>
        )}

        {/* Great score celebration for 4/5 */}
        {score === 4 && (
          <motion.div
            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
              EXCELLENT! 🎯
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedParticles
