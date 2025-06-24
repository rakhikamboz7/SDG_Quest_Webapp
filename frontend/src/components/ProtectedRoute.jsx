"use client"

import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import axios from "axios"
import PropTypes from "prop-types"

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      if (!token) {
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try {
        // Set default auth header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // Verify token is valid by making a request to the server
        const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000/api"
        await axios.get(`${BACKEND_URL}/user`)

        setIsAuthenticated(true)
        setIsAdmin(user.role === "admin")
      } catch (error) {
        console.error("Auth verification failed:", error)
        // Clear invalid auth data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminRequired && !isAdmin) {
    return <Navigate to="/admin-dashboard" replace />
  }

  return children
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminRequired: PropTypes.bool
}

export default ProtectedRoute

