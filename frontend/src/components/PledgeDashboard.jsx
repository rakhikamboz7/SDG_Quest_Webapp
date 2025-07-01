"use client"

import { useState, useEffect } from "react"
import { Calendar, Target, CheckCircle, Flame, Award, Plus } from "lucide-react"
import { fetchUserPledges, updatePledgeProgress } from "../lib/sanity"

const PledgeDashboard = ({ userId, userName }) => {
  const [pledges, setPledges] = useState([])
  const [loading, setLoading] = useState(true)

  const goalTypeIcons = {
    plastic: "♻️",
    energy: "⚡",
    transport: "🚗",
    food: "🍽️",
    water: "💧",
    waste: "🗑️",
    community: "🤝",
    other: "🌱",
  }

  const goalTypeColors = {
    plastic: "bg-blue-100 text-blue-800 border-blue-200",
    energy: "bg-yellow-100 text-yellow-800 border-yellow-200",
    transport: "bg-green-100 text-green-800 border-green-200",
    food: "bg-orange-100 text-orange-800 border-orange-200",
    water: "bg-cyan-100 text-cyan-800 border-cyan-200",
    waste: "bg-gray-100 text-gray-800 border-gray-200",
    community: "bg-purple-100 text-purple-800 border-purple-200",
    other: "bg-emerald-100 text-emerald-800 border-emerald-200",
  }

  useEffect(() => {
    if (userId) {
      loadPledges()
    }
  }, [userId])

  const loadPledges = async () => {
    try {
      setLoading(true)
      const userPledges = await fetchUserPledges(userId)
      setPledges(userPledges)
    } catch (error) {
      console.error("Error loading pledges:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkProgress = async (pledgeId) => {
    try {
      await updatePledgeProgress(pledgeId, {
        note: "Completed today",
      })
      loadPledges() // Refresh pledges
      alert("Great job! Progress marked for today 🎉")
    } catch (error) {
      console.error("Error updating progress:", error)
      alert("Error updating progress. Please try again.")
    }
  }

  const calculateProgress = (pledge) => {
    return Math.min((pledge.currentProgress / pledge.targetValue) * 100, 100)
  }

  const getStreakDays = (pledge) => {
    if (!pledge.progressLog || pledge.progressLog.length === 0) return 0

    const today = new Date().toISOString().split("T")[0]
    let streak = 0
    const currentDate = new Date(today)

    for (let i = 0; i < 30; i++) {
      // Check last 30 days
      const dateStr = currentDate.toISOString().split("T")[0]
      const hasProgress = pledge.progressLog.some((log) => log.date === dateStr && log.completed)

      if (hasProgress) {
        streak++
      } else if (streak > 0) {
        break
      }

      currentDate.setDate(currentDate.getDate() - 1)
    }

    return streak
  }

  const canMarkToday = (pledge) => {
    const today = new Date().toISOString().split("T")[0]
    return !pledge.progressLog?.some((log) => log.date === today && log.completed)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200"
      case "active":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "paused":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "failed":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your pledges...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Target className="h-6 w-6 text-emerald-600" />
          Your Pledges ({pledges.length})
        </h3>
        <button
          onClick={() => (window.location.href = "/take-action")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Pledge
        </button>
      </div>

      {pledges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pledges.map((pledge) => {
            const progress = calculateProgress(pledge)
            const streak = getStreakDays(pledge)
            const canMark = canMarkToday(pledge)

            return (
              <div key={pledge._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{goalTypeIcons[pledge.goalType]}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${goalTypeColors[pledge.goalType]}`}
                      >
                        {pledge.goalType.charAt(0).toUpperCase() + pledge.goalType.slice(1)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{pledge.title}</h4>
                    <p className="text-gray-600 text-sm line-clamp-2">{pledge.description}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(pledge.status)}`}
                  >
                    {pledge.status.charAt(0).toUpperCase() + pledge.status.slice(1)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm text-gray-600">
                      {pledge.currentProgress} / {pledge.targetValue} {pledge.frequency}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        progress === 100 ? "bg-green-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                      <Flame className="h-4 w-4" />
                      <span className="font-bold">{streak}</span>
                    </div>
                    <div className="text-xs text-gray-500">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                      <Calendar className="h-4 w-4" />
                      <span className="font-bold">
                        {Math.ceil((new Date(pledge.endDate) - new Date()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Days Left</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                      <Award className="h-4 w-4" />
                      <span className="font-bold">{pledge.likes || 0}</span>
                    </div>
                    <div className="text-xs text-gray-500">Likes</div>
                  </div>
                </div>

                {/* Action Button */}
                {pledge.status === "active" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMarkProgress(pledge._id)}
                      disabled={!canMark}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        canMark
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {canMark ? (
                        <>
                          <CheckCircle className="h-4 w-4 inline mr-2" />
                          Mark Done Today
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 inline mr-2" />
                          Completed Today ✓
                        </>
                      )}
                    </button>
                  </div>
                )}

                {pledge.status === "completed" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <div className="text-green-800 font-medium text-sm">Pledge Completed! 🎉</div>
                    <div className="text-green-600 text-xs">Great job on achieving your goal!</div>
                  </div>
                )}

                {/* Motivation */}
                {pledge.motivation && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-800 text-sm font-medium mb-1">Your Motivation:</div>
                    <div className="text-blue-700 text-sm italic">"{pledge.motivation}"</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pledges Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start your sustainability journey by creating your first pledge. Set goals, track progress, and make a
            positive impact!
          </p>
          <button
            onClick={() => (window.location.href = "/take-action")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Create Your First Pledge
          </button>
        </div>
      )}
    </div>
  )
}

export default PledgeDashboard
