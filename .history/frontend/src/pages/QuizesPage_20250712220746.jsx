"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import BadgesDisplay from "../components/BadgesDisplay"
import TeddyBear from "../components/AnimatedTeddy"
import EnhancedParticles from "../components/Particles"
import { motion, AnimatePresence } from "framer-motion"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL

function QuizPage() {
  const { goalId } = useParams()
  const navigate = useNavigate()
  const [quizScores, setQuizScores] = useState([])
  const [badgesEarned, setBadgesEarned] = useState([])
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [allQuizzes, setAllQuizzes] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [showEncouragingMessage, setShowEncouragingMessage] = useState(false)
  const [encouragingMessage, setEncouragingMessage] = useState("")

  // Teddy bear states
  const [showTeddyBear, setShowTeddyBear] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [showPeekingOver, setShowPeekingOver] = useState(false)
  const [showShyPeeking, setShowShyPeeking] = useState(false)

  useEffect(() => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setShowResult(false)
    setLoading(true)
    setShowEncouragingMessage(false)
    setEncouragingMessage("")
    setShowTeddyBear(true)
    setQuizStarted(false)
    setShowPeekingOver(false)
    setShowShyPeeking(false)
    fetchScores()
  }, [goalId])

  const assignBadges = (scores) => {
    const totalPoints = scores.reduce((acc, quiz) => acc + quiz.score, 0)
    const earnedBadges = []
    if (totalPoints >= 75) earnedBadges.push("Gold")
    if (totalPoints >= 30) earnedBadges.push("Silver")
    if (totalPoints >= 5) earnedBadges.push("Bronze")
    return earnedBadges
  }

  const fetchScores = async () => {
    try {
      const userId = localStorage.getItem("userId")
      const res = await axios.get(`${BACKEND_URL}/api/scores/${userId}`)
      const scores = res.data.userScores || []
      setQuizScores(scores)
      setBadgesEarned(assignBadges(scores))
    } catch (error) {
      console.error("Error fetching scores:", error)
    }
  }

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/quizzes`)
        setAllQuizzes(response.data)
        const foundQuiz = response.data.find((q) => String(q.goalId) === String(goalId))
        if (foundQuiz) {
          setQuiz(foundQuiz)
        } else {
          console.log("No quiz found for goalId:", goalId)
          setQuiz(null)
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [goalId])

  const handleTeddyAnimationComplete = () => {
    setShowTeddyBear(false)
    setQuizStarted(true)
    setTimeout(() => {
      setShowPeekingOver(true)
    }, 500)
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    if (option.isCorrect) {
      setScore((prevScore) => prevScore + 1)
    }
  }

  const handleNext = async () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      setShowPeekingOver(false)
      setShowResult(true)
      await saveScore(score)
    }
  }

  const getEncouragingMessage = (goalId, score, totalQuestions) => {
    const messages = [
      `You need to know more about Goal ${goalId}! Keep learning! 📚`,
      `Don't give up! Goal ${goalId} has so much to offer. Try again! 💪`,
      `Every expert was once a beginner. Keep exploring Goal ${goalId}! 🌱`,
      `Learning is a journey! Goal ${goalId} awaits your discovery! 🚀`,
      `You're on the right path! Dive deeper into Goal ${goalId}! 🎯`,
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  const saveScore = async (quizScore) => {
    try {
      const token = localStorage.getItem("token")
      const userId = localStorage.getItem("userId")
      const currentQuizIndex = allQuizzes.findIndex((q) => String(q.goalId) === String(goalId))

      if ((!token || !userId) && currentQuizIndex === 1) {
        setShowPopup(true)
        return
      }

      if (quizScore >= 4) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 5000)
        setTimeout(() => {
          setShowShyPeeking(true)
        }, 1500)
      } else {
        const message = getEncouragingMessage(goalId, quizScore, quiz.questions.length)
        setEncouragingMessage(message)
        setShowEncouragingMessage(true)
        setTimeout(() => setShowEncouragingMessage(false), 4000)
        setTimeout(() => {
          setShowShyPeeking(true)
        }, 2500)
      }

      const response = await axios.post(
        `${BACKEND_URL}/api/scores/submit`,
        {
          userId,
          goalId: goalId,
          quizId: quiz._id,
          score: quizScore,
          totalQuestions: quiz.questions.length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      console.log("Score saved successfully:", response.data)
      await fetchScores()
    } catch (error) {
      console.error("Error saving score:", error)
    }
  }

  const handleNextQuiz = () => {
    const currentQuizIndex = allQuizzes.findIndex((q) => String(q.goalId) === String(goalId))
    if (currentQuizIndex !== -1 && currentQuizIndex < allQuizzes.length - 1) {
      const nextQuiz = allQuizzes[currentQuizIndex + 1]
      navigate(`/quiz/${nextQuiz.goalId}`)
    } else {
      navigate("/")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-green-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-green-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <p className="text-xl text-gray-700 mb-4">No quiz found for this goal.</p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-teal-700 text-white px-6 py-3 rounded-lg hover:bg-teal-800 transition-colors"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  const messageVariants = {
    initial: { opacity: 0, scale: 0.5, y: 50 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: -50,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 relative overflow-hidden">
      {/* Welcome Teddy Bear */}
      <TeddyBear 
        show={showTeddyBear} 
        mode="welcome" 
        onAnimationComplete={handleTeddyAnimationComplete}
      />

      {/* Enhanced Particles */}
      <EnhancedParticles show={showCelebration} score={score} totalQuestions={quiz?.questions?.length || 5} />

      {/* Encouraging Message */}
      <AnimatePresence>
        {showEncouragingMessage && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-6 rounded-2xl shadow-2xl max-w-md mx-4 text-center border-4 border-white">
              <div className="text-4xl mb-3">💪</div>
              <p className="text-lg font-semibold leading-relaxed">{encouragingMessage}</p>
              <div className="mt-3 text-sm opacity-90">Keep going! You've got this! 🌟</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Quiz Content */}
      <motion.div
        className="p-4 md:p-6 lg:p-8 flex flex-col items-center pt-16 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: quizStarted ? 1 : 0.3, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Quiz Header */}
        <motion.div
          className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 mb-8 relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
            SDG Goal {goalId} Quiz
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              className="p-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl text-white shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm opacity-90">Total Points</p>
              <p className="text-3xl font-bold">{quizScores.reduce((acc, quiz) => acc + quiz.score, 0)}/85</p>
            </motion.div>
            <motion.div
              className="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-sm opacity-90">Completed Quizzes</p>
              <p className="text-3xl font-bold">{quizScores.length}/17</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Quiz Content */}
        {!showResult ? (
          <motion.div
            className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 relative overflow-visible"
            key={currentQuestion}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Peeking Teddy During Quiz */}
            <TeddyBear show={showPeekingOver} mode="peeking" />

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </span>
                <span>{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-teal-500 to-green-500 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-8 leading-relaxed">
              {quiz.questions[currentQuestion]?.question}
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {quiz.questions[currentQuestion]?.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  disabled={selectedOption !== null}
                  className={`w-full p-6 text-left rounded-2xl border-2 shadow-lg transition-all duration-300 font-medium ${
                    selectedOption === option
                      ? option.isCorrect
                        ? "bg-green-500 text-white border-green-500 shadow-green-200"
                        : "bg-red-500 text-white border-red-500 shadow-red-200"
                      : "bg-white border-gray-200 hover:border-teal-300 hover:shadow-teal-100"
                  }`}
                  whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold mr-4">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option.text}
                  </div>
                </motion.button>
              ))}
            </div>

            {selectedOption && (
              <motion.button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl font-bold text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {currentQuestion < quiz.questions.length - 1 ? "Next Question →" : "Complete Quiz 🎯"}
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 text-center relative overflow-visible"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Completion Teddy */}
            <TeddyBear show={showShyPeeking} mode="completion" score={score} />

            <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
                Quiz Complete! 
              </h2>
              <div className="text-6xl mb-6">{score === 5 ? "🏆" : score >= 4 ? "🎯" : "📚"}</div>
              <p className="text-2xl mb-8 text-gray-700">
                Your score: <span className="font-bold text-teal-600">{score}</span> out of {quiz.questions.length}
              </p>
            </motion.div>

            <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {score >= 4 ? (
                <div className="bg-gradient-to-r from-green-100 to-teal-100 border-2 border-green-300 text-green-800 px-6 py-4 rounded-2xl">
                  <div className="text-3xl mb-2">{score === 5 ? "🏆" : "🎯"}</div>
                  <p className="font-bold text-lg">{score === 5 ? "Perfect Score!" : "Excellent Work!"}</p>
                  <p className="text-sm mt-1">You have mastered Goal {goalId}!</p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 text-blue-800 px-6 py-4 rounded-2xl">
                  <div className="text-3xl mb-2">📚</div>
                  <p className="font-bold text-lg">Keep Learning!</p>
                  <p className="text-sm mt-1">There's more to discover about Goal {goalId}!</p>
                </div>
              )}
            </motion.div>

            <BadgesDisplay badgesEarned={badgesEarned} quizScores={quizScores} showProgress={true} />

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={handleNextQuiz}
                className="bg-gradient-to-r from-teal-600 to-green-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next Quiz →
              </motion.button>
              <motion.button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-2xl hover:shadow-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Sign-in Popup */}
      {showPopup && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold mb-4">Sign in to Continue</h2>
            <p className="text-gray-600 mb-6">You need to sign in to access more quizzes and track your progress.</p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/signin")}
                className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-2xl hover:bg-teal-700 font-bold"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-2xl hover:bg-gray-600 font-bold"
              >
                Go Home
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default QuizPage