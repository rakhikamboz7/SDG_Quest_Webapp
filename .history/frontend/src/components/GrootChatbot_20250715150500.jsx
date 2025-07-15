"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { MessageCircle, X, Send, HelpCircle } from "lucide-react"
import greenGroot from "../assets/green_groot.png"
import dryGroot from "../assets/dry_groot.png"

interface GrootChatbotProps {
  isCorrect: boolean | null
  showFeedback: boolean
  currentQuestion: any
  onAnimationComplete?: () => void
}

const GrootChatbot = ({ isCorrect, showFeedback, currentQuestion, onAnimationComplete }: GrootChatbotProps) => {
  const [currentMessage, setCurrentMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [userInput, setUserInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const correctMessages = [
    "I am Groot! 🌱 (Great job!)",
    "I am Groot! ✨ (Excellent!)",
    "I am Groot! 🎯 (Perfect!)",
    "I am Groot! 🌟 (Amazing!)",
    "I am Groot! 💚 (Well done!)",
  ]

  const incorrectMessages = [
    "I am Groot... 🤔 (Need a hint?)",
    "I am Groot... 💭 (Let me help!)",
    "I am Groot... 📚 (Want to learn more?)",
    "I am Groot... 🌿 (I can explain!)",
    "I am Groot... 💡 (Ask me for help!)",
  ]

  const hintMessages = [
    "I am Groot! 🌱 (Here's a hint...)",
    "I am Groot! 💡 (Let me explain...)",
    "I am Groot! 📚 (Think about this...)",
    "I am Groot! 🤔 (Consider this...)",
  ]

  useEffect(() => {
    if (showFeedback && isCorrect !== null) {
      const messages = isCorrect ? correctMessages : incorrectMessages
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(randomMessage)
      setShowMessage(true)

      // For incorrect answers, automatically offer help
      if (!isCorrect && currentQuestion?.explanation && currentQuestion.explanation !== "Explanation coming soon.") {
        setTimeout(() => {
          const hintMessage = hintMessages[Math.floor(Math.random() * hintMessages.length)]
          setChatMessages((prev) => [
            ...prev,
            {
              type: "groot",
              message: hintMessage,
              timestamp: new Date().toLocaleTimeString(),
            },
            {
              type: "groot",
              message: `💡 Hint: ${currentQuestion.explanation}`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ])
          setIsChatOpen(true)
        }, 2000)
      }

      // Hide message after 3 seconds
      const timer = setTimeout(() => {
        setShowMessage(false)
        onAnimationComplete?.()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showFeedback, isCorrect, currentQuestion])

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    // Add user message
    setChatMessages((prev) => [
      ...prev,
      {
        type: "user",
        message: userInput,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])

    setIsTyping(true)

    // Simulate Groot thinking and responding
    setTimeout(() => {
      let grootResponse = "I am Groot! 🌱 (I understand your question!)"

      // Check if user is asking for help or hints
      const helpKeywords = ["help", "hint", "explain", "why", "how", "what", "doubt", "confused"]
      const isAskingForHelp = helpKeywords.some((keyword) => userInput.toLowerCase().includes(keyword))

      if (
        isAskingForHelp &&
        currentQuestion?.explanation &&
        currentQuestion.explanation !== "Explanation coming soon."
      ) {
        grootResponse = `I am Groot! 💡 (Let me help!) \n\n${currentQuestion.explanation}`
      } else if (userInput.toLowerCase().includes("thank")) {
        grootResponse = "I am Groot! 😊 (You're welcome!)"
      } else if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
        grootResponse = "I am Groot! 👋 (Hello there! Ask me anything about this question!)"
      } else {
        // General responses
        const responses = [
          "I am Groot! 🤔 (That's an interesting question!)",
          "I am Groot! 📚 (Let me think about that...)",
          "I am Groot! 💭 (I'm here to help you learn!)",
          "I am Groot! 🌱 (Keep asking questions!)",
        ]
        grootResponse = responses[Math.floor(Math.random() * responses.length)]
      }

      setChatMessages((prev) => [
        ...prev,
        {
          type: "groot",
          message: grootResponse,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
      setIsTyping(false)
    }, 1500)

    setUserInput("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Main Groot Character */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Groot Image - No Circle, Natural Shape */}
          <motion.div
            className="w-20 h-20 relative cursor-pointer"
            animate={
              showFeedback
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, isCorrect ? 5 : -5, 0],
                  }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={() => setIsChatOpen(true)}
          >
            <img
              src={isCorrect ? greenGroot : dryGroot}
              alt={isCorrect ? "Happy Groot" : "Sad Groot"}
              className="w-full h-full object-contain drop-shadow-lg"
            />

            {/* Chat Indicator */}
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              onClick={(e) => {
                e.stopPropagation()
                setIsChatOpen(true)
              }}
            >
              <MessageCircle className="w-2 h-2 text-white" />
            </motion.div>
          </motion.div>

          {/* Floating Animation */}
          <motion.div
            className="absolute inset-0"
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Quick Feedback Message - Better Aligned */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              className="absolute bottom-full right-0 mb-3 max-w-xs"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                className={`px-4 py-3 rounded-2xl shadow-lg border-2 relative ${
                  isCorrect
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800"
                    : "bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 text-orange-800"
                }`}
              >
                <p className="text-sm font-medium text-center whitespace-nowrap">{currentMessage}</p>

                {/* Speech Bubble Tail - Properly Aligned */}
                <div
                  className={`absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent ${
                    isCorrect ? "border-t-green-100" : "border-t-orange-100"
                  }`}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed bottom-6 right-28 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={greenGroot || "/placeholder.svg"} alt="Groot" className="w-8 h-8 object-contain" />
                <div>
                  <h3 className="font-bold text-sm">Groot Helper</h3>
                  <p className="text-xs opacity-90">Ask me anything!</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Hi! I'm Groot! 🌱</p>
                  <p>Ask me for hints or explanations!</p>
                </div>
              )}

              {chatMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {msg.type === "groot" && (
                      <div className="flex items-center space-x-2 mb-1">
                        <img src={greenGroot || "/placeholder.svg"} alt="Groot" className="w-4 h-4 object-contain" />
                        <span className="text-xs font-medium text-green-600">Groot</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line">{msg.message}</p>
                    <p className="text-xs opacity-60 mt-1">{msg.timestamp}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-gray-100 px-3 py-2 rounded-2xl border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <img src={greenGroot || "/placeholder.svg"} alt="Groot" className="w-4 h-4 object-contain" />
                      <div className="flex space-x-1">
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-gray-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Groot for help..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Try asking: "Can you explain this?" or "I need a hint!"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GrootChatbot
