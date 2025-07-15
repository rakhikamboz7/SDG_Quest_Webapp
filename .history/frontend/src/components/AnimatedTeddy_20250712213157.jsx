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
    if (score >= 4) return messages.completion.excellent[Math.floor(Math.random() * messages.completion.excellent.length)]
    return messages.completion.good[Math.floor(Math.random() * messages.completion.good.length)]
  }

  const startBlinking = () => {
    const blink = async () => {
      while (show) {
        await new Promise((r) => setTimeout(r, Math.random() * 3000 + 2000))
        setIsBlinking(true)
        await eyeControls.start({
          scaleY: [1, 0.1, 1],
          transition: { duration: 0.2 },
        })
        setIsBlinking(false)
      }
    }
    blink()
  }

  const walkingAnimation = () => {
    leftLegControls.start({
      rotate: [0, 25, -25, 0],
      y: [0, -8, 8, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    })
    rightLegControls.start({
      rotate: [0, -25, 25, 0],
      y: [0, 8, -8, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
    })
    bodyControls.start({
      y: [0, -8, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
    })
    headControls.start({
      y: [0, -4, 0],
      transition: { duration: 0.4, repeat: Infinity, ease: "easeInOut" },
    })
    leftArmControls.start({
      rotate: [0, -20, 20, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" },
    })
    rightArmControls.start({
      rotate: [0, 20, -20, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
    })
  }

  const welcomeAnimation = async () => {
    setCurrentMessage(messages.welcome)
    walkingAnimation()
    await controls.start({ x: [-300, -50], transition: { duration: 2 } })
    leftLegControls.stop(); rightLegControls.stop(); bodyControls.stop(); headControls.stop(); leftArmControls.stop(); rightArmControls.stop()
    setShowMessage(true)
    await leftArmControls.start({
      rotate: [0, -60, 30, -45, 0],
      y: [0, -10, 0],
      transition: { duration: 1.2, repeat: 2, ease: "easeInOut" },
    })
    walkingAnimation()
    await controls.start({ x: [-50, 300], transition: { duration: 2 } })
    setShowMessage(false)
    onAnimationComplete?.()
  }

  const peekingAnimation = async () => {
    leftLegControls.stop(); rightLegControls.stop(); bodyControls.stop(); leftArmControls.stop(); rightArmControls.stop()
    await controls.start({ x: 0, y: 0, rotate: 0, transition: { duration: 0.5 } })
    headControls.start({ y: [0, -3, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } })
    earControls.start({ rotate: [0, 5, -5, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } })
    leftArmControls.start({ y: [0, -2, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } })
    rightArmControls.start({ y: [0, -2, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 } })
  }

  const completionAnimation = async () => {
    setCurrentMessage(getCompletionMessage())
    await controls.start({ x: 0, y: 30, rotate: 10, transition: { duration: 0.8 } })
    leftLegControls.start({
      y: [0, -10, 0],
      rotate: [-5, 10, -5],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    })
    rightArmControls.start({
      rotate: [0, 40, -20, 30, 0],
      y: [0, -15, 0],
      transition: { duration: 1.2, repeat: 2, ease: "easeInOut" },
    })
    headControls.start({ rotate: [0, 3, -3, 0], y: [0, -6, 0], transition: { duration: 3, repeat: Infinity } })
    setShowMessage(true)
    onAnimationComplete?.()
  }

  useEffect(() => {
    if (!show) return
    startBlinking()
    if (mode === "welcome") welcomeAnimation()
    else if (mode === "peeking") peekingAnimation()
    else if (mode === "completion") completionAnimation()
  }, [show, mode, score])

  if (!show) return null

  return (
    <motion.div
      animate={controls}
      className={`absolute z-30 ${mode === "peeking" ? "top-0 left-1/2 -translate-x-1/2" :
        mode === "completion" ? "bottom-0 right-0" : "bottom-0 left-0"
        }`}
      style={{ originX: 0.5, originY: 1 }}
    >
      <div className={`${mode === "peeking" ? "w-32 h-20 relative" : "w-40 h-40 relative"}`}>
        {/* Head */}
        <motion.div
          animate={headControls}
          className="absolute left-1/2 top-0 w-24 h-24 bg-[#D2691E] rounded-full border-2 border-[#8B4513] transform -translate-x-1/2"
        >
          {/* Ears */}
          <motion.div animate={earControls} className="absolute left-2 -top-2 w-8 h-8 bg-[#8B4513] rounded-full">
            <div className="absolute left-1/2 top-1/2 w-5 h-5 bg-[#CD853F] rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
          <motion.div animate={earControls} className="absolute right-2 -top-2 w-8 h-8 bg-[#8B4513] rounded-full">
            <div className="absolute left-1/2 top-1/2 w-5 h-5 bg-[#CD853F] rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </motion.div>

          {/* Eyes */}
          <motion.div animate={eyeControls} className="absolute left-1/4 top-1/3 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2">
            {!isBlinking && <div className="absolute right-0 bottom-0 w-1 h-1 bg-white rounded-full" />}
          </motion.div>
          <motion.div animate={eyeControls} className="absolute right-1/4 top-1/3 w-3 h-3 bg-black rounded-full translate-x-1/2 -translate-y-1/2">
            {!isBlinking && <div className="absolute right-0 bottom-0 w-1 h-1 bg-white rounded-full" />}
          </motion.div>

          {/* Nose */}
          <div className="absolute left-1/2 bottom-1/3 w-3 h-2 bg-[#8B4513] rounded-full transform -translate-x-1/2" />
          {/* Mouth */}
          <div className="absolute left-1/2 bottom-1/4 w-2 h-1 bg-[#8B4513] rounded-full transform -translate-x-1/2" />
        </motion.div>

        {/* Arms */}
        <motion.div animate={leftArmControls} className="absolute left-2 bottom-0 w-8 h-6 bg-[#D2691E] rounded-full border border-[#8B4513]" />
        <motion.div animate={rightArmControls} className="absolute right-2 bottom-0 w-8 h-6 bg-[#D2691E] rounded-full border border-[#8B4513]" />

        {/* Body (if not peeking) */}
        {mode !== "peeking" && (
          <motion.div
            animate={bodyControls}
            className="absolute left-1/2 top-1/2 w-28 h-24 bg-[#D2691E] rounded-full border-2 border-[#8B4513] transform -translate-x-1/2 -translate-y-1/2"
          >
            <div className="absolute left-1/2 top-1/2 w-20 h-16 bg-[#DEB887] rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </motion.div>
        )}

        {/* Legs */}
        {mode !== "peeking" && (
          <>
            <motion.div animate={leftLegControls} className="absolute left-1/3 bottom-2 w-12 h-12 bg-[#D2691E] rounded-full border-2 border-[#8B4513] transform -translate-x-1/2 origin-top" />
            <motion.div animate={rightLegControls} className="absolute right-1/3 bottom-2 w-12 h-12 bg-[#D2691E] rounded-full border-2 border-[#8B4513] transform translate-x-1/2 origin-top" />
          </>
        )}
      </div>

      {/* Message */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bg-white rounded-xl px-4 py-2 shadow-lg border-2 border-teal-200 text-sm font-medium max-w-xs
            ${mode === "completion" ? "-top-16 -left-24" : "-top-16 left-1/2 transform -translate-x-1/2"}`}
        >
          <div>{currentMessage}</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default TeddyBear
