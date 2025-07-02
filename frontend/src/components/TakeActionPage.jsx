"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CheckCircle, Lightbulb, Droplets, Car, Utensils, Recycle } from "lucide-react"
import { createPledge } from "../lib/sanity"
import { AuthContext } from "../context/AuthContext"

const TakeActionPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = (AuthContext)
  const [currentStep, setCurrentStep] = useState("assessment")
  const [assessmentData, setAssessmentData] = useState({})
  const [recommendations, setRecommendations] = useState([])
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [pledgeData, setPledgeData] = useState({
    title: "",
    description: "",
    goalType: "",
    frequency: "daily",
    targetValue: 1,
    motivation: "",
    isPublic: true,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  })

  const assessmentQuestions = [
    {
      id: "food",
      title: "Food & Consumption",
      icon: Utensils,
      question: "How often do you consume packaged snacks or processed foods?",
      options: [
        { value: 1, label: "Rarely (1-2 times/week)", score: 10 },
        { value: 2, label: "Sometimes (3-4 times/week)", score: 6 },
        { value: 3, label: "Often (5-6 times/week)", score: 3 },
        { value: 4, label: "Daily", score: 1 },
      ],
    },
    {
      id: "energy",
      title: "Energy Usage",
      icon: Lightbulb,
      question: "How conscious are you about turning off lights and appliances?",
      options: [
        { value: 1, label: "Always turn off when not needed", score: 10 },
        { value: 2, label: "Usually remember", score: 7 },
        { value: 3, label: "Sometimes forget", score: 4 },
        { value: 4, label: "Rarely think about it", score: 1 },
      ],
    },
    {
      id: "plastic",
      title: "Plastic Usage",
      icon: Recycle,
      question: "How often do you use single-use plastic items?",
      options: [
        { value: 1, label: "Never or very rarely", score: 10 },
        { value: 2, label: "Occasionally", score: 6 },
        { value: 3, label: "Regularly", score: 3 },
        { value: 4, label: "Daily", score: 1 },
      ],
    },
    {
      id: "transport",
      title: "Transportation",
      icon: Car,
      question: "What is your primary mode of transportation?",
      options: [
        { value: 1, label: "Walking/Cycling/Public transport", score: 10 },
        { value: 2, label: "Carpool/Shared rides", score: 7 },
        { value: 3, label: "Own vehicle (efficient)", score: 4 },
        { value: 4, label: "Own vehicle (frequent use)", score: 1 },
      ],
    },
    {
      id: "water",
      title: "Water Conservation",
      icon: Droplets,
      question: "How mindful are you about water usage?",
      options: [
        { value: 1, label: "Very conscious, use water-saving methods", score: 10 },
        { value: 2, label: "Generally mindful", score: 7 },
        { value: 3, label: "Sometimes wasteful", score: 4 },
        { value: 4, label: "Not very conscious", score: 1 },
      ],
    },
  ]

  const goalTemplates = {
    food: [
      {
        title: "Reduce Packaged Snacks",
        description: "Limit packaged snacks to 1 per day",
        targetValue: 7,
        frequency: "weekly",
      },
      {
        title: "Cook at Home",
        description: "Prepare home-cooked meals instead of ordering out",
        targetValue: 5,
        frequency: "weekly",
      },
      {
        title: "Buy Local Produce",
        description: "Choose locally sourced fruits and vegetables",
        targetValue: 3,
        frequency: "weekly",
      },
    ],
    energy: [
      {
        title: "Lights Off Challenge",
        description: "Turn off all lights when leaving rooms",
        targetValue: 1,
        frequency: "daily",
      },
      {
        title: "Unplug Electronics",
        description: "Unplug devices when not in use",
        targetValue: 1,
        frequency: "daily",
      },
      {
        title: "Natural Light Hours",
        description: "Use natural light for 2+ hours daily",
        targetValue: 1,
        frequency: "daily",
      },
    ],
    plastic: [
      {
        title: "Plastic-Free Days",
        description: "Complete days without single-use plastics",
        targetValue: 3,
        frequency: "weekly",
      },
      {
        title: "Reusable Bag Usage",
        description: "Use reusable bags for all shopping",
        targetValue: 1,
        frequency: "daily",
      },
      {
        title: "Refillable Water Bottle",
        description: "Use only refillable water bottles",
        targetValue: 1,
        frequency: "daily",
      },
    ],
    transport: [
      { title: "Car-Free Days", description: "Use alternative transport methods", targetValue: 2, frequency: "weekly" },
      {
        title: "Walking/Cycling",
        description: "Walk or cycle for short distances",
        targetValue: 5,
        frequency: "weekly",
      },
      {
        title: "Public Transport",
        description: "Use public transport for longer commutes",
        targetValue: 3,
        frequency: "weekly",
      },
    ],
    water: [
      { title: "Short Showers", description: "Keep showers under 5 minutes", targetValue: 1, frequency: "daily" },
      {
        title: "Fix Water Leaks",
        description: "Check and fix any water leaks immediately",
        targetValue: 1,
        frequency: "weekly",
      },
      {
        title: "Water-Efficient Habits",
        description: "Turn off tap while brushing teeth",
        targetValue: 1,
        frequency: "daily",
      },
    ],
  }

  useEffect(() => {
    if (currentStep === "recommendations" && Object.keys(assessmentData).length > 0) {
      generateRecommendations()
    }
  }, [currentStep, assessmentData])

  const generateRecommendations = () => {
    const recs = []

    Object.entries(assessmentData).forEach(([category, response]) => {
      if (response.score <= 6) {
        const templates = goalTemplates[category] || []
        recs.push({
          category,
          score: response.score,
          icon: assessmentQuestions.find((q) => q.id === category)?.icon,
          title: assessmentQuestions.find((q) => q.id === category)?.title,
          templates: templates.slice(0, 2), // Top 2 suggestions per category
        })
      }
    })

    setRecommendations(recs.sort((a, b) => a.score - b.score))
  }

  const handleAssessmentAnswer = (questionId, option) => {
    setAssessmentData((prev) => ({
      ...prev,
      [questionId]: {
        answer: option.value,
        score: option.score,
        label: option.label,
      },
    }))
  }

  const handleGoalSelection = (category, template) => {
    setSelectedGoal({ category, ...template })
    setPledgeData((prev) => ({
      ...prev,
      title: template.title,
      description: template.description,
      goalType: category,
      frequency: template.frequency,
      targetValue: template.targetValue,
      endDate: getEndDate(template.frequency),
    }))
    setCurrentStep("pledge")
  }

  const getEndDate = (frequency) => {
    const now = new Date()
    const endDate = new Date(now)

    switch (frequency) {
      case "daily":
        endDate.setDate(now.getDate() + 30)
        break
      case "weekly":
        endDate.setDate(now.getDate() + 84) // 12 weeks
        break
      case "monthly":
        endDate.setMonth(now.getMonth() + 6)
        break
      default:
        endDate.setDate(now.getDate() + 30)
    }

    return endDate.toISOString().split("T")[0]
  }

  const handleCreatePledge = async () => {
    if (!user) {
      navigate("/pledge")
      return
    }

    try {
      const pledgePayload = {
        ...pledgeData,
        author: user.name || user.email,
        authorId: user.uid,
        authorEmail: user.email,
        relatedSDG: id ? Number.parseInt(id) : null,
      }

      await createPledge(pledgePayload)

      // Success animation and redirect
      setCurrentStep("success")
      setTimeout(() => {
        navigate("/dashboard")
      }, 3000)
    } catch (error) {
      console.error("Error creating pledge:", error)
      alert("Failed to create pledge. Please try again.")
    }
  }

  const renderAssessment = () => (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Personal Sustainability Assessment</h2>
        <p className="text-xl text-gray-600">
          Let's understand your current habits to provide personalized action suggestions
        </p>
      </motion.div>

      <div className="space-y-8">
        {assessmentQuestions.map((question, index) => {
          const IconComponent = question.icon
          const isAnswered = assessmentData[question.id]

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
                isAnswered ? "border-green-300 bg-green-50" : "border-gray-200"
              }`}
            >
              <div className="flex items-center mb-6">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 ${
                    isAnswered ? "bg-green-100" : "bg-blue-100"
                  }`}
                >
                  <IconComponent size={32} className={isAnswered ? "text-green-600" : "text-blue-600"} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{question.title}</h3>
                  <p className="text-lg text-gray-600 mt-2">{question.question}</p>
                </div>
                {isAnswered && <CheckCircle className="text-green-500 ml-auto" size={32} />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleAssessmentAnswer(question.id, option)}
                    className={`p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                      assessmentData[question.id]?.answer === option.value
                        ? "border-green-500 bg-green-100 text-green-800"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {Object.keys(assessmentData).length === assessmentQuestions.length && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-12">
          <motion.button
            onClick={() => setCurrentStep("recommendations")}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Get My Personalized Action Plan
          </motion.button>
        </motion.div>
      )}
    </div>
  )

  const renderRecommendations = () => (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Personalized Action Plan</h2>
        <p className="text-xl text-gray-600">
          Based on your assessment, here are the areas where you can make the biggest impact
        </p>
      </motion.div>

      <div className="space-y-12">
        {recommendations.map((rec, index) => {
          const IconComponent = rec.icon

          return (
            <motion.div
              key={rec.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
            >
              <div className="flex items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-100 to-orange-100 flex items-center justify-center mr-6">
                  <IconComponent size={40} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{rec.title}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-lg text-red-600 font-semibold">Priority: High</span>
                    <div className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      Score: {rec.score}/10
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rec.templates.map((template, templateIndex) => (
                  <motion.div
                    key={templateIndex}
                    className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -2 }}
                  >
                    <h4 className="text-xl font-bold text-gray-800 mb-3">{template.title}</h4>
                    <p className="text-gray-600 mb-4">{template.description}</p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Target:</span> {template.targetValue} times {template.frequency}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Duration:</span> 30+ days
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handleGoalSelection(rec.category, template)}
                      className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Choose This Goal
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <button
          onClick={() => setCurrentStep("custom")}
          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
        >
          Create Custom Goal Instead
        </button>
      </motion.div>
    </div>
  )

  const renderPledgeForm = () => (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Create Your Pledge</h2>
        <p className="text-xl text-gray-600">Commit to your goal and track your progress</p>
      </motion.div>

      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Goal Title</label>
            <input
              type="text"
              value={pledgeData.title}
              onChange={(e) => setPledgeData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Enter your goal title"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Description</label>
            <textarea
              value={pledgeData.description}
              onChange={(e) => setPledgeData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              rows={4}
              placeholder="Describe your goal in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">Frequency</label>
              <select
                value={pledgeData.frequency}
                onChange={(e) => setPledgeData((prev) => ({ ...prev, frequency: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">Target</label>
              <input
                type="number"
                value={pledgeData.targetValue}
                onChange={(e) => setPledgeData((prev) => ({ ...prev, targetValue: Number.parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                min="1"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">End Date</label>
              <input
                type="date"
                value={pledgeData.endDate}
                onChange={(e) => setPledgeData((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">Personal Motivation</label>
            <textarea
              value={pledgeData.motivation}
              onChange={(e) => setPledgeData((prev) => ({ ...prev, motivation: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              rows={3}
              placeholder="Why is this goal important to you?"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={pledgeData.isPublic}
              onChange={(e) => setPledgeData((prev) => ({ ...prev, isPublic: e.target.checked }))}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isPublic" className="text-lg text-gray-700">
              Make this pledge public to inspire others
            </label>
          </div>

          <div className="flex space-x-4 pt-6">
            <motion.button
              onClick={() => setCurrentStep("recommendations")}
              className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Back to Goals
            </motion.button>

            <motion.button
              onClick={handleCreatePledge}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create My Pledge
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle className="text-green-500" size={64} />
      </motion.div>

      <h2 className="text-4xl font-bold text-gray-800 mb-4">Pledge Created Successfully!</h2>
      <p className="text-xl text-gray-600 mb-8">
        Your commitment to sustainable living has been recorded. Track your progress in your dashboard.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-green-50 border border-green-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-green-800 mb-2">Your Pledge:</h3>
        <p className="text-green-700">{pledgeData.title}</p>
        <p className="text-sm text-green-600 mt-2">
          {pledgeData.targetValue} times {pledgeData.frequency} until {pledgeData.endDate}
        </p>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="text-lg font-medium">Back</span>
          </button>

          <div className="flex items-center space-x-4">
            {["assessment", "recommendations", "pledge", "success"].map((step, index) => (
              <div
                key={step}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  currentStep === step
                    ? "bg-blue-500"
                    : ["assessment", "recommendations", "pledge", "success"].indexOf(currentStep) > index
                      ? "bg-green-500"
                      : "bg-gray-300"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentStep === "assessment" && renderAssessment()}
          {currentStep === "recommendations" && renderRecommendations()}
          {currentStep === "pledge" && renderPledgeForm()}
          {currentStep === "success" && renderSuccess()}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TakeActionPage
