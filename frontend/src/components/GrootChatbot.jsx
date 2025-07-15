"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { MessageCircle, X, Send, HelpCircle } from "lucide-react"
import greenGroot from "../assets/green_groot.png"
import dryGroot from "../assets/dry_groot.png"

/**
 * @param {{
 *   isCorrect: boolean | null,
 *   showFeedback: boolean,
 *   currentQuestion: any,
 *   hasAnswered: boolean,
 *   onAnimationComplete?: () => void
 * }} props
 */
const GrootChatbot = ({
  isCorrect,
  showFeedback,
  currentQuestion,
  hasAnswered,
  onAnimationComplete,
}) => {
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

  const noAnswerMessages = [
    "I am Groot! 🤔 (Please answer the question first, then I can help!)",
    "I am Groot! 📝 (Choose an option first, then ask me for help!)",
    "I am Groot! 🎯 (Answer the question, then I'll explain!)",
    "I am Groot! 💭 (Select your answer first, then I can assist!)",
  ]

  useEffect(() => {
    if (showFeedback && isCorrect !== null) {
      const messages = isCorrect ? correctMessages : incorrectMessages
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(randomMessage)
      setShowMessage(true)

      // For incorrect answers, automatically offer help after a delay
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
              message: `💡 Explanation: ${currentQuestion.explanation}`,
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

  const handleGrootClick = () => {
    setIsChatOpen(true)

    // If user hasn't answered yet, show a message encouraging them to answer first
    if (!hasAnswered) {
      const noAnswerMessage = noAnswerMessages[Math.floor(Math.random() * noAnswerMessages.length)]
      setChatMessages((prev) => [
        ...prev,
        {
          type: "groot",
          message: noAnswerMessage,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    }
  }

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

      // Check if user hasn't answered the question yet
      if (!hasAnswered) {
        grootResponse = noAnswerMessages[Math.floor(Math.random() * noAnswerMessages.length)]
      } else {
        // Check if user is asking for help or hints
        const helpKeywords = ["help", "hint", "explain", "why", "how", "what", "doubt", "confused", "wrong", "answer"]
        const isAskingForHelp = helpKeywords.some((keyword) => userInput.toLowerCase().includes(keyword))

        if (isAskingForHelp) {
          if (currentQuestion?.explanation && currentQuestion.explanation !== "Explanation coming soon.") {
            const hintMessage = hintMessages[Math.floor(Math.random() * hintMessages.length)]
            grootResponse = `${hintMessage}\n\n💡 Explanation: ${currentQuestion.explanation}`
          } else {
            grootResponse = "I am Groot! 😔 (Sorry, no explanation available for this question yet.)"
          }
        } else if (userInput.toLowerCase().includes("thank")) {
          grootResponse = "I am Groot! 😊 (You're welcome! Keep learning!)"
        } else if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
          if (hasAnswered) {
            grootResponse = "I am Groot! 👋 (Hello! Ask me anything about this question!)"
          } else {
            grootResponse = "I am Groot! 👋 (Hello! Answer the question first, then I can help!)"
          }
        } else if (userInput.toLowerCase().includes("correct") || userInput.toLowerCase().includes("right")) {
          if (isCorrect === true) {
            grootResponse = "I am Groot! 🎉 (Yes! You got it right! Well done!)"
          } else if (isCorrect === false) {
            grootResponse = "I am Groot! 🤔 (Not quite right, but that's okay! Want me to explain?)"
          } else {
            grootResponse = "I am Groot! 📝 (Answer the question first, then I can tell you!)"
          }
        } else {
          // General responses based on whether they've answered
          if (hasAnswered) {
            const responses = [
              "I am Groot! 🤔 (That's an interesting question!)",
              "I am Groot! 📚 (Let me think about that...)",
              "I am Groot! 💭 (I'm here to help you learn!)",
              "I am Groot! 🌱 (Keep asking questions!)",
            ]
            grootResponse = responses[Math.floor(Math.random() * responses.length)]
          } else {
            grootResponse = noAnswerMessages[Math.floor(Math.random() * noAnswerMessages.length)]
          }
        }
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
      {/* Main Groot Character - Fully Clickable */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          className="relative cursor-pointer"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={handleGrootClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Groot Image - Larger Size, Natural Shape, Smart Image Logic */}
          <motion.div
            className="w-32 h-32 relative"
            animate={
              showFeedback
                ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, isCorrect ? 5 : -5, 0],
                  }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <img
              src={isCorrect === false ? dryGroot : greenGroot}
              alt={isCorrect === false ? "Sad Groot" : "Happy Groot"}
              className="w-full h-full object-contain drop-shadow-2xl"
            />

            {/* Chat Indicator */}
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-[#005a54] rounded-full flex items-center justify-center shadow-lg"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <MessageCircle className="w-3 h-3 text-white" />
            </motion.div>

            {/* Click Me Hint */}
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-[#005a54] text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
              animate={{
                opacity: [0.6, 1, 0.6],
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Click me for help! 💬
            </motion.div>
          </motion.div>

          {/* Floating Animation */}
          <motion.div
            className="absolute inset-0"
            animate={{
              y: [0, -12, 0],
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
              className="absolute bottom-full right-0 mb-4 max-w-sm"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div
                className={`px-5 py-4 rounded-2xl shadow-xl border-2 relative ${
                  isCorrect
                    ? "bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800"
                    : "bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 text-orange-800"
                }`}
              >
                <p className="text-base font-medium text-center">{currentMessage}</p>

                {/* Speech Bubble Tail - Properly Aligned */}
                <div
                  className={`absolute top-full right-6 w-0 h-0 border-l-6 border-r-6 border-t-8 border-l-transparent border-r-transparent ${
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
            className="fixed bottom-6 right-44 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#005a54] to-[#007a6b] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={greenGroot || "/placeholder.svg"} alt="Groot" className="w-10 h-10 object-contain" />
                <div>
                  <h3 className="font-bold text-base">Groot Helper</h3>
                  <p className="text-sm opacity-90">{hasAnswered ? "Ask me anything!" : "Answer first, then ask!"}</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-12">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium mb-2">Hi! I'm Groot! 🌱</p>
                  {hasAnswered ? (
                    <div>
                      <p>Ask me for hints or explanations!</p>
                      <p className="text-xs mt-2 text-gray-400">Try: "Can you explain?" or "I need help!"</p>
                    </div>
                  ) : (
                    <div>
                      <p>Answer the question first!</p>
                      <p className="text-xs mt-2 text-gray-400">Then I can help explain the answer 😊</p>
                    </div>
                  )}
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
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                      msg.type === "user"
                        ? "bg-[#005a54] text-white"
                        : "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {msg.type === "groot" && (
                      <div className="flex items-center space-x-2 mb-2">
                        <img src={greenGroot || "/placeholder.svg"} alt="Groot" className="w-5 h-5 object-contain" />
                        <span className="text-xs font-medium text-[#005a54]">Groot</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line leading-relaxed">{msg.message}</p>
                    <p className="text-xs opacity-60 mt-2">{msg.timestamp}</p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <img src={greenGroot || "/placeholder.svg"} alt="Groot" className="w-5 h-5 object-contain" />
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
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={hasAnswered ? "Ask Groot for help..." : "Answer the question first..."}
                  disabled={!hasAnswered}
                  className={`flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#005a54] focus:border-transparent ${
                    !hasAnswered ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
                  }`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim() || !hasAnswered}
                  className="p-3 bg-[#005a54] text-white rounded-full hover:bg-[#007a6b] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                {hasAnswered
                  ? 'Try asking: "Can you explain this?" or "Why is this the answer?"'
                  : "Please select an answer first, then I can help explain! 🌱"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default GrootChatbot
