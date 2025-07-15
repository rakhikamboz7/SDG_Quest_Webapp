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
  const [isBlinking, setIsBlinking] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)

  // Color variables
  const colors = {
    furMain: "#795447",
    furLight: "#A1887F",
    furDark: "#3E2723",
    background: "#FBF190"
  }

  // Messages
  const messages = {
    welcome: "Let's learn about SDG Goal! 🎯",
    completion: {
      perfect: ["Perfect! You're amazing! 🏆", "Flawless victory! 🌟"],
      excellent: ["Great job! 🎯", "Well done! 👏"],
      good: ["Good effort! 💪", "Keep learning! 📚"]
    }
  }

  const getCompletionMessage = () => {
    if (score === 5) return messages.completion.perfect[Math.floor(Math.random() * messages.completion.perfect.length)]
    if (score >= 4) return messages.completion.excellent[Math.floor(Math.random() * messages.completion.excellent.length)]
    return messages.completion.good[Math.floor(Math.random() * messages.completion.good.length)]
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
    
    // Slide in from left
    await controls.start({
      x: [-300, 0],
      transition: { duration: 1.5, ease: "easeOut" }
    })
    
    // Wave hello with left arm
    setShowMessage(true)
    await leftArmControls.start({
      rotate: [0, -45, 20, -30, 0],
      transition: { duration: 1, repeat: 2, ease: "easeInOut" }
    })
    
    // Slide off screen
    await controls.start({
      x: [0, 300],
      transition: { duration: 1.5, ease: "easeIn" }
    })
    setShowMessage(false)
    onAnimationComplete?.()
  }

  // Peeking animation - diagonal tilt with one paw up (left side)
  const peekingAnimation = async () => {
    // Tilt to the left (15 degrees) and position partially hidden
    await controls.start({
      rotate: 15, // Opposite tilt direction
      y: 30,
      x: -40, // Position from left side
      transition: { duration: 0.5 }
    })
    
    // Lift left paw (since we're on left side now)
    await leftArmControls.start({
      y: -30,
      rotate: -20,
      transition: { duration: 0.3 }
    })
    
    // Head movements
    headControls.start({
      y: [0, -5, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
    
    // Ear wiggle
    earControls.start({
      rotate: [0, 10, -10, 0],
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    })
  }

  // Completion animation
  const completionAnimation = async () => {
    setCurrentMessage(getCompletionMessage())
    
    // Slide up from bottom left
    await controls.start({
      x: [-100, 0],
      y: [100, 0],
      opacity: [0, 1],
      rotate: 10, // Tilt to left
      transition: { duration: 0.8, ease: "easeOut" }
    })
    
    setShowMessage(true)
    
    // Celebrate with arm wave
    await leftArmControls.start({
      rotate: [0, -45, 20, -30, 0],
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
      className={`fixed z-50 ${
        mode === "peeking" ? "bottom-0 left-0" : // Changed to left side
        mode === "completion" ? "bottom-0 left-0" : 
        "bottom-0 left-0"
      }`}
      style={{ originX: 0.5, originY: 1 }}
    >
      {/* Teddy Bear */}
      <div className="relative w-72 h-72">
        {/* Body - partially hidden */}
        <div className="absolute left-1/2 top-1/2 w-44 h-36 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                        transform -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 w-36 h-28 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Feet - partially hidden */}
        <div className="absolute left-1/4 bottom-0 w-24 h-24 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                        transform -translate-x-1/2 opacity-70">
          <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute right-1/4 bottom-0 w-24 h-24 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                        transform translate-x-1/2 opacity-70">
          <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Arms */}
        <motion.div 
          animate={leftArmControls}
          className="absolute left-1/4 top-1/2 w-44 h-20 bg-[#795447] border-2 border-[#3E2723] 
                    rounded-[30%_50%_30%_50%] transform -translate-x-1/2 -translate-y-1/2 -rotate-45 origin-bottom"
        ></motion.div>
        
        <motion.div 
          animate={rightArmControls}
          className="absolute right-1/4 top-1/2 w-44 h-20 bg-[#795447] border-2 border-[#3E2723] 
                    rounded-[50%_50%_30%_50%] transform translate-x-1/2 -translate-y-1/2 rotate-45 origin-bottom opacity-70"
        ></motion.div>
        
        {/* Head */}
        <motion.div 
          animate={headControls}
          className="absolute left-1/2 top-1/4 w-36 h-36 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                    transform -translate-x-1/2 -translate-y-1/2"
        >
          {/* Snout */}
          <div className="absolute left-1/2 bottom-1/4 w-20 h-20 bg-[#A1887F] rounded-full transform -translate-x-1/2"></div>
          
          {/* Nose - updated to match reference image */}
          <div className="absolute left-1/2 bottom-1/3 w-14 h-10 bg-[#3E2723] rounded-full transform -translate-x-1/2"></div>
          
          {/* Mouth - updated to match reference image */}
          <div className="absolute left-1/2 bottom-1/4 w-10 h-4 bg-[#3E2723] rounded-full transform -translate-x-1/2"></div>
          
          {/* Eyes */}
          <motion.div 
            animate={eyeControls}
            className="absolute left-1/4 top-1/3 w-8 h-8 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"
          >
            {!isBlinking && (
              <div className="absolute right-1 bottom-1 w-3 h-3 bg-[#A1887F] rounded-full"></div>
            )}
          </motion.div>
          <motion.div 
            animate={eyeControls}
            className="absolute right-1/4 top-1/3 w-8 h-8 bg-black rounded-full transform translate-x-1/2 -translate-y-1/2"
          >
            {!isBlinking && (
              <div className="absolute right-1 bottom-1 w-3 h-3 bg-[#A1887F] rounded-full"></div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Ears - Positioned higher */}
        <motion.div 
          animate={earControls}
          className="absolute left-1/4 top-4 w-20 h-20 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                      transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
        <motion.div 
          animate={earControls}
          className="absolute right-1/4 top-4 w-20 h-20 bg-[#795447] rounded-full border-2 border-[#3E2723] 
                      transform translate-x-1/2 -translate-y-1/2"
        >
          <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-[#A1887F] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </motion.div>
      </div>
      
      {/* Message Bubble */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute bg-white rounded-xl px-4 py-2 shadow-lg border-2 border-teal-200 max-w-xs 
                     ${mode === "completion" ? "-top-24 right-0" : "-top-20 left-1/2 transform -translate-x-1/2"}`}
        >
          <div className="text-sm font-medium text-gray-800 text-center">{currentMessage}</div>
          <div className={`absolute w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white
                          ${mode === "completion" ? "top-full right-6" : "top-full left-1/2 transform -translate-x-1/2"}`}></div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default TeddyBear  