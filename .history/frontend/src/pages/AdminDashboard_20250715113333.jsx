"use client"

import { useContext, useState, useEffect } from "react"
import {
  Users,
  BarChart3,
  Shield,
  LogOut,
  Plus,
  Eye,
  Check,
  X,
  Mail,
  RefreshCw,
  Calendar,
  MessageSquare,
  Home,
  Target,
  Globe,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import { fetchProblemSubmissions, updateSubmissionStatus, createProblemSubmission } from "../lib/sanity"
import axios from "axios"
import SDGContentManager from "../components/sdg-content-manager"

const PRIMARY_COLOR = "#005a54"
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL 

const AdminDashboard = () => {
  const { user, logout, token, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()

  // ✅ SECURE: Check admin role on component mount
  useEffect(() => {
    if (!isAdmin()) {
      navigate("/admin-dashboard")
      return
    }
  }, [isAdmin, navigate])

  const [activeSection, setActiveSection] = useState("dashboard")
  const [pendingSubmissions, setPendingSubmissions] = useState([])
  const [approvedSubmissions, setApprovedSubmissions] = useState([])
  const [users, setUsers] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedGoalFilter, setSelectedGoalFilter] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form state for creating new problems
  const [newProblemForm, setNewProblemForm] = useState({
    title: "",
    description: "",
    goalId: "",
    solution: "",
    mediaFiles: [],
  })

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

  const navigationItems = [
    { id: "dashboard", label: "Overview", icon: Home, description: "Dashboard overview and statistics" },
    { id: "users", label: "User Management", icon: Users, description: "Manage user accounts and permissions" },
    { id: "analytics", label: "Analytics", icon: BarChart3, description: "View platform statistics and insights" },
    { id: "sdg-content", label: "SDG Content", icon: Globe, description: "Manage SDG goals content" },
    { id: "action-management", label: "Actions", icon: Target, description: "Manage community actions" },
  ]

  useEffect(() => {
    fetchSubmissions()
    if (activeSection === "users") {
      fetchUsers()
    }
  }, [activeSection])

  // ✅ SECURE: Fetch users with authentication
  const fetchUsers = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data)
    } catch (err) {
      setError("Failed to fetch users")
      console.error("Fetch users error:", err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ SECURE: Update user role with authentication
  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(
        `${BACKEND_URL}/admin/user-role`,
        { userId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Update local state
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)))
      alert(`✅ User role updated to ${newRole}`)
    } catch (err) {
      setError("Failed to update user role")
      console.error("Update role error:", err)
      alert("❌ Failed to update user role")
    }
  }

  // ✅ SECURE: Deactivate user with authentication
  const deactivateUser = async (userId) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return

    try {
      await axios.put(
        `${BACKEND_URL}/admin/deactivate/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )

      // Update local state
      setUsers(users.map((u) => (u._id === userId ? { ...u, isActive: false } : u)))
      alert("✅ User deactivated successfully")
    } catch (err) {
      setError("Failed to deactivate user")
      console.error("Deactivate user error:", err)
      alert("❌ Failed to deactivate user")
    }
  }

  const fetchSubmissions = async () => {
    setLoading(true)
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
      setError("Failed to fetch submissions")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId) => {
    try {
      const submission = pendingSubmissions.find((s) => s.id === submissionId)
      if (!submission) {
        alert("Submission not found")
        return
      }

      await updateSubmissionStatus(submissionId, "approved")
      const updatedSubmission = { ...submission, status: "approved" }

      setPendingSubmissions((prev) => prev.filter((s) => s.id !== submissionId))
      setApprovedSubmissions((prev) => [updatedSubmission, ...prev])

      alert("✅ Submission approved successfully!")
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

      await updateSubmissionStatus(submissionId, "rejected")
      setPendingSubmissions((prev) => prev.filter((s) => s.id !== submissionId))

      alert("❌ Submission rejected successfully.")
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
        authorEmail: user?.email ,
        authorId: user?.id || "admin",
        solution: newProblemForm.solution,
        status: "approved",
        mediaFiles: newProblemForm.mediaFiles,
      }

      const result = await createProblemSubmission(newProblemData)

      const newProblem = {
        id: result._id,
        title: newProblemForm.title,
        description: newProblemForm.description,
        goalId: Number.parseInt(newProblemForm.goalId),
        author: "Admin",
        authorEmail: user?.email ,
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

  // ✅ SECURE: Logout with proper cleanup
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

  // ✅ SECURE: Only render if user is admin
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="text-gray-500" size={18} />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{user?.role}</span>
              </div>

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
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">{error}</div>}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard Overview */}
            {activeSection === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                  <p className="text-gray-600 mt-1">Monitor platform activity and manage content</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Users className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-xl font-bold text-gray-900">{users.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                        <Clock className="text-yellow-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                        <p className="text-xl font-bold text-gray-900">{pendingSubmissions.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Approved Actions</p>
                        <p className="text-xl font-bold text-gray-900">{approvedSubmissions.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <Activity className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Users</p>
                        <p className="text-xl font-bold text-gray-900">{users.filter((u) => u.isActive).length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {navigationItems.slice(1).map((item) => {
                      const IconComponent = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className="flex flex-col items-center space-y-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="text-gray-600" size={24} />
                          </div>
                          <div className="text-center">
                            <span className="font-medium text-gray-700 block text-sm">{item.label}</span>
                            <span className="text-xs text-gray-500 mt-1">{item.description}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* User Management Section */}
            {activeSection === "users" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
                  </div>
                  <button
                    onClick={fetchUsers}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors mt-4 sm:mt-0"
                    disabled={loading}
                  >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    <span>Refresh</span>
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">All Users ({users.length})</h3>
                  </div>

                  {loading ? (
                    <div className="p-6 text-center">
                      <RefreshCw className="animate-spin mx-auto mb-4" size={24} />
                      <p className="text-gray-500">Loading users...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((userItem) => (
                            <tr key={userItem._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-sm font-medium text-gray-600">
                                      {userItem.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                                    <div className="text-sm text-gray-500">{userItem.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    userItem.role === "admin"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {userItem.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    userItem.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {userItem.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(userItem.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                {userItem._id !== user?.id ? (
                                  <>
                                    <select
                                      value={userItem.role}
                                      onChange={(e) => updateUserRole(userItem._id, e.target.value)}
                                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                                    >
                                      <option value="user">User</option>
                                      <option value="admin">Admin</option>
                                    </select>

                                    {userItem.isActive && (
                                      <button
                                        onClick={() => deactivateUser(userItem._id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                      >
                                        Deactivate
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-gray-500 text-sm">Current User</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Management Section - Keep existing implementation */}
            {activeSection === "action-management" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Action Management</h2>
                    <p className="text-gray-600 mt-1">Review and manage community SDG actions</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                    <select
                      value={selectedGoalFilter}
                      onChange={(e) => setSelectedGoalFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: PRIMARY_COLOR }}
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
                      className="flex items-center space-x-2 px-4 py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      <Plus size={16} />
                      <span>Create Action</span>
                    </button>
                  </div>
                </div>

                {/* Pending Submissions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Pending Submissions ({filteredPendingSubmissions.length})</span>
                      </h3>
                      <button
                        onClick={fetchSubmissions}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={loading}
                      >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {filteredPendingSubmissions.length > 0 ? (
                      <div className="space-y-4">
                        {filteredPendingSubmissions.map((submission) => {
                          const goal = getGoalById(submission.goalId)
                          return (
                            <div
                              key={submission.id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-800 mb-1">{submission.title}</h5>
                                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{submission.description}</p>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                    {goal && (
                                      <span
                                        className="px-2 py-1 rounded text-white"
                                        style={{ backgroundColor: goal.color }}
                                      >
                                        {goal.icon} Goal {submission.goalId}
                                      </span>
                                    )}
                                    <span>By {submission.author}</span>
                                    <div className="flex items-center space-x-1">
                                      <MessageSquare size={12} />
                                      <span>{submission.solutions.length} solutions</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Calendar size={12} />
                                      <span>{submission.createdAt}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-4">
                                <button
                                  onClick={() => handleApprove(submission.id)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                                >
                                  <Check size={14} />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleReject(submission.id)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                                >
                                  <X size={14} />
                                  <span>Reject</span>
                                </button>
                                <button className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                                  <Mail size={14} />
                                  <span>Email</span>
                                </button>
                                <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors">
                                  <Eye size={14} />
                                  <span>Details</span>
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No pending submissions found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Approved Submissions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Approved Submissions ({filteredApprovedSubmissions.length})</span>
                    </h3>
                  </div>
                  <div className="p-6">
                    {filteredApprovedSubmissions.length > 0 ? (
                      <div className="space-y-4">
                        {filteredApprovedSubmissions.map((submission) => {
                          const goal = getGoalById(submission.goalId)
                          return (
                            <div key={submission.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-gray-800 mb-1">{submission.title}</h5>
                                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{submission.description}</p>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                    {goal && (
                                      <span
                                        className="px-2 py-1 rounded text-white"
                                        style={{ backgroundColor: goal.color }}
                                      >
                                        {goal.icon} Goal {submission.goalId}
                                      </span>
                                    )}
                                    <span>By {submission.author}</span>
                                    <div className="flex items-center space-x-1">
                                      <MessageSquare size={12} />
                                      <span>{submission.solutions.length} solutions</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Calendar size={12} />
                                      <span>{submission.createdAt}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-500">No approved submissions found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Section */}
            {activeSection === "analytics" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                  <p className="text-gray-600 mt-1">Platform statistics and insights</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <p className="text-gray-500">Analytics dashboard coming soon...</p>
                </div>
              </div>
            )}

            {/* SDG Content Section */}
            {activeSection === "sdg-content" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">SDG Content Management</h2>
                  <p className="text-gray-600 mt-1">Manage SDG goals and related content</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <SDGContentManager/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Problem Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Problem Statement</h3>
            <form onSubmit={handleCreateProblem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newProblemForm.title}
                  onChange={(e) => setNewProblemForm({ ...newProblemForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: PRIMARY_COLOR }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProblemForm.description}
                  onChange={(e) => setNewProblemForm({ ...newProblemForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: PRIMARY_COLOR }}
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SDG Goal</label>
                <select
                  value={newProblemForm.goalId}
                  onChange={(e) => setNewProblemForm({ ...newProblemForm, goalId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: PRIMARY_COLOR }}
                  required
                >
                  <option value="">Select a goal</option>
                  {sdgGoals.map((goal) => (
                    <option key={goal.id} value={goal.id.toString()}>
                      {goal.icon} Goal {goal.id}: {goal.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution (Optional)</label>
                <textarea
                  value={newProblemForm.solution}
                  onChange={(e) => setNewProblemForm({ ...newProblemForm, solution: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: PRIMARY_COLOR }}
                  rows={2}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 text-white py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Create Problem
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
