"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FaHeart, FaGlobe, FaUsers, FaLeaf, FaCreditCard, FaShieldAlt } from "react-icons/fa"

const DonatePage = () => {
  const [selectedAmount, setSelectedAmount] = useState(250)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [loading, setLoading] = useState(false)
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    email: "",
    message: "",
  })

  const predefinedAmounts = [100, 250, 500, 1000, 2500]

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setIsCustom(false)
    setCustomAmount("")
  }

  const handleCustomAmount = (value) => {
    setCustomAmount(value)
    setIsCustom(true)
    setSelectedAmount(0)
  }

  const getFinalAmount = () => {
    return isCustom ? Number.parseInt(customAmount) || 0 : selectedAmount
  }

  const handleDonate = async () => {
    const amount = getFinalAmount()

    if (amount < 50) {
      alert("Minimum donation amount is ₹50")
      return
    }

    if (!donorInfo.name || !donorInfo.email) {
      alert("Please fill in your name and email")
      return
    }

    setLoading(true)

    try {
      // Updated API endpoint to match our backend route
      const response = await fetch("http://localhost:5005/api/donations/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: "inr",
          donorInfo: donorInfo,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create checkout session")
      }

      const session = await response.json()

      if (session.url) {
        // Redirect to Stripe Checkout
        window.location.href = session.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Error:", error)
      alert(`Something went wrong: ${error.message}. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  const impactStats = [
    {
      icon: FaUsers,
      title: "10,000+",
      subtitle: "Students Reached",
      color: "text-blue-600",
    },
    {
      icon: FaGlobe,
      title: "17 Goals",
      subtitle: "SDGs Covered",
      color: "text-green-600",
    },
    {
      icon: FaLeaf,
      title: "500+",
      subtitle: "Pledges Made",
      color: "text-teal-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🌍</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">SDG Quest</h1>
            </div>
            <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-800 font-medium">
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Impact & Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <div className="text-center lg:text-left">
              <motion.div
                className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-blue-100 px-4 py-2 rounded-full text-teal-700 font-medium mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaHeart className="text-red-500" />
                Support Our Mission
              </motion.div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Help Us Build a
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}
                  Sustainable Future
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Your donation helps us educate more students about the UN Sustainable Development Goals and create
                positive impact worldwide. Every contribution matters in building a better tomorrow.
              </p>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-6">
              {impactStats.map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <motion.div
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3">
                      <IconComponent className={`text-2xl ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.title}</div>
                    <div className="text-sm text-gray-600">{stat.subtitle}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Mission Statement */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Impact</h3>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Providing free, interactive education on all 17 UN Sustainable Development Goals</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Gamifying learning with badges, points, and achievement systems</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Building a community of changemakers committed to global sustainability</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Encouraging real-world action through pledges and community challenges</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Make a Donation</h2>
              <p className="text-gray-600">Choose an amount that feels right for you</p>
            </div>

            {/* Amount Selection */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount (₹)</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                        selectedAmount === amount && !isCustom
                          ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ₹{amount}
                    </motion.button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmount(e.target.value)}
                    className={`w-full py-3 px-4 border-2 rounded-xl font-medium transition-all duration-200 ${
                      isCustom ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                    min="50"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                    ₹
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum amount: ₹50</p>
              </div>

              {/* Donor Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                    className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-teal-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                    className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-teal-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message (Optional)</label>
                  <textarea
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                    className="w-full py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:border-teal-500 focus:outline-none transition-all duration-200 resize-none"
                    rows="3"
                    placeholder="Share why you're supporting us (optional)"
                  />
                </div>
              </div>

              {/* Donation Summary */}
              <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6 border border-teal-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700 font-medium">Donation Amount:</span>
                  <span className="text-2xl font-bold text-teal-700">₹{getFinalAmount()}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">🌍 Your contribution will help us:</p>
                  <ul className="space-y-1 ml-4">
                    <li>• Reach more students with SDG education</li>
                    <li>• Develop new interactive learning features</li>
                    <li>• Maintain our free platform for everyone</li>
                  </ul>
                </div>
              </div>

              {/* Donate Button */}
              <motion.button
                onClick={handleDonate}
                disabled={loading || getFinalAmount() < 50}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center gap-3"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Donate ₹{getFinalAmount()} Securely
                  </>
                )}
              </motion.button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <FaShieldAlt className="text-green-500" />
                <span>Secured by Stripe • Test Mode Active</span>
              </div>

              <div className="text-xs text-center text-gray-400">
                Use test card: 4242 4242 4242 4242 • Any future expiry • Any CVC
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DonatePage
