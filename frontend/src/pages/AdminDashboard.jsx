"use client"

import { useContext, useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FaUsers,
  FaCog,
  FaChartBar,
  FaUserShield,
  FaSignOutAlt,
  FaPlus,
  FaEye,
  FaCheck,
  FaTimes,
  FaEnvelope,
} from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import SDGContentManager from "../components/sdg-content-manager"
import { fetchProblemSubmissions, updateSubmissionStatus, createProblemSubmission } from "../lib/sanity"
// import { sendApprovalEmail, sendRejectionEmail } from "../services/emailService"

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [pendingSubmissions, setPendingSubmissions] = useState([])
  const [approvedSubmissions, setApprovedSubmissions] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedGoalFilter, setSelectedGoalFilter] = useState("all")

  // Form state for creating new problems
  const [newProblemForm, setNewProblemForm] = useState({
    title: "",
    description: "",
    goalId: "",
    solution: "",
    mediaFiles: [],
  })

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

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      // Fetch pending submissions
      const pending = await fetchProblemSubmissions("pending")
      setPendingSubmissions(
        pending.map((sub) => ({
          id: sub.id,
          title: sub.title,
          description: sub.description,
          goalId: sub.goalId,
          author: sub.author,
          authorEmail: sub.authorEmail,
          status: sub.status,
          createdAt: new Date(sub.createdAt).toISOString().split("T")[0],
          solutions: sub.solutions || [],
        })),
      )

      // Fetch approved submissions
      const approved = await fetchProblemSubmissions("approved")
      setApprovedSubmissions(
        approved.map((sub) => ({
          id: sub.id,
          title: sub.title,
          description: sub.description,
          goalId: sub.goalId,
          author: sub.author,
          authorEmail: sub.authorEmail,
          status: sub.status,
          createdAt: new Date(sub.createdAt).toISOString().split("T")[0],
          solutions: sub.solutions || [],
        })),
      )
    } catch (error) {
      console.error("Error fetching submissions:", error)
      // Keep mock data as fallback
    }
  }

  const handleApprove = async (submissionId) => {
    try {
      const submission = pendingSubmissions.find((s) => s.id === submissionId)
      if (!submission) {
        alert("Submission not found")
        return
      }

      // Update status in Sanity
      await updateSubmissionStatus(submissionId, "approved")

      // Move from pending to approved locally
      const updatedSubmission = { ...submission, status: "approved" }
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
      setApprovedSubmissions((prev) => [updatedSubmission, ...prev])

      // Send approval email
      try {
        await sendApprovalEmail(submission)
        alert(
          "✅ Submission approved successfully! The user has been notified via email and the submission is now live on the platform.",
        )
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        alert("✅ Submission approved successfully! However, the email notification failed to send.")
      }
    } catch (error) {
      console.error("Error approving submission:", error)
      alert(`❌ Error approving submission: ${error.message}`)
    }
  }

  const handleReject = async (submissionId) => {
    try {
      const submission = pendingSubmissions.find((s) => s.id === submissionId)
      if (!submission) {
        alert("Submission not found")
        return
      }

      // Update status in Sanity
      await updateSubmissionStatus(submissionId, "rejected")

      // Remove from pending locally
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== submissionId))

      // Send rejection email
      try {
        await sendRejectionEmail(submission)
        alert("📧 Submission rejected and user has been notified via email with feedback.")
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        alert("❌ Submission rejected, but email notification failed to send.")
      }
    } catch (error) {
      console.error("Error rejecting submission:", error)
      alert(`❌ Error rejecting submission: ${error.message}`)
    }
  }

  const handleCreateProblem = async (e) => {
    e.preventDefault()
    try {
      const newProblemData = {
        title: newProblemForm.title,
        description: newProblemForm.description,
        goalId: newProblemForm.goalId,
        author: "Admin",
        authorEmail: user?.email || "admin@example.com",
        authorId: user?.id || "admin",
        solution: newProblemForm.solution,
        status: "approved", // Admin posts are auto-approved
        mediaFiles: newProblemForm.mediaFiles,
      }

      const result = await createProblemSubmission(newProblemData)

      // Add to approved list
      const newProblem = {
        id: result._id,
        title: newProblemForm.title,
        description: newProblemForm.description,
        goalId: Number.parseInt(newProblemForm.goalId),
        author: "Admin",
        authorEmail: user?.email || "admin@example.com",
        status: "approved",
        createdAt: new Date().toISOString().split("T")[0],
        solutions: [],
      }

      setApprovedSubmissions((prev) => [newProblem, ...prev])
      setIsCreateModalOpen(false)
      setNewProblemForm({
        title: "",
        description: "",
        goalId: "",
        solution: "",
        mediaFiles: [],
      })

      alert("Problem statement created successfully!")
    } catch (error) {
      console.error("Error creating problem:", error)
      alert("Error creating problem statement")
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/signin")
  }

  const getGoalById = (id) => sdgGoals.find((goal) => goal.id === id)

  const filteredPendingSubmissions =
    selectedGoalFilter === "all"
      ? pendingSubmissions
      : pendingSubmissions.filter((s) => s.goalId === Number.parseInt(selectedGoalFilter))

  const filteredApprovedSubmissions =
    selectedGoalFilter === "all"
      ? approvedSubmissions
      : approvedSubmissions.filter((s) => s.goalId === Number.parseInt(selectedGoalFilter))

  const menuItems = [
    {
      icon: FaUsers,
      label: "User Management",
      path: "users",
      description: "Manage user accounts and permissions",
    },
    {
      icon: FaChartBar,
      label: "Analytics",
      path: "analytics",
      description: "View platform statistics and insights",
    },
    // {
    //   icon: FaCog,
    //   label: "Settings",
    //   path: "settings",
    //   description: "Configure platform settings",
    // },
    {
      icon: () => <span className="text-xl">🌍</span>,
      label: "SDG Content",
      path: "sdg-content",
      description: "Manage Sustainable Development Goals content",
    },
    {
      icon: () => <span className="text-xl">📝</span>,
      label: "Action Management",
      path: "action-management",
      description: "Manage community problem statements and solutions",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">🌍</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">SDG Quest Admin</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUserShield className="text-purple-500" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaSignOutAlt />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveSection("dashboard")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSection === "dashboard"
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Dashboard Overview
                </button>
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => setActiveSection(item.path)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                      activeSection === item.path
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {typeof item.icon === "function" ? <item.icon /> : <item.icon className="text-lg" />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          {activeSection === "dashboard" && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Total Users", value: "1,234", icon: FaUsers, color: "blue" },
                  {
                    label: "Pending Actions",
                    value: pendingSubmissions.length.toString(),
                    icon: FaChartBar,
                    color: "yellow",
                  },
                  {
                    label: "Approved Actions",
                    value: approvedSubmissions.length.toString(),
                    icon: FaCheck,
                    color: "green",
                  },
                  { label: "Active Today", value: "89", icon: FaUsers, color: "teal" },
                ].map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                      className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`text-${stat.color}-600 text-xl`} />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(item.path)}
                      className="flex flex-col items-center space-y-3 p-6 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all duration-200"
                    >
                      {typeof item.icon === "function" ? (
                        <item.icon />
                      ) : (
                        <item.icon className="text-teal-600 text-2xl" />
                      )}
                      <div className="text-center">
                        <span className="font-medium text-gray-700 block">{item.label}</span>
                        <span className="text-sm text-gray-500 mt-1">{item.description}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Management Section */}
          {activeSection === "action-management" && (
            <div className="space-y-6">
              {/* Header with Create Button */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">SDG Action Management</h3>
                <div className="flex gap-4">
                  <select
                    value={selectedGoalFilter}
                    onChange={(e) => setSelectedGoalFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="all">All Goals</option>
                    {sdgGoals.map((goal) => (
                      <option key={goal.id} value={goal.id.toString()}>
                        {goal.icon} Goal {goal.id}: {goal.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                  >
                    <FaPlus />
                    Create Problem Statement
                  </button>
                </div>
              </div>

              {/* Pending Submissions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  Pending Submissions ({filteredPendingSubmissions.length})
                </h4>

                {filteredPendingSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPendingSubmissions.map((submission) => {
                      const goal = getGoalById(submission.goalId)
                      return (
                        <div
                          key={submission.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-1">{submission.title}</h5>
                              <p className="text-gray-600 text-sm mb-2">{submission.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className={`${goal?.color} text-white px-2 py-1 rounded text-xs`}>
                                  {goal?.icon} Goal {submission.goalId}
                                </span>
                                <span>By {submission.author}</span>
                                <span>{submission.solutions.length} solution(s)</span>
                                <span>{submission.createdAt}</span>
                              </div>
                            </div>
                          </div>

                          {submission.solutions.length > 0 && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-md">
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Proposed Solutions:</h6>
                              {submission.solutions.map((solution) => (
                                <div key={solution.id} className="text-sm text-gray-600">
                                  <p>• {solution.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">By {solution.author}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(submission.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                            >
                              <FaCheck />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(submission.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors"
                            >
                              <FaTimes />
                              Reject
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors">
                              <FaEnvelope />
                              Email
                            </button>
                            <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors">
                              <FaEye />
                              View Details
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">📝</div>
                    <p className="text-gray-500">No pending submissions found</p>
                  </div>
                )}
              </div>

              {/* Approved Submissions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Approved Submissions ({filteredApprovedSubmissions.length})
                </h4>

                {filteredApprovedSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredApprovedSubmissions.map((submission) => {
                      const goal = getGoalById(submission.goalId)
                      return (
                        <div key={submission.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-1">{submission.title}</h5>
                              <p className="text-gray-600 text-sm mb-2">{submission.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className={`${goal?.color} text-white px-2 py-1 rounded text-xs`}>
                                  {goal?.icon} Goal {submission.goalId}
                                </span>
                                <span>By {submission.author}</span>
                                <span>{submission.solutions.length} solution(s)</span>
                                <span>{submission.createdAt}</span>
                              </div>
                            </div>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">✅ Approved</span>
                          </div>

                          {submission.solutions.length > 0 && (
                            <div className="mb-3 p-3 bg-white rounded-md">
                              <h6 className="text-sm font-medium text-gray-700 mb-2">Solutions:</h6>
                              {/* {submission.solutions.map((solution) => (
                                <div key={solution.id} className="text-sm text-gray-600">
                                  <p>• {solution.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">By {solution.author}</p>
                                </div>
                              ))} */}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors">
                              <FaEye />
                              View Public
                            </button>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors">
                              <FaEnvelope />
                              Send Update
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">✅</div>
                    <p className="text-gray-500">No approved submissions found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SDG Content Management Section */}
          {activeSection === "sdg-content" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <SDGContentManager />
            </div>
          )}

          {/* Other Sections Placeholders */}
          {activeSection === "users" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FaUsers className="mx-auto text-gray-400 mb-4 text-4xl" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">User Management</h3>
              <p className="text-gray-500">User management functionality will be implemented here</p>
            </div>
          )}

          {activeSection === "analytics" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FaChartBar className="mx-auto text-gray-400 mb-4 text-4xl" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-500">Analytics and reporting features will be implemented here</p>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FaCog className="mx-auto text-gray-400 mb-4 text-4xl" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Platform Settings</h3>
              <p className="text-gray-500">System configuration options will be implemented here</p>
            </div>
          )}
        </motion.div>
      </main>

      {/* Create Problem Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Create Problem Statement</h2>
                  <p className="text-gray-600">Add a new problem statement for the community</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleCreateProblem} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem Title *</label>
                  <input
                    type="text"
                    value={newProblemForm.title}
                    onChange={(e) => setNewProblemForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Describe the problem in one line"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Problem Description *</label>
                  <textarea
                    value={newProblemForm.description}
                    onChange={(e) => setNewProblemForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed description of the problem..."
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Related SDG Goal *</label>
                  <select
                    value={newProblemForm.goalId}
                    onChange={(e) => setNewProblemForm((prev) => ({ ...prev, goalId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Proposed Solution (Optional)</label>
                  <textarea
                    value={newProblemForm.solution}
                    onChange={(e) => setNewProblemForm((prev) => ({ ...prev, solution: e.target.value }))}
                    placeholder="Describe a proposed solution or action plan..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Create Problem Statement
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
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

export default AdminDashboard