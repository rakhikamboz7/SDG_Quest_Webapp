"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

const TeddyBear = ({ show, mode = "peeking", score }) => {
  const controls = useAnimation()
  const leftArmControls = useAnimation()
  const rightArmControls = useAnimation()
  const headControls = useAnimation()
  const eyeControls = useAnimation()
  const [isBlinking, setIsBlinking] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  // Color variables from your CSS
  const colors = {
    furMain: "#795447",
    furLight: "#A1887F",
    furDark: "#3E2723",
    background: "#FBF190"
  }

  // Messages for different modes
  const messages = {
    welcome: "Let's learn about SDG Goal! 🎯",
    completion: {
      perfect: ["Perfect! You're amazing! 🏆", "Flawless victory! 🌟", "100%! You're a star! ⭐"],
      excellent: ["Great job! 🎯", "Well done! 👏", "Excellent work! 🌟"],
      good: ["Good effort! 💪", "Keep learning! 📚", "Nice try! 🚀"]
    }
  }

  const getCompletionMessage = () => {
    if (score === 5) {
      return messages.completion.perfect[Math.floor(Math.random() * messages.completion.perfect.length)]
    } else if (score >= 4) {
      return messages.completion.excellent[Math.floor(Math.random() * messages.completion.excellent.length)]
    } else {
      return messages.completion.good[Math.floor(Math.random() * messages.completion.good.length)]
    }
  }

  // Natural blinking animation
  const startBlinking = () => {
    const blinkSequence = async () => {
      while (show) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000))
        setIsBlinking(true)
        await eyeControls.start({
          scaleY: [1, 0.05, 1],
          transition: { duration: 0.2, ease: "easeInOut" }
        })
        setIsBlinking(false)
      }
    }
    blinkSequence()
  }

  // Welcome animation sequence
  const welcomeAnimation = async () => {
    setCurrentMessage(messages.welcome)
    
    // Enter from left side walking
    await controls.start({
      x: [-300, 0],
      transition: { duration: 1.5, ease: "easeOut" }
    })
    
    // Wave hello
    setShowMessage(true)
    await rightArmControls.start({
      rotate: [0, 20, -15, 20, 0],
      transition: { duration: 1, repeat: 2, ease: "easeInOut" }
    })
    
    // Walk off screen
    await controls.start({
      x: [0, 300],
      transition: { duration: 1.5, ease: "easeIn" }
    })
    setShowMessage(false)
  }

  // Peeking animation
  const peekingAnimation = async () => {
    await controls.start({
      y: [100, 0],
      opacity: [0, 1],
      transition: { duration: 0.8, ease: "easeOut" }
    })
    
    // Subtle head movements while peeking
    headControls.start({
      y: [0, -5, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  }

  // Completion animation
  const completionAnimation = async () => {
    setCurrentMessage(getCompletionMessage())
    
    // Peek up from bottom
    await controls.start({
      y: [100, 0],
      opacity: [0, 1],
      transition: { duration: 0.8, ease: "easeOut" }
    })
    
    setShowMessage(true)
    
    // Celebrate with arm wave
    await rightArmControls.start({
      rotate: [0, 20, -15, 20, 0],
      y: [0, -10, 0],
      transition: { duration: 0.8, repeat: 3, ease: "easeInOut" }
    })
    
    // Happy head bounce
    await headControls.start({
      y: [0, -10, 0],
      transition: { duration: 0.5, repeat: 2, ease: "easeOut" }
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
      className={`fixed z-50 ${mode === "peeking" ? "bottom-0 left-1/2 transform -translate-x-1/2" : 
                  mode === "completion" ? "bottom-0 right-0" : "bottom-0 left-0"}`}
    >
      {/* Teddy Bear */}
      <div className="relative w-64 h-64">
        {/* Body */}
        <div className="absolute left-1/2 top-1/2 w-40 h-32 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                        transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 w-32 h-24 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Feet */}
        <div className="absolute left-1/4 bottom-0 w-20 h-20 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                        transform -translate-x-1/2">
          <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute right-1/4 bottom-0 w-20 h-20 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                        transform translate-x-1/2">
          <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Arms */}
        <motion.div 
          animate={leftArmControls}
          className="absolute left-1/4 top-1/2 w-40 h-16 bg-[#795447] border-2 border-[#3E2723] 
                    rounded-[30%_50%_30%_50%] transform -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-bottom"
        ></motion.div>
        
        <motion.div 
          animate={rightArmControls}
          className="absolute right-1/4 top-1/2 w-40 h-16 bg-[#795447] border-2 border-[#3E2723] 
                    rounded-[50%_50%_30%_50%] transform translate-x-1/2 -translate-y-1/2 rotate-45 origin-bottom"
        ></motion.div>
        
        {/* Head */}
        <motion.div 
          animate={headControls}
          className="absolute left-1/2 top-1/4 w-32 h-32 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                    transform -translate-x-1/2 -translate-y-1/2"
        >
          {/* Snout */}
          <div className="absolute left-1/2 bottom-1/4 w-16 h-16 bg-[#A1887F] rounded-full transform -translate-x-1/2"></div>
          
          {/* Nose */}
          <div className="absolute left-1/2 bottom-1/3 w-10 h-8 bg-[#3E2723] clip-path-polygon transform -translate-x-1/2 
                          rounded-[40%]"></div>
          
          {/* Eyes */}
          <div className="absolute left-1/4 top-1/3 w-6 h-6 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2">
            {!isBlinking && (
              <div className="absolute right-1 bottom-1 w-2 h-2 bg-[#A1887F] rounded-full"></div>
            )}
          </div>
          <div className="absolute right-1/4 top-1/3 w-6 h-6 bg-black rounded-full transform translate-x-1/2 -translate-y-1/2">
            {!isBlinking && (
              <div className="absolute right-1 bottom-1 w-2 h-2 bg-[#A1887F] rounded-full"></div>
            )}
          </div>
          
          {/* Mouth */}
          <div className="absolute left-1/2 bottom-1/4 w-4 h-4 border-l-2 border-t-2 border-[#3E2723] 
                          transform -translate-x-1/2 rotate-45"></div>
        </motion.div>
        
        {/* Ears */}
        <div className="absolute left-1/4 top-1/10  w-16 h-16 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                        transform -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute right-1/4 top-1/4 w-16 h-16 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                        transform translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 w-10 h-10 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
      
      {/* Message Bubble */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bg-white rounded-xl px-4 py-2 shadow-lg border-2 border-teal-200 max-w-xs 
                     ${mode === "completion" ? "-top-24 left-0" : "-top-20 left-1/2 transform -translate-x-1/2"}`}
        >
          <div className="text-sm font-medium text-gray-800 text-center">{currentMessage}</div>
          <div className={`absolute w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white
                          ${mode === "completion" ? "top-full left-6" : "top-full left-1/2 transform -translate-x-1/2"}`}></div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TeddyBear