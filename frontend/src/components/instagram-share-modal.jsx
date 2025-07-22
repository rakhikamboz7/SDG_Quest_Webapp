"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import html2canvas from "html2canvas"
import { saveAs } from "file-saver"
import { FaInstagram, FaDownload, FaTimes, FaCopy, FaCheckCircle, FaCamera, FaShare, FaMobile } from "react-icons/fa"

const InstagramShareModal = ({ isOpen, onClose, achievement, userStats }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)
  const [copied, setCopied] = useState(false)
  const shareCardRef = useRef(null)

  // Generate share text based on achievement type
  const getShareText = () => {
    const baseText = "I just achieved something amazing on SDG Quest! 🌍"
    const hashtags = "#SDGQuest #SustainableDevelopment #GlobalGoals #ClimateAction"
    const url = "Join me at sdgquest.org 💪"

    let specificText = ""

    switch (achievement?.type) {
      case "badge":
        specificText = `🏆 Earned the "${achievement.name}" badge for ${achievement.goal}!`
        break
      case "quiz":
        specificText = `🧠 Completed the quiz for SDG Goal ${achievement.goalNumber}: ${achievement.goalName}!`
        break
      case "pledge":
        specificText = `🤝 Made a pledge for ${achievement.goalName}! Taking action for our planet!`
        break
      default:
        specificText = "🎯 Made progress on the UN Sustainable Development Goals!"
    }

    return `${baseText}\n\n${specificText}\n\n${url}\n\n${hashtags}`
  }

  const shareText = getShareText()

  // Generate Instagram-ready image
  const generateImage = async () => {
    if (!shareCardRef.current) return

    setIsGenerating(true)

    try {
      const canvas = await html2canvas(shareCardRef.current, {
        width: 1080,
        height: 1080,
        scale: 2,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
      })

      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob)
          setGeneratedImage(url)
        },
        "image/png",
        1.0,
      )
    } catch (error) {
      console.error("Error generating image:", error)
      alert("Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Download image
  const downloadImage = () => {
    if (generatedImage) {
      saveAs(generatedImage, `sdg-quest-achievement-${Date.now()}.png`)
    }
  }

  // Copy text to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  // Open Instagram app (mobile)
  const openInstagramApp = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    if (isMobile) {
      // Try to open Instagram app
      window.location.href = "instagram://camera"

      // Fallback to web version after a delay
      setTimeout(() => {
        window.open("https://www.instagram.com/", "_blank")
      }, 1000)
    } else {
      window.open("https://www.instagram.com/", "_blank")
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <FaInstagram className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Share on Instagram</h2>
                <p className="text-sm text-gray-600">Show off your achievement!</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Share Card Preview */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Achievement Card</h3>
                  <p className="text-sm text-gray-600">This is how your post will look</p>
                </div>

                {/* Share Card */}
                <div className="flex justify-center">
                  <div
                    ref={shareCardRef}
                    className="w-80 h-80 bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden"
                    style={{ aspectRatio: "1/1" }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 text-6xl">🌍</div>
                      <div className="absolute bottom-4 left-4 text-4xl">✨</div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-5">
                        🏆
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col justify-between">
                      {/* Header */}
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">
                            {achievement?.type === "badge"
                              ? "🏆"
                              : achievement?.type === "quiz"
                                ? "🧠"
                                : achievement?.type === "pledge"
                                  ? "🤝"
                                  : "🎯"}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Achievement Unlocked!</h3>
                      </div>

                      {/* Achievement Details */}
                      <div className="text-center space-y-2">
                        <div className="text-lg font-semibold">{achievement?.name || "SDG Champion"}</div>
                        <div className="text-sm opacity-90">{achievement?.goal || "Sustainable Development Goals"}</div>

                        {/* Stats */}
                        {userStats && (
                          <div className="flex justify-center gap-4 mt-4 text-xs">
                            <div className="text-center">
                              <div className="font-bold">{userStats.badges || 0}</div>
                              <div className="opacity-75">Badges</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">{userStats.score || 0}</div>
                              <div className="opacity-75">Points</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold">{userStats.level || 1}</div>
                              <div className="opacity-75">Level</div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="text-center">
                        <div className="text-sm font-medium">SDG Quest</div>
                        <div className="text-xs opacity-75">sdgquest.org</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                {!generatedImage && (
                  <button
                    onClick={generateImage}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FaCamera />
                        Generate Image
                      </>
                    )}
                  </button>
                )}

                {/* Download Button */}
                {generatedImage && (
                  <button
                    onClick={downloadImage}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    Download Image
                  </button>
                )}
              </div>

              {/* Right Column - Instructions & Actions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Share</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Generate & Download</div>
                        <div className="text-sm text-gray-600">Create your achievement image and download it</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Copy Caption</div>
                        <div className="text-sm text-gray-600">Use our pre-written caption with hashtags</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Post on Instagram</div>
                        <div className="text-sm text-gray-600">Upload the image and paste the caption</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Caption Text</h4>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <FaCheckCircle className="text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {shareText}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={openInstagramApp}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaInstagram />
                    Open Instagram
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => window.open("https://www.instagram.com/stories/camera/", "_blank")}
                      className="bg-purple-100 text-purple-700 py-2 px-4 rounded-xl font-medium hover:bg-purple-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaMobile />
                      Stories
                    </button>
                    <button
                      onClick={() => window.open("https://www.instagram.com/", "_blank")}
                      className="bg-pink-100 text-pink-700 py-2 px-4 rounded-xl font-medium hover:bg-pink-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaShare />
                      Feed Post
                    </button>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Tag @sdgquest for a chance to be featured</li>
                    <li>• Use relevant SDG hashtags for more reach</li>
                    <li>• Share to your story for 24-hour visibility</li>
                    <li>• Encourage friends to join SDG Quest</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default InstagramShareModal
