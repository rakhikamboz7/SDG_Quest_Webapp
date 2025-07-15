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

  const colors = {
    furMain: "#D2691E",
    furLight: "#DEB887",
    furDark: "#8B4513",
    earInner: "#CD853F",
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

  const walkingAnimation = () => {
    leftLegControls.start({
      rotate: [0, 25, -25, 0],
      y: [0, -8, 8, 0],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    rightLegControls.start({
      rotate: [0, -25, 25, 0],
      y: [0, 8, -8, 0],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 0.3,
      },
    })

    bodyControls.start({
      y: [0, -12, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 0.3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    headControls.start({
      y: [0, -5, 0],
      rotate: [0, 3, -3, 0],
      transition: {
        duration: 0.3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    leftArmControls.start({
      rotate: [0, -20, 20, 0],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    rightArmControls.start({
      rotate: [0, 20, -20, 0],
      transition: {
        duration: 0.6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 0.3,
      },
    })
  }

  const welcomeAnimation = async () => {
    setCurrentMessage(messages.welcome)
    walkingAnimation()

    await controls.start({
      x: [-300, -50],
      transition: { duration: 2, ease: "easeOut" },
    })

    leftLegControls.stop()
    rightLegControls.stop()
    bodyControls.stop()
    headControls.stop()
    leftArmControls.stop()
    rightArmControls.stop()

    setShowMessage(true)

    await leftArmControls.start({
      rotate: [0, -60, 30, -45, 0],
      y: [0, -10, 0],
      transition: { duration: 1.2, repeat: 2, ease: "easeInOut" },
    })

    walkingAnimation()

    await controls.start({
      x: [-50, 300],
      transition: { duration: 2, ease: "easeIn" },
    })

    setShowMessage(false)
    onAnimationComplete?.()
  }

  const peekingAnimation = async () => {
    leftLegControls.stop()
    rightLegControls.stop()
    bodyControls.stop()
    leftArmControls.stop()
    rightArmControls.stop()

    await controls.start({
      x: 0,
      y: 0,
      rotate: 0,
      transition: { duration: 0.5 },
    })

    headControls.start({
      y: [0, -3, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    earControls.start({
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    leftArmControls.start({
      y: [0, -2, 0],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    })

    rightArmControls.start({
      y: [0, -2, 0],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 2.5,
      },
    })
  }

  const completionAnimation = async () => {
    setCurrentMessage(getCompletionMessage());

    leftLegControls.stop();
    rightLegControls.stop();
    bodyControls.stop();
    headControls.stop();
    leftArmControls.stop();
    rightArmControls.stop();

    await controls.start({
      x: 0,
      y: 20,
      rotate: 10,
      transition: { duration: 0.8, ease: "easeOut" },
    });

    leftLegControls.start({
      y: [0, -10, 0],
      rotate: [-5, 10, -5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    rightArmControls.start({
      rotate: [0, 40, -20, 30, 0],
      y: [0, -15, 0],
      transition: { duration: 1.2, repeat: 2, ease: "easeInOut" },
    });

    headControls.start({
      rotate: [0, 3, -3, 0],
      y: [0, -6, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });

    setShowMessage(true);
    onAnimationComplete?.();
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

  return null; // your original render logic follows here (omitted for brevity)
}

export default TeddyBear
