"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip } from "chart.js"
import axios from "axios"
import BadgesDisplay from "../components/BadgesDisplay"
import { Target, CheckCircle, Clock, XCircle, Eye, Calendar, MessageSquare } from "lucide-react"
import { fetchUserSubmissions } from "../lib/sanity"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000"

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip)

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profileImage, setProfileImage] = useState("default-profile.png")
  const [uploadError, setUploadError] = useState("")
  const [quizScores, setQuizScores] = useState([])
  const [welcomeMessage, setWelcomeMessage] = useState("")
  const [badgesEarned, setBadgesEarned] = useState([])
  const [userSubmissions, setUserSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  // SDG Goals for reference
  const sdgGoals = [
    { id: 1, name: "No Poverty", color: "bg-red-500", icon: "🏠" },
    { id: 2, name: "Zero Hunger", color: "bg-yellow-500", icon: "🌾" },
    { id: 3, name: "Good Health", color: "bg-green-500", icon: "🏥" },
    { id: 4, name: "Quality Education", color: "bg-red-600", icon: "📚" },
    { id: 5, name: "Gender Equality", color: "bg-orange-500", icon: "⚖️" },
    { id: 6, name: "Clean Water", color: "bg-blue-400", icon: "💧" },
    { id: 7, name: "Clean Energy", color: "bg-yellow-400", icon: "⚡" },
    { id: 8, name: "Economic Growth", color: "bg-purple-500", icon: "📈" },
    { id: 9, name: "Innovation", color: "bg-orange-600", icon: "🏭" },
    { id: 10, name: "Reduced Inequalities", color: "bg-pink-500", icon: "🤝" },
    { id: 11, name: "Sustainable Cities", color: "bg-orange-400", icon: "🏙️" },
    { id: 12, name: "Responsible Consumption", color: "bg-yellow-600", icon: "♻️" },
    { id: 13, name: "Climate Action", color: "bg-green-600", icon: "🌍" },
    { id: 14, name: "Life Below Water", color: "bg-blue-500", icon: "🐟" },
    { id: 15, name: "Life on Land", color: "bg-green-700", icon: "🌳" },
    { id: 16, name: "Peace & Justice", color: "bg-blue-600", icon: "⚖️" },
    { id: 17, name: "Partnerships", color: "bg-blue-800", icon: "🤝" },
  ]

  // Assign badges based on total quiz score and submissions
  const assignBadges = (scores, submissions) => {
    const totalPoints = scores.reduce((acc, quiz) => acc + (quiz.score || 0), 0)
    const earnedBadges = []

    if (totalPoints >= 75) earnedBadges.push("Gold")
    if (totalPoints >= 30) earnedBadges.push("Silver")
    if (totalPoints > 0) earnedBadges.push("Bronze")

    // Add submission-based badges
    const approvedSubmissions = submissions.filter((s) => s.status === "approved")
    if (approvedSubmissions.length >= 5) earnedBadges.push("Action Hero")
    if (approvedSubmissions.length >= 1) earnedBadges.push("Problem Solver")

    setBadgesEarned(earnedBadges)
  }

  const fetchScores = useCallback(async (userId) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/scores/${userId}`)
      const scoresData = res.data.userScores || []
      setQuizScores(scoresData)
      return scoresData
    } catch (error) {
      console.error("Error fetching scores:", error)
      return []
    }
  }, [])

  const fetchUserSubmissionsData = useCallback(async (userId) => {
    try {
      const submissions = await fetchUserSubmissions(userId)

      const transformedSubmissions = submissions.map((sub) => ({
        id: sub.id,
        title: sub.title,
        description: sub.description,
        goalId: sub.goalId,
        status: sub.status,
        createdAt: new Date(sub.createdAt).toLocaleDateString(),
        updatedAt: sub.updatedAt ? new Date(sub.updatedAt).toLocaleDateString() : null,
        solutions: sub.solutions.length,
        solutionDetails: sub.solutions,
      }))

      setUserSubmissions(transformedSubmissions)
      return transformedSubmissions
    } catch (error) {
      console.error("Error fetching user submissions:", error)
      // Show empty state instead of mock data
      setUserSubmissions([])
      return []
    }
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const userId = localStorage.getItem("userId")

    if (!storedUser || !userId) {
      navigate("/signin")
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)
    setProfileImage(userData.profilePicture || "default-profile.png")

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    setWelcomeMessage(`${greeting}, ${userData.name}! 👋`)

    const loadData = async () => {
      const scores = await fetchScores(userId)
      const submissions = await fetchUserSubmissionsData(userId)
      assignBadges(scores, submissions)
      setLoading(false)
    }

    loadData()
  }, [navigate, fetchScores, fetchUserSubmissionsData])

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      setUploadError("No file selected.")
      return
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = async () => {
      const imageBase64 = reader.result
      const updatedUser = { ...user, profilePicture: imageBase64 }
      setProfileImage(imageBase64)
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUploadError("")

      try {
        await axios.put(`${BACKEND_URL}/api/user/profile-picture`, {
          profilePicture: imageBase64,
        })
        console.log("Profile picture updated successfully!")
      } catch (error) {
        console.error("Error updating profile image:", error)
        setUploadError("Failed to update profile image.")
      }
    }

    reader.readAsDataURL(file)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    navigate("/signin")
  }

  const getGoalById = (id) => sdgGoals.find((goal) => goal.id === id)

  // Compute total scores per goal
  const goalScores = Array(17).fill(0)
  quizScores.forEach((quiz) => {
    const goalIndex = Number.parseInt(quiz.goalId) - 1
    if (goalIndex >= 0 && goalIndex < 17) {
      goalScores[goalIndex] += quiz.score || 0
    }
  })

  const quizzesData = {
    labels: Array.from({ length: 17 }, (_, i) => `Goal ${i + 1}`),
    datasets: [
      {
        label: "Total Score per Goal",
        data: goalScores,
        backgroundColor: "#008080",
      },
    ],
  }

  const completedQuizzes = quizScores.length
  const remainingQuizzes = 17 - completedQuizzes

  const quizCompletionData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [completedQuizzes, remainingQuizzes],
        backgroundColor: ["#008080", "#f0b100"],
      },
    ],
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-50 border-green-200"
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const refreshSubmissions = async () => {
    const userId = localStorage.getItem("userId")
    if (userId) {
      setLoading(true)
      await fetchUserSubmissionsData(userId)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="flex py-12 flex-col lg:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-full mb-8 lg:w-64 bg-white shadow-lg">
          <div className="p-6 space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mt-4 mb-5">
                <img
                  src={profileImage || "/placeholder.svg?height=128&width=128"}
                  alt="Profile"
                  className="w-full h-full rounded-full border-4 border-teal-700 object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-teal-700 p-2 rounded-full cursor-pointer hover:bg-teal-800 transition-colors">
                  <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </label>
              </div>

              {user && (
                <>
                  <h3 className="text-xl font-bold text-gray-800 text-center">{user.name}</h3>
                  <p className="text-sm text-gray-600 text-center">{user.email}</p>
                </>
              )}
              {uploadError && <p className="text-sm text-red-600 text-center">{uploadError}</p>}
            </div>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors mb-2 flex items-center justify-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </button>

            <button
              onClick={() => navigate("/sdg-actions")}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors mb-2 flex items-center justify-center gap-2 font-medium"
            >
              <Target className="w-5 h-5" />
              SDG Actions
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-4xl font-bold text-teal-700">{welcomeMessage}</h1>
            <p className="text-gray-600 mt-2 text-lg">
              Welcome to your personal dashboard. Track your progress and achieve your goals!
            </p>
          </div>

          {/* Enhanced Action Submissions Section */}
          <div className="mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-6 bg-emerald-600 rounded"></div>
                  Your SDG Action Submissions
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">
                    Total: <span className="font-semibold text-gray-700">{userSubmissions.length}</span>
                  </div>
                  <button
                    onClick={refreshSubmissions}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title="Refresh submissions"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate("/sdg-actions")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Submit New Action
                  </button>
                </div>
              </div>

              {userSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {userSubmissions.map((submission) => {
                    const goal = getGoalById(submission.goalId)
                    return (
                      <div
                        key={submission.id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 mb-2 text-lg">{submission.title}</h4>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{submission.description}</p>

                            <div className="flex items-center gap-3 mb-3">
                              {goal && (
                                <span
                                  className={`${goal.color} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}
                                >
                                  {goal.icon} Goal {submission.goalId}
                                </span>
                              )}
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>Submitted: {submission.createdAt}</span>
                              </div>
                              {submission.updatedAt && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <span>Updated: {submission.updatedAt}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MessageSquare className="h-3 w-3" />
                                <span>{submission.solutions} solution(s)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div
                              className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(submission.status)}`}
                            >
                              {getStatusIcon(submission.status)}
                              <span className="text-sm font-medium">
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </span>
                            </div>

                            {submission.status === "approved" && (
                              <button
                                onClick={() => navigate("/sdg-actions")}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                <Eye className="h-3 w-3" />
                                View Public
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Enhanced Status Messages */}
                        {submission.status === "pending" && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-3">
                            <div className="flex items-start gap-2">
                              <div className="text-yellow-600 text-lg">⏳</div>
                              <div>
                                <p className="text-yellow-800 font-medium text-sm mb-1">Under Review</p>
                                <p className="text-yellow-700 text-sm">
                                  Your submission is being reviewed by our admin team. You'll receive an email
                                  notification once it's processed. This usually takes 24-48 hours.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {submission.status === "approved" && (
                          <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-3">
                            <div className="flex items-start gap-2">
                              <div className="text-green-600 text-lg">🎉</div>
                              <div>
                                <p className="text-green-800 font-medium text-sm mb-1">Approved & Live!</p>
                                <p className="text-green-700 text-sm">
                                  Congratulations! Your submission is now live and visible to the community. Others can
                                  now contribute solutions to your problem statement.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {submission.status === "rejected" && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-3">
                            <div className="flex items-start gap-2">
                              <div className="text-red-600 text-lg">❌</div>
                              <div>
                                <p className="text-red-800 font-medium text-sm mb-1">Needs Revision</p>
                                <p className="text-red-700 text-sm">
                                  This submission needs some improvements. Please check your email for detailed feedback
                                  and consider resubmitting with the suggested changes.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Show solutions if any */}
                        {submission.solutionDetails && submission.solutionDetails.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <h5 className="text-blue-800 font-medium text-sm mb-2">Community Solutions:</h5>
                            <div className="space-y-2">
                              {submission.solutionDetails.slice(0, 2).map((solution, index) => (
                                <div key={index} className="text-blue-700 text-sm">
                                  <p>• {solution.description || solution.title}</p>
                                  <p className="text-xs text-blue-600 mt-1">By {solution.author}</p>
                                </div>
                              ))}
                              {submission.solutionDetails.length > 2 && (
                                <p className="text-xs text-blue-600">
                                  +{submission.solutionDetails.length - 2} more solutions
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No SDG Actions Yet</h4>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Ready to make a difference? Submit your first SDG action to help solve community problems and
                    inspire others to take action.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/sdg-actions")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      Submit Your First Action
                    </button>
                    <p className="text-xs text-gray-400">
                      Your submissions will appear here and you can track their approval status
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-teal-600 rounded"></div>
                Quizzes Progress (Grouped by Goal)
              </h3>
              <div className="h-64 lg:h-80">
                <Bar
                  data={quizzesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-teal-800 rounded"></div>
                Quiz Completion
              </h3>
              <div className="h-64 lg:h-80">
                <Doughnut data={quizCompletionData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          {/* Stats and Rewards Section */}
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded"></div>
                Your Achievements & Rewards
              </h3>
              <div className="mt-2">
                <BadgesDisplay
                  badgesEarned={badgesEarned}
                  quizScores={quizScores}
                  userName={user?.name || "User"}
                  showProgress={true}
                />
              </div>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-6 bg-blue-600 rounded"></div>
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg border border-teal-200">
                  <p className="text-sm text-teal-700 font-medium">Total Points</p>
                  <p className="text-3xl font-bold text-teal-700">
                    {quizScores.reduce((acc, quiz) => acc + (quiz.score || 0), 0)}
                    <span className="text-lg text-teal-600">/85</span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-700 font-medium">Completed Goals</p>
                  <p className="text-3xl font-bold text-yellow-700">
                    {completedQuizzes}
                    <span className="text-lg text-yellow-600">/17</span>
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-700 font-medium">Actions Submitted</p>
                  <p className="text-3xl font-bold text-emerald-700">{userSubmissions.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium">Approved Actions</p>
                  <p className="text-3xl font-bold text-purple-700">
                    {userSubmissions.filter((s) => s.status === "approved").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Summary Card */}
          <div className="mt-6 bg-gradient-to-r from-teal-600 to-teal-700 p-6 rounded-xl shadow-lg text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-4 lg:mb-0">
                <h3 className="text-2xl font-bold mb-2">🎉 Keep Up the Great Work!</h3>
                <p className="text-teal-100">
                  You're making amazing progress on your SDG journey. Share your achievements and inspire others!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <p className="text-2xl text-white font-bold">{Math.round((completedQuizzes / 17) * 100)}%</p>
                  <p className="text-sm text-teal-100">Quiz Completion</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-white">
                    {userSubmissions.filter((s) => s.status === "approved").length}
                  </p>
                  <p className="text-sm text-teal-100">Approved Actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
