"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Bar, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip } from "chart.js"
import axios from "axios"
import BadgesDisplay from "../components/BadgesDisplay"
import { Target, CheckCircle, Clock, XCircle, Eye, Calendar, MessageSquare, Camera, Edit3, Save, X } from "lucide-react"
import { fetchUserSubmissions, fetchUserPledges, uploadImage, client } from "../lib/sanity"
import PledgeDashboard from "../components/PledgeDashboard"
import "../components/ui/styles/dashboard.css"

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
  const [userPledges, setUserPledges] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedName, setEditedName] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)

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
    setWelcomeMessage(`${greeting}, ${userData.name}! 👋`)

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
      // Upload to Sanity
      const uploadedImage = await uploadImage(file, `profile-${user.id || Date.now()}.${file.type.split("/")[1]}`)

      // Create or update user profile document in Sanity
      const userId = localStorage.getItem("userId")
      const userProfileDoc = {
        _type: "userProfile",
        userId: userId,
        name: user.name,
        email: user.email,
        profileImage: uploadedImage,
        updatedAt: new Date().toISOString(),
      }

      // Check if profile exists
      const existingProfile = await client.fetch(`*[_type == "userProfile" && userId == $userId][0]`, { userId })

      let result
      if (existingProfile) {
        result = await client
          .patch(existingProfile._id)
          .set({ profileImage: uploadedImage, updatedAt: new Date().toISOString() })
          .commit()
      } else {
        result = await client.create(userProfileDoc)
      }

      // Update local state
      const imageUrl = uploadedImage.asset._ref
      setProfileImage(imageUrl)

      const updatedUser = { ...user, profilePicture: imageUrl }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      console.log("Profile image updated successfully!")
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

      // Update in Sanity
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

      // Update local state
      const updatedUser = { ...user, name: editedName.trim() }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))

      const hour = new Date().getHours()
      const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
      setWelcomeMessage(`${greeting}, ${editedName.trim()}! 👋`)

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
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="profile-section">
          <div className="profile-image-container">
            <div className="profile-image-wrapper">
              <img
                src={profileImage.includes("http") ? profileImage : `/placeholder.svg?height=128&width=128`}
                alt="Profile"
                className="profile-image"
              />
              <label className="image-upload-button">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden-input"
                  disabled={isUploadingImage}
                />
                {isUploadingImage ? <div className="upload-spinner"></div> : <Camera size={16} />}
              </label>
            </div>
          </div>

          {user && (
            <div className="profile-info">
              {isEditingProfile ? (
                <div className="edit-name-container">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="name-input"
                    placeholder="Enter your name"
                  />
                  <div className="edit-buttons">
                    <button onClick={handleNameUpdate} className="save-button">
                      <Save size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingProfile(false)
                        setEditedName(user.name || "")
                        setUploadError("")
                      }}
                      className="cancel-button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="name-display">
                  <h3 className="user-name">{user.name}</h3>
                  <button onClick={() => setIsEditingProfile(true)} className="edit-name-button">
                    <Edit3 size={14} />
                  </button>
                </div>
              )}
              <p className="user-email">{user.email}</p>
            </div>
          )}

          {uploadError && <p className="error-message">{uploadError}</p>}
        </div>

        <div className="navigation-buttons">
          <button onClick={() => navigate("/")} className="nav-button primary">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </button>

          <button onClick={() => navigate("/sdg-actions")} className="nav-button secondary">
            <Target className="nav-icon" />
            SDG Actions
          </button>

          <button onClick={() => navigate("/take-action")} className="nav-button tertiary">
            <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Take Action
          </button>

          <button onClick={handleLogout} className="nav-button logout">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="welcome-section">
          <h1 className="welcome-title">{welcomeMessage}</h1>
          <p className="welcome-subtitle">
            Welcome to your personal dashboard. Track your progress and achieve your goals!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card primary">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Total Points</h3>
              <p className="stat-number">
                {quizScores.reduce((acc, quiz) => acc + (quiz.score || 0), 0)}
                <span className="stat-total">/85</span>
              </p>
            </div>
          </div>

          <div className="stat-card secondary">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Completed Goals</h3>
              <p className="stat-number">
                {completedQuizzes}
                <span className="stat-total">/17</span>
              </p>
            </div>
          </div>

          <div className="stat-card tertiary">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3>Actions Submitted</h3>
              <p className="stat-number">{userSubmissions.length}</p>
            </div>
          </div>

          <div className="stat-card quaternary">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Approved Actions</h3>
              <p className="stat-number">{userSubmissions.filter((s) => s.status === "approved").length}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Action Submissions Section */}
        <div className="submissions-section">
          <div className="section-header">
            <h3 className="section-title">Your SDG Action Submissions</h3>
            <div className="section-actions">
              <span className="total-count">Total: {userSubmissions.length}</span>
              <button onClick={refreshSubmissions} className="refresh-button">
                <svg className="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <button onClick={() => navigate("/sdg-actions")} className="submit-button">
                Submit New Action
              </button>
            </div>
          </div>

          {userSubmissions.length > 0 ? (
            <div className="submissions-grid">
              {userSubmissions.map((submission) => {
                const goal = getGoalById(submission.goalId)
                return (
                  <div key={submission.id} className="submission-card">
                    <div className="submission-header">
                      <h4 className="submission-title">{submission.title}</h4>
                      <div className={`status-badge ${getStatusColor(submission.status)}`}>
                        {getStatusIcon(submission.status)}
                        <span>{submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span>
                      </div>
                    </div>

                    <p className="submission-description">{submission.description}</p>

                    <div className="submission-meta">
                      {goal && (
                        <span className={`goal-badge ${goal.color}`}>
                          {goal.icon} Goal {submission.goalId}
                        </span>
                      )}
                      <div className="meta-info">
                        <Calendar size={12} />
                        <span>Submitted: {submission.createdAt}</span>
                      </div>
                      <div className="meta-info">
                        <MessageSquare size={12} />
                        <span>{submission.solutions} solution(s)</span>
                      </div>
                    </div>

                    {submission.status === "approved" && (
                      <button onClick={() => navigate("/sdg-actions")} className="view-public-button">
                        <Eye size={14} />
                        View Public
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <Target className="empty-icon" />
              <h4>No SDG Actions Yet</h4>
              <p>Ready to make a difference? Submit your first SDG action to help solve community problems.</p>
              <button onClick={() => navigate("/sdg-actions")} className="cta-button">
                Submit Your First Action
              </button>
            </div>
          )}
        </div>

        {/* Pledge Dashboard Section */}
        <div className="pledges-section">
          <PledgeDashboard userId={user?.id || localStorage.getItem("userId")} userName={user?.name} />
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <h3 className="chart-title">Quizzes Progress (Grouped by Goal)</h3>
            <div className="chart-wrapper">
              <Bar
                data={quizzesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 5,
                      ticks: { stepSize: 1 },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="chart-container">
            <h3 className="chart-title">Quiz Completion</h3>
            <div className="chart-wrapper">
              <Doughnut data={quizCompletionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="achievements-section">
          <h3 className="section-title">Your Achievements & Rewards</h3>
          <BadgesDisplay
            badgesEarned={badgesEarned}
            quizScores={quizScores}
            userName={user?.name || "User"}
            showProgress={true}
          />
        </div>

        {/* Achievement Summary */}
        <div className="achievement-summary">
          <div className="summary-content">
            <div className="summary-text">
              <h3>🎉 Keep Up the Great Work!</h3>
              <p>You're making amazing progress on your SDG journey. Share your achievements and inspire others!</p>
            </div>
            <div className="summary-stats">
              <div className="summary-stat">
                <p className="summary-number">{Math.round((completedQuizzes / 17) * 100)}%</p>
                <p className="summary-label">Quiz Completion</p>
              </div>
              <div className="summary-stat">
                <p className="summary-number">{userSubmissions.filter((s) => s.status === "approved").length}</p>
                <p className="summary-label">Approved Actions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
