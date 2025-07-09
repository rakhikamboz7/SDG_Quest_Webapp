"use client"

import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated()) {
        navigate("/admin-dashboard")
        return
      }

      // ✅ SECURE: Check admin role from server-verified user data
      if (adminOnly && !isAdmin()) {
        navigate("/admin-dashboard") // Redirect non-admins to regular dashboard
        return
      }
    }
  }, [user, loading, navigate, adminOnly, isAuthenticated, isAdmin])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return null
  }

  if (adminOnly && !isAdmin()) {
    return null
  }

  return children
}

export default ProtectedRoute
