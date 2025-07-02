"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000/api"

function LoginSignup() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) setError("")
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setError("")
    setSuccess("")
  }

  const handleToggle = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  const validateForm = () => {
    if (isSignUp) {
      if (!formData.name.trim()) {
        setError("Name is required")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return false
      }
    }

    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.password.trim()) {
      setError("Password is required")
      return false
    }

    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      // ✅ SECURE: No role sent from frontend
      await axios.post(`${BACKEND_URL}/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        // ✅ No role field - users are always created as 'user'
      })

      setSuccess("Registration successful! Please sign in.")
      setTimeout(() => {
        setIsSignUp(false)
        setSuccess("")
      }, 2000)
    } catch (err) {
      console.error("Registration error:", err)
      setError(err.response?.data?.error || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const res = await axios.post(`${BACKEND_URL}/login`, {
        email: formData.email,
        password: formData.password,
      })

      const { token, userId } = res.data

      // Store auth data
      localStorage.setItem("token", token)
      localStorage.setItem("userId", userId)

      // ✅ SECURE: Get user data from protected endpoint
      const userRes = await axios.get(`${BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const userData = {
        name: userRes.data.name,
        email: userRes.data.email,
        role: userRes.data.role, // ✅ Role comes from server, not frontend
        profilePicture: userRes.data.image,
      }

      localStorage.setItem("user", JSON.stringify(userData))

      // ✅ SECURE: Role-based redirect using server-verified role
      if (userData.role === "admin") {
        navigate("/admin-dashboard")
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.response?.data?.error || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="relative bg-white w-full max-w-4xl min-h-[400px] rounded-2xl shadow-2xl overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden p-8">
          <div className="text-center mb-8">
            <div className="w-50 h-20 rounded-full flex items-center justify-center mb-6">
              <img src="/logo.svg" alt="Logo" className="w-20 h-20" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{isSignUp ? "Join SDG Quest" : "Welcome Back"}</h1>
            <p className="text-gray-600">
              {isSignUp ? "Create your account to start your journey" : "Sign in to continue your SDG journey"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
              {success}
            </div>
          )}

          <form onSubmit={isSignUp ? handleRegister : handleLogin} className="space-y-4">
            {isSignUp && (
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {isSignUp && (
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="ml-2">{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                </div>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleToggle}
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors duration-200"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </form>
        </div>

        {/* Desktop View - Similar structure with same security measures */}
        <div className="hidden md:block">
          <div className="flex h-full">
            {/* Sign In Form */}
            <div
              className={`flex flex-col items-center justify-center w-1/2 p-12 transition-opacity duration-500 ${
                isSignUp ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
              }`}
            >
              <div className="w-50 h-20 rounded-full flex items-center justify-center mb-6">
                <img src="/logo.svg" alt="Logo" className="w-20 h-20" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-gray-600 mb-8 text-center">Sign in to continue your SDG journey</p>

              {error && !isSignUp && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 w-full max-w-sm">
                  {error}
                </div>
              )}

              {success && !isSignUp && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4 w-full max-w-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
            </div>

            {/* Sign Up Form */}
            <div
              className={`flex flex-col items-center justify-center w-1/2 p-12 transition-opacity duration-500 ${
                isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="w-50 h-20 rounded-full flex items-center justify-center mb-6">
                <img src="/logo.svg" alt="Logo" className="w-20 h-20" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Join SDG Quest</h1>
              <p className="text-gray-600 mb-8 text-center">Create your account to start your journey</p>

              {error && isSignUp && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4 w-full max-w-sm">
                  {error}
                </div>
              )}

              {success && isSignUp && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4 w-full max-w-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleRegister} className="w-full max-w-sm space-y-4">
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span className="ml-2">Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>

            {/* Toggle Panel */}
            <div
              className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white flex flex-col items-center justify-center transition-transform duration-700 ease-in-out ${
                isSignUp ? "transform -translate-x-full" : ""
              }`}
            >
              <div className="text-center px-8">
                <h2 className="text-3xl font-bold mb-4">{isSignUp ? "Welcome Back!" : "Hello, Friend!"}</h2>
                <p className="text-lg mb-8 opacity-90">
                  {isSignUp
                    ? "To keep connected with us please login with your personal info"
                    : "Enter your personal details and start your journey with us"}
                </p>
                <button
                  onClick={handleToggle}
                  className="border-2 border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-teal-700 transition-all duration-300"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
