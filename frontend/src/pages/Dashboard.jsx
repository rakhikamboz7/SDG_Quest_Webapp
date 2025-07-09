"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip } from "chart.js"
import axios from "axios"
import BadgesDisplay from "../components/BadgesDisplay"
import {
  Target,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Calendar,
  MessageSquare,
  Camera,
  Edit3,
  Save,
  X,
  Home,
  Award,
  Activity,
  TrendingUp,
  LogOut,
} from "lucide-react"
import { fetchUserSubmissions, fetchUserPledges, uploadImage, client } from "../lib/sanity"
import PledgeDashboard from "../components/PledgeDashboard"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL
const PRIMARY_COLOR = "#005a54"

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
  const [userPledges, setUserPledges] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [activeSection, setActiveSection] = useState("overview")

  // SDG Goals for reference
  const sdgGoals = [
    { id: 1, name: "No Poverty", color: "#E5243B", icon: "🏠" },
    { id: 2, name: "Zero Hunger", color: "#DDA63A", icon: "🌾" },
    { id: 3, name: "Good Health", color: "#4C9F38", icon: "🏥" },
    { id: 4, name: "Quality Education", color: "#C5192D", icon: "📚" },
    { id: 5, name: "Gender Equality", color: "#FF3A21", icon: "⚖️" },
    { id: 6, name: "Clean Water", color: "#26BDE2", icon: "💧" },
    { id: 7, name: "Clean Energy", color: "#FCC30B", icon: "⚡" },
    { id: 8, name: "Economic Growth", color: "#A21942", icon: "📈" },
    { id: 9, name: "Innovation", color: "#FD6925", icon: "🏭" },
    { id: 10, name: "Reduced Inequalities", color: "#DD1367", icon: "🤝" },
    { id: 11, name: "Sustainable Cities", color: "#FD9D24", icon: "🏙️" },
    { id: 12, name: "Responsible Consumption", color: "#BF8B2E", icon: "♻️" },
    { id: 13, name: "Climate Action", color: "#3F7E44", icon: "🌍" },
    { id: 14, name: "Life Below Water", color: "#0A97D9", icon: "🐟" },
    { id: 15, name: "Life on Land", color: "#56C02B", icon: "🌳" },
    { id: 16, name: "Peace & Justice", color: "#00689D", icon: "⚖️" },
    { id: 17, name: "Partnerships", color: "#19486A", icon: "🤝" },
  ]

  // Navigation items
  const navigationItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "submissions", label: "My Actions", icon: Target },
    { id: "pledges", label: "My Pledges", icon: Award },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "achievements", label: "Achievements", icon: Award },
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
        solutions: sub.solutions?.length || 0,
        solutionDetails: sub.solutions || [],
      }))
      setUserSubmissions(transformedSubmissions)
      return transformedSubmissions
    } catch (error) {
      console.error("Error fetching user submissions:", error)
      setUserSubmissions([])
      return []
    }
  }, [])

  const fetchUserPledgesData = useCallback(async (userId) => {
    try {
      const pledges = await fetchUserPledges(userId)
      setUserPledges(pledges || [])
      return pledges || []
    } catch (error) {
      console.error("Error fetching user pledges:", error)
      setUserPledges([])
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
    setEditedName(userData.name || "")

    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    setWelcomeMessage(`${greeting}, ${userData.name}!`)

    const loadData = async () => {
      const scores = await fetchScores(userId)
      const submissions = await fetchUserSubmissionsData(userId)
      const pledges = await fetchUserPledgesData(userId)
      assignBadges(scores, submissions)
      setLoading(false)
    }

    loadData()
  }, [navigate, fetchScores, fetchUserSubmissionsData, fetchUserPledgesData])

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

    setIsUploadingImage(true)
    setUploadError("")

    try {
      const uploadedImage = await uploadImage(file, `profile-${user.id || Date.now()}.${file.type.split("/")[1]}`)
      const userId = localStorage.getItem("userId")

      const userProfileDoc = {
        _type: "userProfile",
        userId: userId,
        name: user.name,
        email: user.email,
        profileImage: uploadedImage,
        updatedAt: new Date().toISOString(),
      }

      const existingProfile = await client.fetch(`*[_type == "userProfile" && userId == $userId][0]`, { userId })

      if (existingProfile) {
        await client
          .patch(existingProfile._id)
          .set({ profileImage: uploadedImage, updatedAt: new Date().toISOString() })
          .commit()
      } else {
        await client.create(userProfileDoc)
      }

      const imageUrl = uploadedImage.asset._ref
      setProfileImage(imageUrl)
      const updatedUser = { ...user, profilePicture: imageUrl }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } catch (error) {
      console.error("Error updating profile image:", error)
      setUploadError("Failed to update profile image.")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleNameUpdate = async () => {
    if (!editedName.trim()) {
      setUploadError("Name cannot be empty.")
      return
    }

    try {
      const userId = localStorage.getItem("userId")
      const existingProfile = await client.fetch(`*[_type == "userProfile" && userId == $userId][0]`, { userId })

      if (existingProfile) {
        await client
          .patch(existingProfile._id)
          .set({ name: editedName.trim(), updatedAt: new Date().toISOString() })
          .commit()
      } else {
        await client.create({
          _type: "userProfile",
          userId: userId,
          name: editedName.trim(),
          email: user.email,
          updatedAt: new Date().toISOString(),
        })
      }

      const updatedUser = { ...user, name: editedName.trim() }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      const hour = new Date().getHours()
      const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
      setWelcomeMessage(`${greeting}, ${editedName.trim()}!`)

      setIsEditingProfile(false)
      setUploadError("")
    } catch (error) {
      console.error("Error updating name:", error)
      setUploadError("Failed to update name.")
    }
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
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 4,
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
        backgroundColor: [PRIMARY_COLOR, "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-700 bg-green-50 border-green-200"
      case "pending":
        return "text-yellow-700 bg-yellow-50 border-yellow-200"
      case "rejected":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-700 bg-gray-50 border-gray-200"
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-2 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                <span className="text-white text-sm font-bold">SDG</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden sm:block">{welcomeMessage}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-md hover:bg-gray-100"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img
                      src={profileImage.includes("http") ? profileImage : `/placeholder.svg?height=80&width=80`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage ? (
                      <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera size={12} className="text-gray-600" />
                    )}
                  </label>
                </div>

                {user && (
                  <div>
                    {isEditingProfile ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter your name"
                        />
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={handleNameUpdate}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                          >
                            <Save size={12} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingProfile(false)
                              setEditedName(user.name || "")
                              setUploadError("")
                            }}
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700 transition-colors"
                          >
                            <X size={12} />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <button
                            onClick={() => setIsEditingProfile(true)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    )}
                  </div>
                )}

                {uploadError && <p className="text-red-600 text-xs mt-2">{uploadError}</p>}
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeSection === item.id ? "text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      style={{
                        backgroundColor: activeSection === item.id ? PRIMARY_COLOR : "transparent",
                      }}
                    >
                      <IconComponent size={18} />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/")}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Home size={16} />
                  <span>Home</span>
                </button>
                <button
                  onClick={() => navigate("/sdg-actions")}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Target size={16} />
                  <span>SDG Actions</span>
                </button>
                <button
                  onClick={() => navigate("/take-action")}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Activity size={16} />
                  <span>Take Action</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Target className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Points</p>
                        <p className="text-xl font-bold text-gray-900">
                          {quizScores.reduce((acc, quiz) => acc + (quiz.score || 0), 0)}
                          <span className="text-sm font-normal text-gray-500">/85</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Completed Goals</p>
                        <p className="text-xl font-bold text-gray-900">
                          {completedQuizzes}
                          <span className="text-sm font-normal text-gray-500">/17</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <Activity className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Actions Submitted</p>
                        <p className="text-xl font-bold text-gray-900">{userSubmissions.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                        <Award className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Approved Actions</p>
                        <p className="text-xl font-bold text-gray-900">
                          {userSubmissions.filter((s) => s.status === "approved").length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Progress by Goal</h3>
                    <div className="h-64">
                      <Bar
                        data={quizzesData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 5,
                              ticks: { stepSize: 1 },
                            },
                            x: {
                              ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Completion</h3>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-48 h-48">
                        <Doughnut
                          data={quizCompletionData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "bottom",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submissions Section */}
            {activeSection === "submissions" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your SDG Actions</h2>
                    <p className="text-sm text-gray-600 mt-1">Track and manage your submitted actions</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <span className="text-sm text-gray-500">Total: {userSubmissions.length}</span>
                    <button
                      onClick={refreshSubmissions}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Activity size={16} />
                    </button>
                    <button
                      onClick={() => navigate("/sdg-actions")}
                      className="px-4 py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      Submit New Action
                    </button>
                  </div>
                </div>

                {userSubmissions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userSubmissions.map((submission) => {
                      const goal = getGoalById(submission.goalId)
                      return (
                        <div key={submission.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900 text-sm">{submission.title}</h4>
                            <div
                              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(submission.status)}`}
                            >
                              {getStatusIcon(submission.status)}
                              <span className="capitalize">{submission.status}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{submission.description}</p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            {goal && (
                              <span
                                className="px-2 py-1 rounded text-white text-xs"
                                style={{ backgroundColor: goal.color }}
                              >
                                {goal.icon} Goal {submission.goalId}
                              </span>
                            )}
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Calendar size={12} />
                                <span>{submission.createdAt}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageSquare size={12} />
                                <span>{submission.solutions} solutions</span>
                              </div>
                            </div>
                          </div>

                          {submission.status === "approved" && (
                            <button
                              onClick={() => navigate("/sdg-actions")}
                              className="mt-3 flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs"
                            >
                              <Eye size={12} />
                              <span>View Public</span>
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <Target className="mx-auto text-gray-400 mb-4" size={48} />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No SDG Actions Yet</h4>
                    <p className="text-gray-600 mb-4">
                      Ready to make a difference? Submit your first SDG action to help solve community problems.
                    </p>
                    <button
                      onClick={() => navigate("/sdg-actions")}
                      className="px-6 py-2 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      Submit Your First Action
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pledges Section */}
            {activeSection === "pledges" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <PledgeDashboard userId={user?.id || localStorage.getItem("userId")} userName={user?.name} />
              </div>
            )}

            {/* Progress Section */}
            {activeSection === "progress" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Progress</h2>
                  <p className="text-sm text-gray-600">Track your journey towards achieving the SDGs</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiz Progress by Goal</h3>
                    <div className="h-80">
                      <Bar
                        data={quizzesData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              max: 5,
                              ticks: { stepSize: 1 },
                            },
                            x: {
                              ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Completion</h3>
                    <div className="h-80 flex items-center justify-center">
                      <div className="w-64 h-64">
                        <Doughnut
                          data={quizCompletionData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: "bottom",
                              },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Summary</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{Math.round((completedQuizzes / 17) * 100)}%</p>
                      <p className="text-sm text-gray-600">Quiz Completion</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {userSubmissions.filter((s) => s.status === "approved").length}
                      </p>
                      <p className="text-sm text-gray-600">Approved Actions</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{badgesEarned.length}</p>
                      <p className="text-sm text-gray-600">Badges Earned</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements Section */}
            {activeSection === "achievements" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Achievements & Rewards</h2>
                <BadgesDisplay
                  badgesEarned={badgesEarned}
                  quizScores={quizScores}
                  userName={user?.name || "User"}
                  showProgress={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
