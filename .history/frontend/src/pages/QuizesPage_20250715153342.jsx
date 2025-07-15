"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import BadgesDisplay from "../components/BadgesDisplay"
import EnhancedParticles from "../components/Particles"
import GrootChatbot from "../components/GrootChatbot"
import { motion, AnimatePresence } from "framer-motion"
import { Share2, Trophy, Target, BookOpen, Award, ChevronRight, CheckCircle2 } from "lucide-react"

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

  // Groot chatbot states
  const [showGrootFeedback, setShowGrootFeedback] = useState(false)
  const [grootIsCorrect, setGrootIsCorrect] = useState(null)

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
      // Reset Groot state for next question
      setShowGrootFeedback(false)
      setGrootIsCorrect(null)
    } else {
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
            className="w-16 h-16 border-4 border-[#005a54] border-t-transparent rounded-full mx-auto mb-4"
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
            className="text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
            style={{ backgroundColor: PRIMARY_COLOR }}
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
      {/* Enhanced Particles */}
      <EnhancedParticles show={showCelebration} score={score} totalQuestions={quiz?.questions?.length || 5} />

      {/* Groot Chatbot */}
      <GrootChatbot
        isCorrect={grootIsCorrect}
        showFeedback={showGrootFeedback}
        currentQuestion={quiz?.questions[currentQuestion]}
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

      {/* Professional Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #007a6b)` }}
              >
                {goalId}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">SDG Goal {goalId} Assessment</h1>
                <p className="text-slate-600 text-lg">Professional Knowledge Evaluation</p>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="flex items-center space-x-8">
              <div
                className="flex items-center space-x-3 text-white px-6 py-3 rounded-xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #007a6b)` }}
              >
                <Trophy className="w-5 h-5" />
                <span className="font-bold text-lg">{totalPoints}/85</span>
                <button onClick={handleShare} className="ml-2 hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white px-6 py-3 rounded-xl shadow-lg">
                <Target className="w-5 h-5" />
                <span className="font-bold text-lg">{completedQuizzes}/17</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600 font-medium">Progress</div>
                <div className="font-bold text-slate-800 text-xl">{progressPercentage}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        className="max-w-5xl mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {!showResult ? (
          <div className="relative">
            {/* Quiz Card */}
            <motion.div
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"
              key={currentQuestion}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Professional Progress Header */}
              <div
                className="text-white p-8"
                style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #007a6b)` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Question {currentQuestion + 1}</h2>
                      <p className="text-white/80 text-lg">of {quiz.questions.length} questions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%
                    </div>
                    <div className="text-white/80 text-lg">Complete</div>
                  </div>
                </div>

                {/* Elegant Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-3">
                  <motion.div
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Question Content */}
              <div className="p-10">
                <h3 className="text-3xl font-bold text-slate-800 text-center mb-10 leading-relaxed">
                  {quiz.questions[currentQuestion]?.question}
                </h3>

                <div className="grid grid-cols-1 gap-5 mb-10">
                  {quiz.questions[currentQuestion]?.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      disabled={selectedOption !== null}
                      className={`w-full p-8 text-left rounded-2xl border-3 transition-all duration-300 font-medium text-lg ${
                        selectedOption === option
                          ? option.isCorrect
                            ? "bg-emerald-50 text-emerald-800 border-emerald-500 shadow-emerald-200"
                            : "bg-red-50 text-red-800 border-red-500 shadow-red-200"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300 hover:shadow-xl hover:bg-slate-100"
                      }`}
                      whileHover={{ scale: selectedOption ? 1 : 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mr-6 text-lg ${
                            selectedOption === option
                              ? option.isCorrect
                                ? "bg-emerald-500 text-white"
                                : "bg-red-500 text-white"
                              : "text-white"
                          }`}
                          style={{ backgroundColor: selectedOption === option ? undefined : PRIMARY_COLOR }}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-xl">{option.text}</span>
                        {selectedOption === option && option.isCorrect && (
                          <CheckCircle2 className="w-7 h-7 text-emerald-600 ml-auto" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {selectedOption && (
                  <motion.button
                    onClick={handleNext}
                    className="w-full text-white px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl font-bold text-xl flex items-center justify-center space-x-3"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>{currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Complete Assessment"}</span>
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-10 text-center relative overflow-visible"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl"
                style={{ background: `linear-gradient(135deg, ${PRIMARY_COLOR}, #007a6b)` }}
              >
                <Award className="w-12 h-12 text-white" />
              </div>

              <h2 className="text-4xl font-bold mb-6 text-slate-800">Assessment Complete</h2>

              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 mb-8">
                <div className="text-6xl mb-6">{score === 5 ? "🏆" : score >= 4 ? "🎯" : "📚"}</div>
                <p className="text-3xl mb-4 text-slate-700">
                  Score:{" "}
                  <span className="font-bold" style={{ color: PRIMARY_COLOR }}>
                    {score}
                  </span>{" "}
                  out of {quiz.questions.length}
                </p>
                <div className="text-xl text-slate-600">
                  {score === 5 && "Outstanding! Perfect mastery demonstrated."}
                  {score === 4 && "Excellent! Strong understanding achieved."}
                  {score === 3 && "Good! Solid foundation established."}
                  {score < 3 && "Keep learning! Great potential ahead."}
                </div>
              </div>
            </motion.div>

            <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {score >= 4 ? (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-3 border-emerald-200 text-emerald-800 px-8 py-6 rounded-2xl">
                  <div className="text-3xl mb-3">{score === 5 ? "🏆" : "🎯"}</div>
                  <p className="font-bold text-xl">{score === 5 ? "Mastery Achieved!" : "Proficiency Demonstrated!"}</p>
                  <p className="text-base mt-2">You have excellent knowledge of SDG Goal {goalId}</p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-3 border-blue-200 text-blue-800 px-8 py-6 rounded-2xl">
                  <div className="text-3xl mb-3">📚</div>
                  <p className="font-bold text-xl">Continue Learning!</p>
                  <p className="text-base mt-2">Expand your expertise in SDG Goal {goalId}</p>
                </div>
              )}
            </motion.div>

            <BadgesDisplay badgesEarned={badgesEarned} quizScores={quizScores} showProgress={true} />

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={handleNextQuiz}
                className="text-white px-10 py-4 rounded-2xl hover:shadow-xl font-bold text-lg flex items-center justify-center space-x-3"
                style={{ backgroundColor: PRIMARY_COLOR }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Next Assessment</span>
                <ChevronRight className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-10 py-4 rounded-2xl hover:shadow-xl font-bold text-lg"
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
