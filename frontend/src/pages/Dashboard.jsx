"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip } from "chart.js"
import axios from "axios"
import BadgesDisplay from "../components/BadgesDisplay"

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
  const [loading, setLoading] = useState(true)

  // Assign badges based on total quiz score
  const assignBadges = (scores) => {
    const totalPoints = scores.reduce((acc, quiz) => acc + (quiz.score || 0), 0)
    const earnedBadges = []
    if (totalPoints >= 75) earnedBadges.push("Gold")
    if (totalPoints >= 30) earnedBadges.push("Silver")
    if (totalPoints > 0) earnedBadges.push("Bronze")
    setBadgesEarned(earnedBadges)
  }

  // Move fetchScores definition before useEffect
  const fetchScores = useCallback(async (userId) => {
    try {
      // Assumes API endpoint /scores/:userId returns { userScores: [...] }
      const res = await axios.get(`${BACKEND_URL}/api/scores/${userId}`)
      const scoresData = res.data.userScores || []
      setQuizScores(scoresData)
      assignBadges(scoresData)
    } catch (error) {
      console.error("Error fetching scores:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user")
    const userId = localStorage.getItem("userId")

    if (!storedUser || !userId) {
      navigate("/login")
      return
    }

    const userData = JSON.parse(storedUser)
    setUser(userData)
    setProfileImage(userData.profilePicture || "default-profile.png")

    // Set welcome message based on current hour
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    setWelcomeMessage(`${greeting}, ${userData.name}! 👋`)

    // Fetch quiz scores using the user's ID
    fetchScores(userId)
  }, [navigate, fetchScores])

  // Handle profile image change and update the user both locally and on the server.
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
      // Update the user state and localStorage with the new profile image
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

  // Logout clears user data and navigates to signup.
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    navigate("/signup")
  }

  // Compute total scores per goal (assumes 17 goals)
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

  // Compute quiz completion data
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
    <div className="min-h-screen bg-gray-100">

      <br />

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
            {/* Quick Stats */}
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
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 font-medium">Badges Earned</p>
                  <p className="text-3xl font-bold text-purple-700">{badgesEarned.length}</p>
                </div>
              </div>
            </div>            
          </div>

            {/* Enhanced Rewards Section - Takes 2 columns */}
            

          {/* Achievement Summary Card */}
          <div className="mt-6 bg-gradient-to-r from-teal-600 to-teal-700 p-6 rounded-xl shadow-lg text-white">
            <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-center lg:text-left mb-4 lg:mb-0">
                <h3 className="text-2xl font-bold mb-2">🎉 Keep Up the Great Work!</h3>
                <p className="text-teal-100">
                  You&apos;re making amazing progress on your SDG journey. Share your achievements and inspire others!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 text-center">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                  <p className="text-2xl text-teal-700 font-bold">{Math.round((completedQuizzes / 17) * 100)}%</p>
                  <p className="text-sm text-teal-700">Completion Rate</p>
                </div>
                <div className="bg-white text-teal-900 bg-opacity-20 p-4 rounded-lg">
                  <p className="text-2xl font-bold">{badgesEarned.length}</p>
                  <p className="text-sm text-teal-800">Badges Unlocked</p>
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
