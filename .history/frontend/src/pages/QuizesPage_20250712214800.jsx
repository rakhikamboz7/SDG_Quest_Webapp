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
  const [showResult, setShowResult] = useState(false)
  const [allQuizzes, setAllQuizzes] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [encouragingMessage, setEncouragingMessage] = useState("")
  const [showEncouragingMessage, setShowEncouragingMessage] = useState(false)

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

  const assignBadges = (scores) => {
    const totalPoints = scores.reduce((acc, quiz) => acc + quiz.score, 0)
    const earnedBadges = []
    if (totalPoints >= 75) earnedBadges.push("Gold")
    if (totalPoints >= 30) earnedBadges.push("Silver")
    if (totalPoints >= 5) earnedBadges.push("Bronze")
    return earnedBadges
  }

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/quizzes`)
      setAllQuizzes(response.data)
      const foundQuiz = response.data.find((q) => String(q.goalId) === String(goalId))
      if (foundQuiz) setQuiz(foundQuiz)
      else setQuiz(null)
    } catch (error) {
      console.error("Error fetching quizzes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuizzes()
  }, [goalId])

  const handleTeddyAnimationComplete = () => {
    setShowTeddyBear(false)
    setQuizStarted(true)
    setTimeout(() => setShowPeekingOver(true), 500)
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    if (option.isCorrect) setScore((prev) => prev + 1)
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
        setTimeout(() => setShowShyPeeking(true), 1500)
      } else {
        const message = getEncouragingMessage(goalId, quizScore, quiz.questions.length)
        setEncouragingMessage(message)
        setShowEncouragingMessage(true)
        setTimeout(() => setShowEncouragingMessage(false), 4000)
        setTimeout(() => setShowShyPeeking(true), 2500)
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
        }
      )

      await fetchScores()
    } catch (error) {
      console.error("Error saving score:", error)
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      {/* TeddyBear Animated Placement */}
      <TeddyBear
        show={showTeddyBear}
        mode="welcome"
        onAnimationComplete={handleTeddyAnimationComplete}
      />
      <TeddyBear
        show={showPeekingOver}
        mode="peeking"
        position="top"
      />
      <TeddyBear
        show={showShyPeeking}
        mode="completion"
        position="bottom"
        score={score}
      />

      {/* QUIZ CARD CONTAINER */}
      <div id="quiz-card" className="max-w-4xl mx-auto mt-24 p-6 bg-white shadow-xl rounded-3xl relative z-10">
        {/* Quiz Content */}
        {/* ...rest of your quiz rendering... */}
      </div>
    </div>
  )
}

export default QuizPage
