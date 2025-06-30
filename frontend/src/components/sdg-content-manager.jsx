"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit, Save, X, Eye, Trash2, AlertCircle, CheckCircle, Shield } from "lucide-react"
import { client, getSDGGoals, testPermissions } from "../lib/sanity"

const SDGContentManager = () => {
  const [goals, setGoals] = useState([])
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [permissionsChecked, setPermissionsChecked] = useState(false)

  useEffect(() => {
    checkPermissionsAndLoad()
  }, [])

  const checkPermissionsAndLoad = async () => {
    try {
      setLoading(true)
      // Test permissions first
      await testPermissions()
      setPermissionsChecked(true)
      showMessage("success", "✅ Sanity connection successful!")
      // Load goals
      await loadGoals()
    } catch (error) {
      console.error("Permission/connection error:", error)
      if (error.message.includes("Insufficient permissions")) {
        showMessage("error", "❌ API token lacks required permissions. Please use an Editor token.")
      } else if (error.message.includes("Invalid token")) {
        showMessage("error", "❌ Invalid API token. Please check your SANITY_API_TOKEN.")
      } else {
        showMessage("error", "❌ Failed to connect to Sanity. Check your configuration.")
      }
      setPermissionsChecked(false)
    } finally {
      setLoading(false)
    }
  }

  const loadGoals = async () => {
    try {
      const fetchedGoals = await getSDGGoals()
      setGoals(fetchedGoals)
    } catch (error) {
      console.error("Error loading goals:", error)
      showMessage("error", "Failed to load SDG goals")
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 8000)
  }

  const handleSaveGoal = async (goalData) => {
    if (!permissionsChecked) {
      showMessage("error", "❌ Insufficient permissions to save goals")
      return
    }

    try {
      setSaving(true)
      console.log("Saving goal data:", goalData)

      // Handle image uploads
      let iconAsset = goalData.icon
      let heroImageAsset = goalData.heroImage

      // Upload icon if it's a file
      if (goalData.icon && goalData.icon instanceof File) {
        try {
          console.log("Uploading icon...")
          const uploadedIcon = await client.assets.upload("image", goalData.icon, {
            filename: `goal-${goalData.goalNumber}-icon.${goalData.icon.name.split(".").pop()}`,
          })
          iconAsset = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploadedIcon._id,
            },
          }
          console.log("Icon uploaded successfully:", uploadedIcon)
        } catch (error) {
          console.error("Error uploading icon:", error)
          showMessage("error", `❌ Failed to upload icon: ${error.message}`)
          return
        }
      }

      // Upload hero image if it's a file
      if (goalData.heroImage && goalData.heroImage instanceof File) {
        try {
          console.log("Uploading hero image...")
          const uploadedHero = await client.assets.upload("image", goalData.heroImage, {
            filename: `goal-${goalData.goalNumber}-hero.${goalData.heroImage.name.split(".").pop()}`,
          })
          heroImageAsset = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: uploadedHero._id,
            },
          }
          console.log("Hero image uploaded successfully:", uploadedHero)
        } catch (error) {
          console.error("Error uploading hero image:", error)
          showMessage("error", `❌ Failed to upload hero image: ${error.message}`)
          return
        }
      }

      // Clean the data before saving
      const cleanData = {
        goalNumber: goalData.goalNumber,
        title: goalData.title || "",
        shortDescription: goalData.shortDescription || "",
        overview: goalData.overview || "",
        color: goalData.color || "#000000",
        knowledgeBite: goalData.knowledgeBite || "",
        keyPoints: goalData.keyPoints || [],
        videos: goalData.videos || [],
        resources: goalData.resources || [],
        published: goalData.published || false,
      }

      // Add image references if they exist
      if (iconAsset && typeof iconAsset === "object") {
        cleanData.icon = iconAsset
      }

      if (heroImageAsset && typeof heroImageAsset === "object") {
        cleanData.heroImage = heroImageAsset
      }

      console.log("Clean data to save:", cleanData)

      if (goalData._id) {
        // Update existing goal
        const result = await client.patch(goalData._id).set(cleanData).commit()
        console.log("Goal updated:", result)
        showMessage("success", "✅ Goal updated successfully!")
      } else {
        // Create new goal
        const result = await client.create({
          _type: "sdgGoal",
          ...cleanData,
        })
        console.log("Goal created:", result)
        showMessage("success", "✅ Goal created successfully!")
      }

      await loadGoals()
      setIsEditing(false)
      setSelectedGoal(null)
    } catch (error) {
      console.error("Error saving goal:", error)
      if (error.message.includes("Insufficient permissions") || error.message.includes("permission")) {
        showMessage("error", "❌ Insufficient permissions. Please check your API token has Editor/Admin rights.")
      } else {
        showMessage("error", `❌ Failed to save goal: ${error.message}`)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGoal = async (goalId) => {
    if (!permissionsChecked) {
      showMessage("error", "❌ Insufficient permissions to delete goals")
      return
    }

    if (!window.confirm("Are you sure you want to delete this goal?")) return

    try {
      await client.delete(goalId)
      showMessage("success", "✅ Goal deleted successfully!")
      await loadGoals()
      setSelectedGoal(null)
    } catch (error) {
      console.error("Error deleting goal:", error)
      if (error.message.includes("Insufficient permissions")) {
        showMessage("error", "❌ Insufficient permissions to delete goals")
      } else {
        showMessage("error", `❌ Failed to delete goal: ${error.message}`)
      }
    }
  }

  const createNewGoal = () => {
    if (!permissionsChecked) {
      showMessage("error", "❌ Insufficient permissions to create goals")
      return
    }

    const newGoal = {
      goalNumber: goals.length + 1,
      title: "",
      shortDescription: "",
      overview: "",
      color: "#000000",
      knowledgeBite: "",
      keyPoints: [""],
      videos: [],
      resources: [],
      published: false,
    }

    setSelectedGoal(newGoal)
    setIsEditing(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Connecting to Sanity CMS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">SDG Content Management</h2>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-gray-600">Manage Sustainable Development Goals content and resources</p>
              {permissionsChecked ? (
                <div className="flex items-center space-x-1 text-green-600">
                  <Shield size={16} />
                  <span className="text-sm">Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertCircle size={16} />
                  <span className="text-sm">Permission Error</span>
                </div>
              )}
            </div>
          </div>

          <motion.button
            onClick={createNewGoal}
            disabled={!permissionsChecked}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors shadow-md ${
              permissionsChecked
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            whileHover={permissionsChecked ? { scale: 1.02 } : {}}
            whileTap={permissionsChecked ? { scale: 0.98 } : {}}
          >
            <Plus size={18} className="mr-2" />
            Add New Goal
          </motion.button>
        </div>
      </div>

      {/* Permission Warning */}
      {!permissionsChecked && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-red-600 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Permission Error</h3>
              <p className="text-red-700 text-sm mt-1">
                Your Sanity API token doesn't have sufficient permissions. Please:
              </p>
              <ul className="text-red-700 text-sm mt-2 list-disc list-inside space-y-1">
                <li>Go to sanity.io/manage → Your Project → Settings → API → Tokens</li>
                <li>
                  Create a new token with <strong>Editor</strong> permissions
                </li>
                <li>Update your SANITY_API_TOKEN environment variable</li>
                <li>Restart your development server</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Message Display */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {message.type === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Goals</p>
              <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{goals.filter((g) => g.published).length}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-orange-600">{goals.filter((g) => !g.published).length}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold">📝</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion</p>
              <p className="text-2xl font-bold text-teal-600">{Math.round((goals.length / 17) * 100)}%</p>
            </div>
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-teal-600 font-bold">🎯</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Goals List */}
        <div className="xl:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">SDG Goals</h3>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{goals.length}/17</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {goals.map((goal) => (
                <motion.div
                  key={goal._id || goal.goalNumber} // Fixed: Added unique key
                  onClick={() => setSelectedGoal(goal)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                    selectedGoal?._id === goal._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: goal.color }}
                    >
                      {goal.goalNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{goal.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{goal.shortDescription}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${goal.published ? "bg-green-500" : "bg-gray-400"}`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Details/Editor */}
        <div className="xl:col-span-3">
          {selectedGoal ? (
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: selectedGoal.color }}
                    >
                      {selectedGoal.goalNumber}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedGoal.title || "New Goal"}</h2>
                      <p className="text-sm text-gray-500">{isEditing ? "Editing mode" : "View mode"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!isEditing ? (
                      <>
                        <motion.button
                          onClick={() => setIsEditing(true)}
                          disabled={!permissionsChecked}
                          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                            permissionsChecked
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-400 text-gray-200 cursor-not-allowed"
                          }`}
                          whileHover={permissionsChecked ? { scale: 1.02 } : {}}
                          whileTap={permissionsChecked ? { scale: 0.98 } : {}}
                        >
                          <Edit size={16} className="mr-2" />
                          Edit
                        </motion.button>

                        {selectedGoal._id && (
                          <motion.button
                            onClick={() => handleDeleteGoal(selectedGoal._id)}
                            disabled={!permissionsChecked}
                            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                              permissionsChecked
                                ? "bg-red-600 text-white hover:bg-red-700"
                                : "bg-gray-400 text-gray-200 cursor-not-allowed"
                            }`}
                            whileHover={permissionsChecked ? { scale: 1.02 } : {}}
                            whileTap={permissionsChecked ? { scale: 0.98 } : {}}
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete
                          </motion.button>
                        )}
                      </>
                    ) : (
                      <>
                        <motion.button
                          onClick={() => handleSaveGoal(selectedGoal)}
                          disabled={saving || !permissionsChecked}
                          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Save size={16} className="mr-2" />
                          {saving ? "Saving..." : "Save"}
                        </motion.button>

                        <motion.button
                          onClick={() => {
                            setIsEditing(false)
                            if (!selectedGoal._id) setSelectedGoal(null)
                          }}
                          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                {isEditing ? (
                  <GoalEditor goal={selectedGoal} onChange={setSelectedGoal} />
                ) : (
                  <GoalViewer goal={selectedGoal} />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Eye className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Goal</h3>
              <p className="text-gray-500">Choose a goal from the list to view or edit its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Goal Editor Component - Fixed controlled/uncontrolled inputs
const GoalEditor = ({ goal, onChange }) => {
  const updateField = (field, value) => {
    onChange({ ...goal, [field]: value })
  }

  const handleImageUpload = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      updateField(fieldName, file)
    }
  }

  const addKeyPoint = () => {
    updateField("keyPoints", [...(goal.keyPoints || []), ""])
  }

  const updateKeyPoint = (index, value) => {
    const newKeyPoints = [...(goal.keyPoints || [])]
    newKeyPoints[index] = value
    updateField("keyPoints", newKeyPoints)
  }

  const removeKeyPoint = (index) => {
    updateField(
      "keyPoints",
      (goal.keyPoints || []).filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Goal Number</label>
          <input
            type="number"
            min="1"
            max="17"
            value={goal.goalNumber || ""}
            onChange={(e) => updateField("goalNumber", Number.parseInt(e.target.value) || "")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <input
            type="color"
            value={goal.color || "#000000"}
            onChange={(e) => updateField("color", e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Goal Icon Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Goal Icon</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "icon")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {goal.icon && (
            <div className="mt-2 flex items-center space-x-2">
              <img
                src={typeof goal.icon === "string" ? goal.icon : URL.createObjectURL(goal.icon)}
                alt="Goal icon preview"
                className="w-12 h-12 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => updateField("icon", null)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Hero Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "heroImage")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {goal.heroImage && (
            <div className="mt-2 flex items-center space-x-2">
              <img
                src={typeof goal.heroImage === "string" ? goal.heroImage : URL.createObjectURL(goal.heroImage)}
                alt="Hero image preview"
                className="w-24 h-16 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => updateField("heroImage", null)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={goal.title || ""}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter goal title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
        <textarea
          value={goal.shortDescription || ""}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief description for the wheel display"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Overview</label>
        <textarea
          value={goal.overview || ""}
          onChange={(e) => updateField("overview", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Detailed overview of the goal"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Knowledge Bite</label>
        <textarea
          value={goal.knowledgeBite || ""}
          onChange={(e) => updateField("knowledgeBite", e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Interesting fact or statistic"
        />
      </div>

      {/* Key Points */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">Key Points</label>
          <button
            onClick={addKeyPoint}
            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} className="mr-1" />
            Add Point
          </button>
        </div>
        <div className="space-y-2">
          {(goal.keyPoints || []).map((point, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={point || ""}
                onChange={(e) => updateKeyPoint(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Key point ${index + 1}`}
              />
              <button
                onClick={() => removeKeyPoint(index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Published Status */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="published"
          checked={goal.published || false}
          onChange={(e) => updateField("published", e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="published" className="text-sm font-medium text-gray-700">
          Published (visible to users)
        </label>
      </div>
    </div>
  )
}

// Goal Viewer Component
const GoalViewer = ({ goal }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Goal Number:</span> {goal.goalNumber}
            </p>
            <p>
              <span className="font-medium">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  goal.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {goal.published ? "Published" : "Draft"}
              </span>
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Color</h4>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg border border-gray-300" style={{ backgroundColor: goal.color }} />
            <span className="text-sm text-gray-600">{goal.color}</span>
          </div>
        </div>
      </div>

      {/* Images Display */}
      {(goal.icon || goal.heroImage) && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goal.icon && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Goal Icon</p>
                <img
                  src={typeof goal.icon === "string" ? goal.icon : URL.createObjectURL(goal.icon)}
                  alt="Goal icon"
                  className="w-16 h-16 object-cover rounded border border-gray-200"
                />
              </div>
            )}
            {goal.heroImage && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Hero Image</p>
                <img
                  src={typeof goal.heroImage === "string" ? goal.heroImage : URL.createObjectURL(goal.heroImage)}
                  alt="Hero image"
                  className="w-32 h-20 object-cover rounded border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Short Description</h4>
        <p className="text-gray-700">{goal.shortDescription}</p>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Overview</h4>
        <p className="text-gray-700">{goal.overview}</p>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Knowledge Bite</h4>
        <p className="text-gray-700 italic">{goal.knowledgeBite}</p>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Key Points ({(goal.keyPoints || []).length})</h4>
        <ul className="space-y-1">
          {(goal.keyPoints || []).map((point, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-blue-600 font-bold text-sm mt-1">{index + 1}.</span>
              <span className="text-gray-700 text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SDGContentManager
