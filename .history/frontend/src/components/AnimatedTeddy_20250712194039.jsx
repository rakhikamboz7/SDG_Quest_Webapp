"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"

// 🎭 Shy Peeking Behind Teddy (appears after completion)
export const ShyPeekingTeddy = ({ goalId, score, show }) => {
  const controls = useAnimation()
  const armControls = useAnimation()
  const eyeControls = useAnimation()
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

  const startWavingAnimation = () => {
    armControls.start({
      rotate: [0, 20, -15, 20, 0],
      y: [0, -5, 0],
      transition: {
        duration: 1.5,
        repeat: 3,
        ease: "easeInOut"
      }
    })
  }

  useEffect(() => {
    if (show) {
      const message = getCompletionMessage(score)
      setCurrentMessage(message)

      const animateSequence = async () => {
        // Initial hidden position (behind card)
        await controls.start({
          x: 100,
          y: 40,
          opacity: 0,
          rotate: -15,
          transition: { duration: 0 }
        })

        // Peek out animation
        await controls.start({
          x: [100, 40],
          y: [40, 10],
          opacity: [0, 1],
          rotate: [-15, -5],
          transition: { 
            duration: 1, 
            ease: "easeOut",
          }
        })

        setShowMessage(true)
        startBlinking()
        startWavingAnimation()

        // Gentle shy peeking movement
        controls.start({
          x: [40, 35, 40],
          y: [10, 5, 10],
          rotate: [-5, -8, -5],
          transition: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }
        })
      }

      animateSequence()
    }
  }, [show, score, controls, armControls, eyeControls])

  if (!show) return null

  return (
    <motion.div 
      animate={controls}
      className="absolute right-0 bottom-0 z-10 origin-bottom-right"
      style={{ perspective: 1000 }}
    >
      {/* Shy Peeking Teddy - Behind Quiz Card */}
      <svg width="250" height="250" viewBox="0 0 450 600" className="drop-shadow-xl">
        {/* Quiz Card Edge Line (diagonal) */}
        <line 
          x1="350" y1="100" 
          x2="150" y2="500" 
          stroke="#E5E7EB" 
          strokeWidth="20" 
          strokeLinecap="round"
        />

        {/* Teddy Bear Body (mostly hidden) */}
        <g id="body">
          <path 
            d="M753.5,590.71c-6,98.78-40.34,112.4-142,112.29-77-.08-115.52-35.23-118-107.22-2.68-77.56,20.83-189.09,120-188.28C732.17,408.47,760.07,482.47,753.5,590.71Z" 
            transform="translate(-398.2 -208.03)" 
            fill="#df9146" 
            stroke="#65150a" 
            strokeLinecap="round" 
            strokeMiterlimit="10" 
            strokeWidth="5"
            opacity="0.8"
          />
        </g>

        {/* Head - Peeking out */}
        <g id="head">
          <path 
            id="face" 
            d="M620.7,243.76c-5.75-.09-71.56,0-106.73,55C495,328.26,483.39,376.16,507.15,414c29.72,47.31,93.5,44.89,115.76,44,23.84-.9,77.94-3,105-45.94,24.15-38.36,13.27-87.91-9-119.3C685.44,245.7,629.43,243.89,620.7,243.76Z" 
            transform="translate(-398.2 -208.03)" 
            fill="#df9146" 
            stroke="#65150a" 
            strokeLinecap="round" 
            strokeMiterlimit="10" 
            strokeWidth="5"
          />
          
          {/* Eyes with blinking */}
          <motion.g animate={eyeControls}>
            {!isBlinking ? (
              <>
                <ellipse 
                  cx="557.18" 
                  cy="329.47" 
                  rx="11.69" 
                  ry="13.03" 
                  transform="translate(-415.48 -176.89) rotate(-3.15)" 
                  fill="#65150a"
                />
                <ellipse 
                  cx="674.78" 
                  cy="329.77" 
                  rx="11.69" 
                  ry="13.03" 
                  transform="translate(-415.31 -170.42) rotate(-3.15)" 
                  fill="#65150a"
                />
              </>
            ) : (
              <>
                <path 
                  d="M548,330 Q 557 320 566 330" 
                  transform="translate(-415.48 -176.89) rotate(-3.15)"
                  stroke="#65150a" 
                  strokeWidth="3" 
                  fill="none"
                />
                <path 
                  d="M665,330 Q 674 320 683 330" 
                  transform="translate(-415.31 -170.42) rotate(-3.15)"
                  stroke="#65150a" 
                  strokeWidth="3" 
                  fill="none"
                />
              </>
            )}
          </motion.g>

          {/* Snout */}
          <path 
            d="M608,351.08c-25.32,1.63-56.64,19.09-58.07,44.08-1.28,22.29,21.94,38.07,25.73,40.64,21.52,14.63,53.59,16.56,76.16-.44,3-2.28,25.55-19.73,22.87-42.57C671.57,366.17,636.22,349.26,608,351.08Z" 
            transform="translate(-398.2 -208.03)" 
            fill="#f9cb73" 
            stroke="#754c24" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="3"
          />
          
          {/* Nose */}
          <ellipse 
            cx="611.33" 
            cy="384.5" 
            rx="17.6" 
            ry="11.81" 
            transform="translate(-418.42 -173.82) rotate(-3.15)" 
            fill="#65150a"
          />
          
          {/* Mouth */}
          <path 
            d="M639.79,407c-.62,7.39-12.16,13.83-26.64,14.63S586.5,417.32,585.07,410" 
            transform="translate(-398.2 -208.03)" 
            fill="none" 
            stroke="#65150a" 
            strokeLinecap="round" 
            strokeMiterlimit="10" 
            strokeWidth="5"
          />
        </g>

        {/* Right Arm - Waving */}
        <motion.g 
          id="right-arm"
          animate={armControls}
          transform="translate(-398.2 -208.03)"
          style={{ transformOrigin: '506px 621px' }}
        >
          <path 
            d="M506.59,621.87c13.55,3.64,33.15,1.85,40.3-9.43,6.78-10.68-6-19-6-45.45,0-13.72,2.57-43.73,6-59.16,2.51-11.29-3-30.24-13.72-34.3-6.12-2.33-12.36-3-18.35-1.44-9.67,2.59-15.65,10.31-20.23,17.73-11.43,18.51-41.49,67.23-18.86,106.32C478.21,600.44,487.67,616.78,506.59,621.87Z" 
            fill="#df9146" 
            stroke="#65150a" 
            strokeLinecap="round" 
            strokeMiterlimit="10" 
            strokeWidth="5"
          />
        </motion.g>
      </svg>

      {/* Message Bubble */}
      {showMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 40, y: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          className="absolute -top-24 left-0 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl px-4 py-2 shadow-lg border-2 border-yellow-300 max-w-xs"
        >
          <div className="text-sm font-bold text-orange-800 text-center">{currentMessage}</div>
          <div className="absolute top-full left-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-yellow-100"></div>
        </motion.div>
      )}
    </motion.div>
  )
}


