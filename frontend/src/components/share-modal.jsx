/* eslint-disable react/prop-types */
"use client"

import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaFacebook, FaLinkedin, FaTwitter, FaCopy, FaCheck, FaTimes } from "react-icons/fa"
import BadgeIcon from "./badge-icon"

const ShareModal = ({ badge, isOpen, onClose, userStats }) => {
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [customMessage, setCustomMessage] = useState("")
  const [copiedLink, setCopiedLink] = useState(false)

  const getBadgeEmoji = (badge) => {
    const badgeEmojis = {
      Bronze: "🥉",
      Silver: "🥈",
      Gold: "🥇",
      Platinum: "🏆",
      Diamond: "💎",
    }
    return badgeEmojis[badge] || "🏅"
  }

  const generateEngagingMessage = (platform) => {
    const emoji = getBadgeEmoji(badge)
    // eslint-disable-next-line no-unused-vars
    const { totalPoints, completedQuizzes, userName } = userStats

    const messages = {
      linkedin: `🎉 Exciting news! I just earned the ${emoji} ${badge} Badge on SDG Quest!

Hi everyone! I'm thrilled to share that I've achieved the ${badge} Badge by completing sustainable development challenges. With ${totalPoints} points earned across ${completedQuizzes} completed goals, I'm learning so much about creating positive global impact.

💡 SDG Quest is an amazing platform where you can:
✅ Learn about the 17 Sustainable Development Goals
✅ Take interactive quizzes and earn points
✅ Unlock achievement badges like this ${emoji} ${badge} Badge
✅ Join a community working toward a better world

The journey has been incredibly rewarding, and I encourage everyone to join me in making a difference! 🌍

Ready to start your own SDG journey? Check out SDG Quest and see how many badges you can earn!

#SDGQuest #SustainableDevelopment #Achievement #GlobalGoals #MakingADifference #ProfessionalDevelopment`,

      facebook: `🎉 Hey friends! I just unlocked something amazing! ${emoji}

I earned the ${badge} Badge on SDG Quest! 🌟 This incredible platform has taught me so much about the Sustainable Development Goals while making learning fun and engaging.

So far I've:
🏆 Earned ${totalPoints} points
📚 Completed ${completedQuizzes} goal challenges  
🎯 Unlocked the ${badge} Badge!

What I love about SDG Quest:
💡 Interactive quizzes that actually teach you something valuable
🌍 Learning about real-world problems and solutions
🏅 Earning badges for your achievements (like this ${emoji} one!)
👥 Being part of a community that cares about our planet

If you're looking for a fun way to learn about sustainability and global challenges, I highly recommend giving SDG Quest a try! Who knows, you might even beat my score! 😉

Let's work together to create a better world! 🌱

#SDGQuest #SustainableGoals #Learning #Achievement #BetterWorld`,

      twitter: `🎉 Just earned the ${emoji} ${badge} Badge on SDG Quest! 

${totalPoints} points • ${completedQuizzes} goals completed • Countless lessons learned about sustainability! 🌍

SDG Quest makes learning about global challenges fun & rewarding. Ready to join the movement? 

#SDGQuest #SustainableDevelopment #Achievement #GlobalGoals #MakingADifference`,
    }

    return messages[platform] || messages.linkedin
  }

  const platforms = [
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      id: "linkedin",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      color: "bg-blue-600 hover:bg-blue-700",
      id: "facebook",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "bg-blue-400 hover:bg-blue-500",
      id: "twitter",
    },
  ]

  const handlePlatformSelect = (platformId) => {
    setSelectedPlatform(platformId)
    setCustomMessage(generateEngagingMessage(platformId))
  }

  const handleShare = () => {
    if (!selectedPlatform) return

    const appUrl = "https://sdgquest-app.com"
    const encodedMessage = encodeURIComponent(customMessage)
    const encodedUrl = encodeURIComponent(appUrl)

    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
    }

    window.open(shareUrls[selectedPlatform], "share-window", "width=600,height=500,scrollbars=yes,resizable=yes")

    // Show success message (you can replace this with your toast system)
    console.log(`Sharing your ${badge} badge achievement!`)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${customMessage}\n\nhttps://sdgquest-app.com`)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
      console.log("Share message copied successfully.")
    } catch (err) {
      console.error("Copy failed:", err)
      alert("Copy failed. Please try again.")
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-white/70 border-2 border-teal-600 bg-opacity-20 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white border-2 border-teal-400 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BadgeIcon badge={badge} size="md" />
                <div>
                  <h2 className="text-2xl font-bold">Share Your Achievement!</h2>
                  <p className="text-teal-100">Celebrate your {badge} Badge with the world</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white hover:text-teal-200 transition-colors">
                <FaTimes size={24} />
              </button>
            </div>
          </div>

          <div className="p-6">
            {!selectedPlatform ? (
              /* Platform Selection */
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose your platform</h3>
                  <p className="text-gray-600">Select where you&apos;d like to share your amazing achievement</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => {
                    const IconComponent = platform.icon
                    return (
                      <motion.button
                        key={platform.id}
                        onClick={() => handlePlatformSelect(platform.id)}
                        className={`${platform.color} text-white p-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent size={32} className="mx-auto mb-3" />
                        <p className="font-semibold">{platform.name}</p>
                        <p className="text-sm opacity-90 mt-1">Share with your {platform.name.toLowerCase()} network</p>
                      </motion.button>
                    )
                  })}
                </div>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-600 text-white p-2 rounded-full">
                      <span className="text-sm font-bold">{getBadgeEmoji(badge)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-teal-800">Your Achievement Stats</p>
                      <p className="text-sm text-teal-600">
                        {userStats.totalPoints} points • {userStats.completedQuizzes} goals completed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Message Customization */
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPlatform(null)}
                    className="text-teal-600 hover:text-teal-700 font-medium"
                  >
                    ← Back to platforms
                  </button>
                  <div className="flex items-center gap-2">
                    {platforms.find((p) => p.id === selectedPlatform) && (
                      <>
                        {React.createElement(platforms.find((p) => p.id === selectedPlatform).icon, { size: 20 })}
                        <span className="font-semibold">{platforms.find((p) => p.id === selectedPlatform).name}</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your share message (feel free to customize):
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full min-h-[200px] border border-gray-300 rounded-lg p-3 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 resize-vertical"
                    placeholder="Customize your message..."
                  />
                  <p className="text-xs text-gray-500 mt-1">{customMessage.length} characters</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleShare}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    disabled={!customMessage.trim()}
                  >
                    Share on {platforms.find((p) => p.id === selectedPlatform)?.name}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="border border-teal-300 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    {copiedLink ? <FaCheck /> : <FaCopy />}
                    {copiedLink ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ShareModal
