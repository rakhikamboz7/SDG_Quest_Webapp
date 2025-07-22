"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaCheckCircle, FaHeart, FaCopy } from "react-icons/fa"

const DonateSuccess = () => {
  const [sessionData, setSessionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const sessionId = urlParams.get("session_id")

        if (sessionId) {
          const response = await fetch(`http://localhost:5005/api/donations/session/${sessionId}`)
          if (response.ok) {
            const data = await response.json()
            setSessionData(data.session)
          }
        }
      } catch (error) {
        console.error("Error fetching session data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [])

  const shareText = `I just donated to SDG Quest! 🌍 Supporting sustainable development education for students worldwide. Join me in making a difference! #SDGQuest #Sustainability #Donation`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareOnSocial = (platform) => {
    const encodedText = encodeURIComponent(shareText)
    const url = encodeURIComponent("https://sdgquest.org")

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${url}`,
    }

    window.open(urls[platform], "_blank", "width=600,height=400")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    )
  }

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
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Go to Dashboard →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <FaCheckCircle className="text-4xl text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Thank You for Your
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                {" "}
                Generous Donation!
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your contribution will help us reach more students and create a more sustainable future for everyone.
            </p>
          </motion.div>

          {/* Donation Details */}
          {sessionData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-2xl mx-auto"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount Donated:</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₹{(sessionData.amount_total / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {sessionData.payment_status === "paid" ? "Completed" : sessionData.payment_status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium text-gray-900">{sessionData.customer_email}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm text-gray-700">{sessionData.id}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Impact Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-teal-100 to-blue-100 rounded-2xl p-8 mb-8 max-w-2xl mx-auto"
          >
            <FaHeart className="text-3xl text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Impact</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-teal-600">50+</div>
                <div className="text-sm text-gray-600">Students can access premium content</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">1 Month</div>
                <div className="text-sm text-gray-600">Server hosting covered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">17 Goals</div>
                <div className="text-sm text-gray-600">SDG content maintained</div>
              </div>
            </div>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Your Good Deed</h3>
            <p className="text-gray-600 mb-6">Inspire others to join the movement for sustainable development!</p>

            {/* Share Text */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 relative">
              <p className="text-gray-700 text-sm leading-relaxed">{shareText}</p>
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => shareOnSocial("twitter")}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Twitter
              </button>
              <button
                onClick={() => shareOnSocial("facebook")}
                className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Facebook
              </button>
              <button
                onClick={() => shareOnSocial("linkedin")}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                LinkedIn
              </button>
              <button
                onClick={() => shareOnSocial("whatsapp")}
                className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                WhatsApp
              </button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 px-8 rounded-xl font-bold hover:from-teal-600 hover:to-blue-600 transition-all duration-200"
            >
              Continue Learning
            </button>
            <button
              onClick={() => (window.location.href = "/donate")}
              className="border-2 border-teal-500 text-teal-600 py-3 px-8 rounded-xl font-bold hover:bg-teal-50 transition-all duration-200"
            >
              Donate Again
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default DonateSuccess
