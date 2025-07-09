"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Award, XCircle, Camera, Video } from "lucide-react"
import { fetchProblemSubmissions, createProblemSubmission } from "../lib/sanity"
import EnhancedSubmissionCard from "../components/SubmissionCard"

// SDG Goals data
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

// User badges data
// const userBadges = [
//   { name: "Tree Planter", icon: "🌱", description: "Planted 10+ trees", earned: true },
//   { name: "Education Hero", icon: "📚", description: "Helped 5+ students", earned: true },
//   { name: "Hunger Warrior", icon: "🍽️", description: "Fed 20+ people", earned: false },
//   { name: "Water Guardian", icon: "💧", description: "Clean water initiatives", earned: true },
//   { name: "Climate Champion", icon: "🌍", description: "Climate action projects", earned: false },
// ]

const SDGActionPlatform = () => {
  const [problems, setProblems] = useState([])
  const [selectedGoal, setSelectedGoal] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    problemTitle: "",
    problemDescription: "",
    solution: "",
    goalId: "",
    mediaFiles: [],
  })

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsAdmin(userData.role === "admin")
    }
    fetchProblems()
  }, [])

  const fetchProblems = async () => {
    try {
      setLoading(true)
      // Fetch approved submissions for public view
      const approvedSubmissions = await fetchProblemSubmissions("approved")

      // Transform data to match component structure
      const transformedProblems = approvedSubmissions.map((submission) => ({
        id: submission.id,
        title: submission.title,
        description: submission.description,
        goalId: submission.goalId,
        author: submission.author,
        authorId: submission.authorId,
        status: submission.status,
        solutions: submission.solutions.length,
        createdAt: new Date(submission.createdAt).toLocaleDateString(),
        hasMedia: submission.hasMedia,
        mediaFiles: submission.mediaFiles,
        location: submission.location,
        urgency: submission.urgency,
      }))

      setProblems(transformedProblems)
    } catch (error) {
      console.error("Error fetching problems:", error)
      // Keep empty array on error
      setProblems([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesGoal = selectedGoal === "all" || problem.goalId === Number.parseInt(selectedGoal)
    const matchesSearch =
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesGoal && matchesSearch && problem.status === "approved"
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!user) {
        alert("Please log in to submit an action")
        return
      }

      const submissionData = {
        title: formData.problemTitle,
        description: formData.problemDescription,
        goalId: formData.goalId,
        author: user.name,
        authorEmail: user.email,
        authorId: user.id || localStorage.getItem("userId"),
        solution: formData.solution,
        mediaFiles: formData.mediaFiles,
        status: "pending",
      }

      await createProblemSubmission(submissionData)

      setIsSubmissionOpen(false)
      setFormData({
        problemTitle: "",
        problemDescription: "",
        solution: "",
        goalId: "",
        mediaFiles: [],
      })

      setSubmissionSuccess(true)
      setTimeout(() => setSubmissionSuccess(false), 8000)

      // Don't refresh immediately as submission needs admin approval
    } catch (error) {
      console.error("Error submitting:", error)
      alert("Error submitting your action. Please try again.")
    }
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
    }))
  }

  const getGoalById = (id) => sdgGoals.find((goal) => goal.id === id)

  // Add this useEffect after the existing ones
  useEffect(() => {
    // Refresh problems every 30 seconds to show newly approved submissions
    const interval = setInterval(() => {
      if (!isSubmissionOpen) {
        fetchProblems()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isSubmissionOpen])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SDG Actions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 pt-20">
      {/* Success Message */}
      {submissionSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-white border border-emerald-200 rounded-lg shadow-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">✓</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-emerald-800 mb-1">Submission Received! 🎉</h4>
                <p className="text-emerald-700 text-sm mb-2">
                  Your SDG action has been submitted for review. Our admin team will review it shortly.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="text-xs bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors"
                  >
                    Track Status
                  </button>
                  <button
                    onClick={() => setSubmissionSuccess(false)}
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-emerald-800">SDG Action Hub</h1>
              <p className="text-emerald-600 mt-1">Share problems, propose solutions, create impact together</p>
              {user && (
                <div className="mt-3 p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-emerald-800 font-medium">Welcome back, {user.name}! 🌟</p>
                      <p className="text-emerald-700 text-sm">
                        Track your submissions, view community impact, and discover new ways to contribute.{" "}
                        <button
                          onClick={() => (window.location.href = "/dashboard")}
                          className="underline font-medium hover:text-emerald-800 transition-colors"
                        >
                          Visit your personal dashboard →
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  />
                </div>

                <select
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="px-3 py-2 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                >
                  <option value="all">All Goals</option>
                  {sdgGoals.map((goal) => (
                    <option key={goal.id} value={goal.id.toString()}>
                      {goal.icon} {goal.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsSubmissionOpen(true)}
                className="bg-emerald-600 w-40 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Submit Action
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-emerald-800">Community Problems & Solutions</h2>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                  {filteredProblems.length} problems found
                </span>
              </div>

              {filteredProblems.length === 0 ? (
                <div className="text-center py-12 bg-white/70 backdrop-blur-sm rounded-lg shadow-md">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No problems found</h3>
                  <p className="text-gray-500 mb-4">
                    Be the first to share a problem and inspire solutions in your community!
                  </p>
                  <button
                    onClick={() => setIsSubmissionOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-md transition-colors"
                  >
                    Submit First Problem
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProblems.map((problem) => (
                    <EnhancedSubmissionCard
                      key={problem.id}
                      problem={problem}
                      onTakeAction={(problem) => {
                        // Store problem context and navigate to take action
                        localStorage.setItem("actionContext", JSON.stringify(problem))
                        window.location.href = "/take-action"
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Status Card */}
            {user && (
              <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">Your Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Submissions</span>
                    <button
                      onClick={() => (window.location.href = "/dashboard")}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium underline"
                    >
                      View Dashboard
                    </button>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-700">🌟</p>
                    <p className="text-sm text-emerald-600 mt-1">Keep making a difference!</p>
                  </div>
                </div>
              </div>
            )}

            {/* User Badges */}
            {/* <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Impact Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {userBadges.map((badge) => (
                  <div
                    key={badge.name}
                    className={`p-3 rounded-lg text-center transition-all ${
                      badge.earned
                        ? "bg-emerald-100 border-2 border-emerald-300"
                        : "bg-gray-100 border-2 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-medium text-emerald-800">{badge.name}</div>
                    <div className="text-xs text-emerald-600 mt-1">{badge.description}</div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* SDG Goals Quick Reference */}
            {/* <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-emerald-800 mb-4">SDG Goals</h3>
              <div className="grid grid-cols-3 gap-2">
                {sdgGoals.slice(0, 9).map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id.toString())}
                    className={`p-2 rounded-lg text-center transition-all hover:scale-105 ${
                      selectedGoal === goal.id.toString()
                        ? "bg-emerald-100 border-2 border-emerald-400"
                        : "bg-white border border-gray-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="text-lg">{goal.icon}</div>
                    <div className="text-xs font-medium text-emerald-800 mt-1">{goal.id}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedGoal("all")}
                className="w-full mt-3 px-4 py-2 border border-emerald-200 text-emerald-600 bg-transparent rounded-md hover:bg-emerald-50 transition-colors"
              >
                View All Goals
              </button>
            </div> */}

            {/* Community Stats */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Community Impact</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Problems Identified</span>
                  <span className="font-bold">{problems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Solutions Proposed</span>
                  <span className="font-bold">{problems.reduce((acc, p) => acc + p.solutions, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actions Taken</span>
                  <span className="font-bold">45</span>
                </div>
                <hr className="border-white/20" />
                <div className="flex justify-between font-bold">
                  <span>Lives Impacted</span>
                  <span>2,340+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {isSubmissionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-emerald-800">Submit Your SDG Action</h2>
                  <p className="text-gray-600">Share a problem you've identified or a solution you want to implement</p>
                </div>
                <button onClick={() => setIsSubmissionOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem Title *</label>
                  <input
                    type="text"
                    value={formData.problemTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, problemTitle: e.target.value }))}
                    placeholder="Describe the problem in one line"
                    required
                    className="w-full px-3 py-2 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description *</label>
                  <textarea
                    value={formData.problemDescription}
                    onChange={(e) => setFormData((prev) => ({ ...prev, problemDescription: e.target.value }))}
                    placeholder="Provide detailed description of the problem..."
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related SDG Goal *</label>
                  <select
                    value={formData.goalId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, goalId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  >
                    <option value="">Select the most relevant SDG goal</option>
                    {sdgGoals.map((goal) => (
                      <option key={goal.id} value={goal.id.toString()}>
                        {goal.icon} Goal {goal.id}: {goal.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Solution (Optional)</label>
                  <textarea
                    value={formData.solution}
                    onChange={(e) => setFormData((prev) => ({ ...prev, solution: e.target.value }))}
                    placeholder="Describe your proposed solution or action plan..."
                    rows={4}
                    className="w-full px-3 py-2 border border-emerald-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Proof/Media (Optional)</label>
                  <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label htmlFor="media-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex gap-2">
                          <Camera className="h-8 w-8 text-emerald-400" />
                          <Video className="h-8 w-8 text-emerald-400" />
                        </div>
                        <p className="text-emerald-600">Click to upload images or videos</p>
                        <p className="text-sm text-emerald-500">Show your action in progress!</p>
                      </div>
                    </label>
                  </div>
                  {formData.mediaFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-emerald-600">{formData.mediaFiles.length} file(s) selected</p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-500 text-xl">ℹ️</div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">What happens next?</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Your submission will be reviewed by our admin team</li>
                        <li>• You'll receive an email notification about the approval status</li>
                        <li>• Approved submissions will appear on this public page</li>
                        <li>• Track your submission status on your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 w-50 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Submit Action
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubmissionOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SDGActionPlatform
