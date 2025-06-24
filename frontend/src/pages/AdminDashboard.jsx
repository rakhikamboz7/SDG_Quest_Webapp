"use client"

import { useContext, useState } from "react"
import { motion } from "framer-motion"
import { FaUsers, FaCog, FaChartBar, FaUserShield, FaSignOutAlt } from "react-icons/fa"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import SDGContentManager from "../components/sdg-content-manager"

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalBadges: 0,
    activeUsers: 0,
  })
  const [activeSection, setActiveSection] = useState("dashboard")

  const handleLogout = () => {
    logout()
    navigate("/auth")
  }

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
    {
      icon: FaCog,
      label: "Settings",
      path: "settings",
      description: "Configure platform settings",
    },
    {
      icon: () => <span className="text-xl">🌍</span>,
      label: "SDG Content",
      path: "sdg-content",
      description: "Manage Sustainable Development Goals content",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
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
                  { label: "Active Quizzes", value: "17", icon: FaChartBar, color: "green" },
                  { label: "Badges Awarded", value: "5,678", icon: FaUserShield, color: "purple" },
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
    </div>
  )
}

export default AdminDashboard
