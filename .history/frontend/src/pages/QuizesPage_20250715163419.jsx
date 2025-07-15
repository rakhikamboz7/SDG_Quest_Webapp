"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import BadgesDisplay from "../components/BadgesDisplay"
import EnhancedParticles from "../components/Particles"
import GrootChatbot from "../components/GrootChatbot"
import { motion, AnimatePresence } from "framer-motion"
import {
  Target,
  BookOpen,
  Award,
  ChevronRight,
  CheckCircle2,
  Search,
  Bell,
  ChevronUp,
  ChevronDown,
  Lock,
} from "lucide-react"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL
const PRIMARY_COLOR = "#005a54"

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
  const [questionsListExpanded, setQuestionsListExpanded] = useState(true)
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set())

  // Groot chatbot states
  const [showGrootFeedback, setShowGrootFeedback] = useState(false)
  const [grootIsCorrect, setGrootIsCorrect] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  // User data
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setShowResult(false)
    setLoading(true)
    setShowEncouragingMessage(false)
    setEncouragingMessage("")
    setShowGrootFeedback(false)
    setGrootIsCorrect(null)
    setHasAnswered(false)
    setAnsweredQuestions(new Set())
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

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setHasAnswered(true)
    setAnsweredQuestions((prev) => new Set([...prev, currentQuestion]))

    if (option.isCorrect) {
      setScore((prevScore) => prevScore + 1)
    }

    // Show Groot feedback
    setGrootIsCorrect(option.isCorrect)
    setShowGrootFeedback(true)
  }

  const handleGrootAnimationComplete = () => {
    setShowGrootFeedback(false)
    setGrootIsCorrect(null)
  }

  const handleNext = async () => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedOption(null)
      setHasAnswered(false)
      // Reset Groot state for next question
      setShowGrootFeedback(false)
      setGrootIsCorrect(null)
    } else {
      setShowResult(true)
      await saveScore(score)
    }
  }

  const handleQuestionNavigation = (questionIndex) => {
    // Allow navigation to any question during the current quiz attempt
    if (!showResult) {
      setCurrentQuestion(questionIndex)
      // Check if this question was already answered
      const wasAnswered = answeredQuestions.has(questionIndex)
      setHasAnswered(wasAnswered)

      // Reset selection for navigation
      setSelectedOption(null)
      setShowGrootFeedback(false)
      setGrootIsCorrect(null)
    }
  }

  const isQuizCompleted = (goalId) => {
    return quizScores.some((score) => String(score.goalId) === String(goalId))
  }

  const handleGoalNavigation = (targetGoalId) => {
    // Prevent re-attempting completed quizzes
    if (isQuizCompleted(targetGoalId)) {
      return
    }
    navigate(`/quiz/${targetGoalId}`)
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
      } else {
        const message = getEncouragingMessage(goalId, quizScore, quiz.questions.length)
        setEncouragingMessage(message)
        setShowEncouragingMessage(true)
        setTimeout(() => setShowEncouragingMessage(false), 4000)
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
      // Find next uncompleted quiz
      for (let i = currentQuizIndex + 1; i < allQuizzes.length; i++) {
        const nextQuiz = allQuizzes[i]
        if (!isQuizCompleted(nextQuiz.goalId)) {
          navigate(`/quiz/${nextQuiz.goalId}`)
          return
        }
      }
    }
    navigate("/")
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#005a54] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-slate-600 font-medium">Loading your quiz...</p>
        </motion.div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-xl text-slate-700 mb-4">Quiz not available for this goal.</p>
          <button
            onClick={() => navigate("/profile")}
            className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const totalPoints = quizScores.reduce((acc, quiz) => acc + quiz.score, 0)
  const completedQuizzes = quizScores.length
  const progressPercentage = Math.round((completedQuizzes / 17) * 100)
  const currentQuestionProgress = Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      {/* Enhanced Particles */}
      <EnhancedParticles show={showCelebration} score={score} totalQuestions={quiz?.questions?.length || 5} />

      {/* Groot Chatbot */}
      <GrootChatbot
        isCorrect={grootIsCorrect}
        showFeedback={showGrootFeedback}
        currentQuestion={quiz?.questions[currentQuestion]}
        hasAnswered={hasAnswered}
        onAnimationComplete={handleGrootAnimationComplete}
      />

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
            <div
              className="text-white px-8 py-6 rounded-2xl shadow-2xl max-w-md mx-4 text-center border border-opacity-30"
              style={{ backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR }}
            >
              <div className="text-4xl mb-3">💪</div>
              <p className="text-lg font-semibold leading-relaxed">{encouragingMessage}</p>
              <div className="mt-3 text-sm opacity-90">Continue your learning journey! 🌟</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">SDG Quest</h1>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.name || "User"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Goal Roadmap with Custom Scrollbar */}
          <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Goal Roadmap</h2>
              <p className="text-sm text-gray-600">
                Kickstart your SDG learning process with resources tailored to meet your needs
              </p>
            </div>

            {/* Scrollable Goals Container with Custom Scrollbar */}
            <div
              className="flex-1 overflow-y-auto pr-2 space-y-3"
              style={{
                maxHeight: showResult ? "400px" : "500px", // Adjust height based on content
                scrollbarWidth: "thin",
                scrollbarColor: `${PRIMARY_COLOR} #f1f5f9`,
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  width: 6px;
                }
                div::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 3px;
                }
                div::-webkit-scrollbar-thumb {
                  background: ${PRIMARY_COLOR};
                  border-radius: 3px;
                }
                div::-webkit-scrollbar-thumb:hover {
                  background: #007a6b;
                }
              `}</style>

              {Array.from({ length: 17 }, (_, i) => i + 1).map((goal) => {
                const isCompleted = isQuizCompleted(goal)
                const isCurrent = String(goal) === String(goalId)

                return (
                  <motion.button
                    key={goal}
                    onClick={() => handleGoalNavigation(goal)}
                    disabled={isCompleted}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                      isCurrent
                        ? "bg-teal-600 text-white shadow-md"
                        : isCompleted
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-50"
                    }`}
                    whileHover={!isCompleted && !isCurrent ? { scale: 1.02 } : {}}
                    whileTap={!isCompleted && !isCurrent ? { scale: 0.98 } : {}}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrent ? "bg-white/20" : isCompleted ? "bg-gray-300" : "bg-gray-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-gray-500" />
                      ) : (
                        <span className={`text-sm font-medium ${isCurrent ? "text-white" : "text-gray-600"}`}>
                          {goal}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium">Goal {goal}</span>
                      {isCompleted && <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            {/* User Profile Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user?.name || "User"}</p>
                  <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Center Content - Quiz */}
          <div className="flex-1">
            {!showResult ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Quiz Header */}
                <div className="px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <span>Goal {goalId}</span>
                        <ChevronRight className="w-4 h-4" />
                        <span>Take a test</span>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900">Test your knowledge on SDG Goal {goalId}</h1>
                      <p className="text-sm text-gray-600 mt-1">Practice Quiz | {quiz.questions.length} questions</p>
                    </div>
                  </div>
                </div>

                {/* Question Content */}
                <div className="p-8">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
                      {quiz.questions[currentQuestion]?.question}
                    </h2>

                    <div className="space-y-4 mb-8">
                      {quiz.questions[currentQuestion]?.options.map((option, index) => (
                        <motion.button
                          key={index}
                          onClick={() => handleOptionSelect(option)}
                          disabled={selectedOption !== null}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            selectedOption === option
                              ? option.isCorrect
                                ? "bg-teal-50 border-teal-500 text-teal-800"
                                : "bg-red-50 border-red-500 text-red-800"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          whileHover={{ scale: selectedOption ? 1 : 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium mr-4 ${
                                selectedOption === option
                                  ? option.isCorrect
                                    ? "bg-teal-500 text-white"
                                    : "bg-red-500 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </span>
                            <span className="flex-1">{option.text}</span>
                            {selectedOption === option && option.isCorrect && (
                              <CheckCircle2 className="w-5 h-5 text-teal-600" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {selectedOption && (
                      <motion.button
                        onClick={handleNext}
                        className="bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 font-medium transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Submit Answer"}
                      </motion.button>
                    )}
                  </motion.div>
                </div>
              </div>
            ) : (
              <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold mb-4 text-gray-900">Assessment Complete</h2>

                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="text-4xl mb-4">{score === 5 ? "🏆" : score >= 4 ? "🎯" : "📚"}</div>
                  <p className="text-2xl mb-2 text-gray-700">
                    Score: <span className="font-bold text-teal-600">{score}</span> out of {quiz.questions.length}
                  </p>
                  <div className="text-lg text-gray-600">
                    {score === 5 && "Outstanding! Perfect mastery demonstrated."}
                    {score === 4 && "Excellent! Strong understanding achieved."}
                    {score === 3 && "Good! Solid foundation established."}
                    {score < 3 && "Keep learning! Great potential ahead."}
                  </div>
                </div>

                <BadgesDisplay badgesEarned={badgesEarned} quizScores={quizScores} showProgress={true} />

                <div className="flex gap-4 justify-center mt-8">
                  <button
                    onClick={handleNextQuiz}
                    className="bg-teal-600 text-white px-8 py-3 rounded-xl hover:bg-teal-700 font-medium transition-colors"
                  >
                    Next Assessment
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 font-medium transition-colors"
                  >
                    Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Sidebar - Stats and Questions */}
          <div className="w-80 space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#0d9488"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${currentQuestionProgress * 2.51} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-teal-600">{currentQuestionProgress}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Progress</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Points</span>
                  <span className="font-bold text-teal-600">{totalPoints}/85</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-bold text-gray-900">{completedQuizzes}/17</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Score</span>
                  <span className="font-bold text-gray-900">
                    {score}/{quiz?.questions?.length || 5}
                  </span>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => setQuestionsListExpanded(!questionsListExpanded)}
                className="flex items-center justify-between w-full mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-900">Quiz Questions List</h3>
                {questionsListExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {questionsListExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {quiz?.questions?.map((_, index) => {
                      const isAnswered = answeredQuestions.has(index)
                      const isCurrent = index === currentQuestion

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handleQuestionNavigation(index)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                            isCurrent
                              ? "bg-teal-50 text-teal-700 border border-teal-200"
                              : isAnswered
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "text-gray-600 hover:bg-gray-50"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-sm font-medium">Quiz question {index + 1}</span>
                          {isAnswered && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                          {isCurrent && !isAnswered && <div className="w-2 h-2 bg-teal-600 rounded-full"></div>}
                        </motion.button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Sign-in Popup */}
      {showPopup && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg mx-4 border border-slate-200"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold mb-6 text-slate-800">Continue Your Learning</h2>
            <p className="text-slate-600 mb-8 text-lg">
              Sign in to access more assessments and track your progress professionally.
            </p>
            <div className="flex gap-6">
              <button
                onClick={() => navigate("/signin")}
                className="flex-1 text-white px-8 py-4 rounded-2xl hover:opacity-90 font-bold text-lg"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/")}
                className="flex-1 bg-slate-500 text-white px-8 py-4 rounded-2xl hover:bg-slate-600 font-bold text-lg"
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
