"use client"

import { useState, useEffect } from "react"
import { Eye, MessageSquare, Target, ThumbsUp, Heart, Star, User, Calendar, Tag, Plus, X } from "lucide-react"
import {
  fetchSolutionsForProblem,
  createSolution,
  createComment,
  fetchComments,
  createReaction,
  getReactionCounts,
} from "../lib/sanity"

const SubmissionCard = ({ problem, onTakeAction }) => {
  const [showSolutionsModal, setShowSolutionsModal] = useState(false)
  const [showSolutionForm, setShowSolutionForm] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [solutions, setSolutions] = useState([])
  const [comments, setComments] = useState([])
  const [reactions, setReactions] = useState({})
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const [solutionForm, setSolutionForm] = useState({
    title: "",
    description: "",
    implementationSteps: [],
    requiredResources: [],
    estimatedCost: "",
    timeframe: "",
    impact: "",
  })

  const [commentForm, setCommentForm] = useState({
    text: "",
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
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    loadReactions()
  }, [problem.id])

  const getGoalById = (id) => sdgGoals.find((goal) => goal.id === id)
  const goal = getGoalById(problem.goalId)

  const loadSolutions = async () => {
    try {
      setLoading(true)
      const solutionsData = await fetchSolutionsForProblem(problem.id)
      setSolutions(solutionsData)
    } catch (error) {
      console.error("Error loading solutions:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async () => {
    try {
      const commentsData = await fetchComments("problemSubmission", problem.id)
      setComments(commentsData)
    } catch (error) {
      console.error("Error loading comments:", error)
    }
  }

  const loadReactions = async () => {
    try {
      const reactionCounts = await getReactionCounts("problemSubmission", problem.id)
      setReactions(reactionCounts)
    } catch (error) {
      console.error("Error loading reactions:", error)
    }
  }

  const handleViewSolutions = () => {
    setShowSolutionsModal(true)
    loadSolutions()
  }

  const handleProvideSolution = () => {
    if (!user) {
      alert("Please log in to provide a solution")
      return
    }
    setShowSolutionForm(true)
  }

  const handleSubmitSolution = async (e) => {
    e.preventDefault()
    try {
      if (!user) {
        alert("Please log in to submit a solution")
        return
      }

      const solutionData = {
        ...solutionForm,
        problemId: problem.id,
        author: user.name,
        authorId: user.id || localStorage.getItem("userId"),
        authorEmail: user.email,
        status: "pending",
      }

      await createSolution(solutionData)
      setShowSolutionForm(false)
      setSolutionForm({
        title: "",
        description: "",
        implementationSteps: [],
        requiredResources: [],
        estimatedCost: "",
        timeframe: "",
        impact: "",
      })
      alert("Solution submitted successfully! It will be reviewed by admins.")
      loadSolutions()
    } catch (error) {
      console.error("Error submitting solution:", error)
      alert("Error submitting solution. Please try again.")
    }
  }

  const handleReaction = async (type) => {
    if (!user) {
      alert("Please log in to react")
      return
    }

    try {
      const result = await createReaction({
        type,
        userId: user.id || localStorage.getItem("userId"),
        userName: user.name,
        targetType: "problemSubmission",
        targetId: problem.id,
      })

      // Update local reaction counts
      setReactions((prev) => ({
        ...prev,
        [type]: result.action === "added" ? (prev[type] || 0) + 1 : Math.max((prev[type] || 0) - 1, 0),
      }))
    } catch (error) {
      console.error("Error creating reaction:", error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!user) {
      alert("Please log in to comment")
      return
    }

    try {
      await createComment({
        text: commentForm.text,
        author: user.name,
        authorId: user.id || localStorage.getItem("userId"),
        authorEmail: user.email,
        parentType: "problemSubmission",
        parentId: problem.id,
      })

      setCommentForm({ text: "" })
      loadComments()
    } catch (error) {
      console.error("Error submitting comment:", error)
      alert("Error submitting comment. Please try again.")
    }
  }

  const toggleComments = () => {
    setShowComments(!showComments)
    if (!showComments) {
      loadComments()
    }
  }

  return (
    <>
      <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-emerald-400 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-emerald-800 leading-tight mb-2">{problem.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{problem.description}</p>
          </div>
          {problem.hasMedia && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
              📸 Media
            </span>
          )}
        </div>

        {/* Tags and Metadata */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className={`${goal?.color} text-white text-xs px-2 py-1 rounded flex items-center gap-1`}>
            {goal?.icon} Goal {problem.goalId}
          </span>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">✅ Approved</span>
          {problem.urgency && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                problem.urgency === "high" || problem.urgency === "critical"
                  ? "bg-red-100 text-red-700"
                  : problem.urgency === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {problem.urgency} priority
            </span>
          )}
          {problem.tags &&
            problem.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
        </div>

        {/* Author and Date Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>By {problem.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{problem.solutions} solution(s)</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{problem.createdAt}</span>
            </div>
          </div>
        </div>

        {problem.location && (
          <div className="text-xs text-gray-500 mb-4 flex items-center gap-1">📍 {problem.location}</div>
        )}

        {/* Reaction Bar */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <button
            onClick={() => handleReaction("like")}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{reactions.like || 0}</span>
          </button>
          <button
            onClick={() => handleReaction("helpful")}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
          >
            <Star className="h-4 w-4" />
            <span>{reactions.helpful || 0} Helpful</span>
          </button>
          <button
            onClick={() => handleReaction("inspiring")}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            <Heart className="h-4 w-4" />
            <span>{reactions.inspiring || 0} Inspiring</span>
          </button>
          <button
            onClick={toggleComments}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-purple-600 transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length} Comments</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={handleViewSolutions}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <Eye className="h-4 w-4" />
            View Solutions
          </button>
          <button
            onClick={handleProvideSolution}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Provide Solution
          </button>
          <button
            onClick={() => onTakeAction(problem)}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <Target className="h-4 w-4" />
            Take Action
          </button>
          <button
            onClick={toggleComments}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            Comment
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-800 mb-4">Comments</h4>

            {/* Comment Form */}
            {user && (
              <form onSubmit={handleComment} className="mb-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentForm.text}
                      onChange={(e) => setCommentForm({ text: e.target.value })}
                      placeholder="Share your thoughts..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!commentForm.text.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-4 py-1 rounded-md text-sm transition-colors"
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="font-medium text-sm text-gray-800">{comment.author}</div>
                      <div className="text-sm text-gray-600 mt-1">{comment.text}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(comment._createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No comments yet. Be the first to share your thoughts!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Solutions Modal */}
      {showSolutionsModal && (
        <div className="fixed inset-0 bg-white/70 bg-opacity-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border-2 border-teal-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Solutions for: {problem.title}</h2>
                <button onClick={() => setShowSolutionsModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading solutions...</p>
                </div>
              ) : solutions.length > 0 ? (
                <div className="space-y-4">
                  {solutions.map((solution) => (
                    <div key={solution._id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{solution.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{solution.description}</p>

                      {solution.implementationSteps && solution.implementationSteps.length > 0 && (
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-700 text-sm mb-1">Implementation Steps:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {solution.implementationSteps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>By {solution.author}</span>
                        <div className="flex items-center gap-4">
                          {solution.estimatedCost && <span>Cost: {solution.estimatedCost}</span>}
                          {solution.timeframe && <span>Time: {solution.timeframe}</span>}
                          <span>👍 {solution.votes || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No solutions yet</h3>
                  <p className="text-gray-500 mb-4">Be the first to provide a solution for this problem!</p>
                  <button
                    onClick={() => {
                      setShowSolutionsModal(false)
                      handleProvideSolution()
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Provide Solution
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Solution Form Modal */}
      {showSolutionForm && (
        <div className="fixed inset-0 bg-white/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-teal-500 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Provide Solution</h2>
                <button onClick={() => setShowSolutionForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitSolution} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Solution Title *</label>
                  <input
                    type="text"
                    value={solutionForm.title}
                    onChange={(e) => setSolutionForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Brief title for your solution"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Solution Description *</label>
                  <textarea
                    value={solutionForm.description}
                    onChange={(e) => setSolutionForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your solution in detail..."
                    rows={4}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Implementation Steps</label>
                  <textarea
                    value={solutionForm.implementationSteps.join("\n")}
                    onChange={(e) =>
                      setSolutionForm((prev) => ({
                        ...prev,
                        implementationSteps: e.target.value.split("\n").filter((step) => step.trim()),
                      }))
                    }
                    placeholder="Step 1: First action to take&#10;Step 2: Second action to take&#10;Step 3: Third action to take"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter each step on a new line</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost</label>
                    <input
                      type="text"
                      value={solutionForm.estimatedCost}
                      onChange={(e) => setSolutionForm((prev) => ({ ...prev, estimatedCost: e.target.value }))}
                      placeholder="e.g., $100-500, Free, Low cost"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                    <input
                      type="text"
                      value={solutionForm.timeframe}
                      onChange={(e) => setSolutionForm((prev) => ({ ...prev, timeframe: e.target.value }))}
                      placeholder="e.g., 1 week, 1 month, Ongoing"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Impact</label>
                  <textarea
                    value={solutionForm.impact}
                    onChange={(e) => setSolutionForm((prev) => ({ ...prev, impact: e.target.value }))}
                    placeholder="What positive impact will this solution have?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Submit Solution
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSolutionForm(false)}
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
    </>
  )
}

export default SubmissionCard
