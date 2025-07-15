"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import BadgesDisplay from "../components/BadgesDisplay"
import TeddyBear from "../components/AnimatedTeddy"
import EnhancedParticles from "../components/Particles"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Trophy, Target, BookOpen, Award, ChevronRight, CheckCircle2 } from "lucide-react"

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
      `Explore more about SDG ${goalId}! Knowledge is power! 📚`,
      `Great start! Dive deeper into Goal ${goalId} for mastery! 💪`,
      `Every expert was once a beginner. Keep learning about Goal ${goalId}! 🌱`,
      `Your journey with Goal ${goalId} is just beginning! 🚀`,
      `Build your expertise in Goal ${goalId} step by step! 🎯`,
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

  const handleShare = () => {
    const totalPoints = quizScores.reduce((acc, quiz) => acc + quiz.score, 0)
    const shareText = `🎯 I've earned ${totalPoints}/85 points in SDG Quest! Join me in learning about Sustainable Development Goals! 🌍✨`

    if (navigator.share) {
      navigator.share({
        title: "SDG Quest Achievement",
        text: shareText,
        url: window.location.origin,
      })
    } else {
      navigator.clipboard.writeText(shareText + ` ${window.location.origin}`)
      alert("Achievement copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600 font-medium">Loading your quiz...</p>
        </motion.div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-xl text-slate-700 mb-4">Quiz not available for this goal.</p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Return to Dashboard
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

  const totalPoints = quizScores.reduce((acc, quiz) => acc + quiz.score, 0)
  const completedQuizzes = quizScores.length
  const progressPercentage = Math.round((completedQuizzes / 17) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Welcome Teddy Bear */}
      <TeddyBear show={showTeddyBear} mode="welcome" onAnimationComplete={handleTeddyAnimationComplete} />

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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 rounded-2xl shadow-2xl max-w-md mx-4 text-center border border-blue-300">
              <div className="text-4xl mb-3">💪</div>
              <p className="text-lg font-semibold leading-relaxed">{encouragingMessage}</p>
              <div className="mt-3 text-sm opacity-90">Continue your learning journey! 🌟</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {goalId}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">SDG Goal {goalId} Assessment</h1>
                <p className="text-slate-600 text-sm">Professional Knowledge Evaluation</p>
              </div>
            </div>

            {/* Compact Stats */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg">
                <Trophy className="w-4 h-4" />
                <span className="font-semibold">{totalPoints}/85</span>
                <button onClick={handleShare} className="ml-1 hover:scale-110 transition-transform">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg">
                <Target className="w-4 h-4" />
                <span className="font-semibold">{completedQuizzes}/17</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Progress</div>
                <div className="font-bold text-slate-800">{progressPercentage}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-4xl mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: quizStarted ? 1 : 0.3, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {!showResult ? (
          <div className="relative">
            {/* Quiz Card */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative"
              key={currentQuestion}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Peeking Teddy Above Quiz Card */}
              <TeddyBear show={showPeekingOver} mode="peeking" />

              {/* Professional Progress Header */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Question {currentQuestion + 1}</h2>
                      <p className="text-slate-300 text-sm">of {quiz.questions.length} questions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%
                    </div>
                    <div className="text-slate-300 text-sm">Complete</div>
                  </div>
                </div>

                {/* Elegant Progress Bar */}
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question Content */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-800 text-center mb-8 leading-relaxed">
                  {quiz.questions[currentQuestion]?.question}
                </h3>

                <div className="grid grid-cols-1 gap-4 mb-8">
                  {quiz.questions[currentQuestion]?.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null}
                      className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 font-medium ${
                        selectedOption === option
                          ? option.isCorrect
                            ? "bg-emerald-50 text-emerald-800 border-emerald-500 shadow-emerald-200"
                            : "bg-red-50 text-red-800 border-red-500 shadow-red-200"
                          : "bg-slate-50 border-slate-200 hover:border-blue-300 hover:shadow-lg hover:bg-blue-50"
                      }`}
                      whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                            selectedOption === option
                              ? option.isCorrect
                                ? "bg-emerald-500 text-white"
                                : "bg-red-500 text-white"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-lg">{option.text}</span>
                        {selectedOption === option && option.isCorrect && (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 ml-auto" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {selectedOption && (
                  <motion.button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl font-bold text-lg flex items-center justify-center space-x-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Complete Assessment"}</span>
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center relative overflow-visible"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Completion Teddy */}
            <TeddyBear show={showShyPeeking} mode="completion" score={score} />

            <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl font-bold mb-4 text-slate-800">Assessment Complete</h2>

              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="text-5xl mb-4">{score === 5 ? "🏆" : score >= 4 ? "🎯" : "📚"}</div>
                <p className="text-2xl mb-2 text-slate-700">
                  Score: <span className="font-bold text-blue-600">{score}</span> out of {quiz.questions.length}
                </p>
                <div className="text-lg text-slate-600">
                  {score === 5 && "Outstanding! Perfect mastery demonstrated."}
                  {score === 4 && "Excellent! Strong understanding achieved."}
                  {score === 3 && "Good! Solid foundation established."}
                  {score < 3 && "Keep learning! Great potential ahead."}
                </div>
              </div>
            </motion.div>

            <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {score >= 4 ? (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 text-emerald-800 px-6 py-4 rounded-xl">
                  <div className="text-2xl mb-2">{score === 5 ? "🏆" : "🎯"}</div>
                  <p className="font-bold text-lg">{score === 5 ? "Mastery Achieved!" : "Proficiency Demonstrated!"}</p>
                  <p className="text-sm mt-1">You have excellent knowledge of SDG Goal {goalId}</p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-800 px-6 py-4 rounded-xl">
                  <div className="text-2xl mb-2">📚</div>
                  <p className="font-bold text-lg">Continue Learning!</p>
                  <p className="text-sm mt-1">Expand your expertise in SDG Goal {goalId}</p>
                </div>
              )}
            </motion.div>

            <BadgesDisplay badgesEarned={badgesEarned} quizScores={quizScores} showProgress={true} />

            <motion.div
              className="mt-6 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={handleNextQuiz}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg font-bold flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Next Assessment</span>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-8 py-3 rounded-xl hover:shadow-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dashboard
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
            className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4 border border-slate-200"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Continue Your Learning</h2>
            <p className="text-slate-600 mb-6">
              Sign in to access more assessments and track your progress professionally.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/signin")}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 font-bold"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-slate-500 text-white px-6 py-3 rounded-xl hover:bg-slate-600 font-bold"
              >
                Dashboard
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default QuizPage
