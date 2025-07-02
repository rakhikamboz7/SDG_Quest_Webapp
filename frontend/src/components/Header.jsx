"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { Menu, X, ChevronDown, Play, Target, BookOpen, Award } from "lucide-react"
import logo from "../assets/logo.svg"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000"
const PRIMARY_COLOR = "#005a54"

const Header = () => {
  const [quizScores, setQuizScores] = useState([])
  const [user, setUser] = useState(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (userId) {
          const res = await axios.get(`${BACKEND_URL}/api/scores/${userId}`)
          setQuizScores(res.data.userScores || [])
        }
      } catch (error) {
        console.error("Error fetching quiz scores:", error)
      }
    }
    fetchScores()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    setUser(null)
    navigate("/signin")
  }

  const handleStartQuiz = () => {
    const nextQuizId = quizScores.length + 1
    navigate(nextQuizId <= 17 ? `/quiz/${nextQuizId}` : "/dashboard")
  }

  const navigationItems = [
    { label: "Learn Goals", href: "/sdg-wheel", icon: BookOpen },
    { label: "Knowledge Hub", href: "/knowledge", icon: Target },
    { label: "SDG Actions", href: "/sdg-actions", icon: Award },
    { label: "Start Quiz", onClick: handleStartQuiz, icon: Play, isButton: true },
  ]

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div
                className="rounded-full flex items-center justify-center shadow-lg"
                
              >
                <img src={logo || "/placeholder.svg"} alt="SDG Quest Logo" className="w-15 h-15" />
              </div>
              <div>
                <Link to="/" className="text-2xl lg:text-3xl font-bold" style={{ color: PRIMARY_COLOR }}>
                  SDG Quest
                </Link>
                <p className="text-xs text-gray-600 hidden sm:block">Sustainable Future Starts Here</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item, index) => {
                const IconComponent = item.icon
                return item.isButton ? (
                  <motion.button
                    key={index}
                    onClick={item.onClick}
                    className="flex items-center space-x-2 px-6 py-2 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent size={18} />
                    <span>{item.label}</span>
                  </motion.button>
                ) : (
                  <motion.div key={index} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Link
                      to={item.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
                    >
                      <IconComponent size={18} />
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {!user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/signin"
                    className="hidden sm:block px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/signin"
                      className="px-6 py-2 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-500 transition-transform duration-200 ${
                        showProfileDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showProfileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>

                        {/* Mobile Navigation in Dropdown */}
                        <div className="lg:hidden py-2">
                          {navigationItems.slice(0, -1).map((item, index) => {
                            const IconComponent = item.icon
                            return (
                              <Link
                                key={index}
                                to={item.href}
                                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={() => setShowProfileDropdown(false)}
                              >
                                <IconComponent size={16} />
                                <span>{item.label}</span>
                              </Link>
                            )
                          })}
                          <button
                            onClick={() => {
                              handleStartQuiz()
                              setShowProfileDropdown(false)
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Play size={16} />
                            <span>Start Quiz</span>
                          </button>
                          <hr className="my-2" />
                        </div>

                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <Award size={16} />
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu size={24} style={{ color: PRIMARY_COLOR }} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    >
                      <img src={logo || "/placeholder.svg"} alt="Logo" className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold" style={{ color: PRIMARY_COLOR }}>
                      SDG Quest
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="space-y-4">
                  {navigationItems.map((item, index) => {
                    const IconComponent = item.icon
                    return item.isButton ? (
                      <motion.button
                        key={index}
                        onClick={() => {
                          item.onClick()
                          setIsSidebarOpen(false)
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-white rounded-lg font-medium shadow-lg"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent size={20} />
                        <span>{item.label}</span>
                      </motion.button>
                    ) : (
                      <Link
                        key={index}
                        to={item.href}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <IconComponent size={20} />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
