"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { FaTrophy, FaRocket, FaShare, FaInstagram } from "react-icons/fa"
import BadgeIcon from "./badge-icon"
import LockedBadgeIcon from "./locked-badge-icon"
import ShareModal from "./share-modal"
import InstagramShareModal from "./instagram-share-modal"

const BadgesDisplay = ({ badgesEarned, quizScores, showProgress = true, userName = "User" }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [instagramModalOpen, setInstagramModalOpen] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState(null)

  const totalPoints = quizScores.reduce((acc, quiz) => acc + quiz.score, 0)
  const completedQuizzes = quizScores.length

  const getNextBadgeHint = () => {
    if (totalPoints < 5) return `You are ${5 - totalPoints} points away from earning the 🥉 Bronze Badge!`
    if (totalPoints < 30) return `You are ${30 - totalPoints} points away from earning the 🥈 Silver Badge!`
    if (totalPoints < 75) return `You are ${75 - totalPoints} points away from earning the 🥇 Gold Badge!`
    return "Fantastic! You've unlocked all badges! 🏆"
  }

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

  const handleShareClick = (badge) => {
    setSelectedBadge(badge)
    setShareModalOpen(true)
  }

  const handleInstagramShare = (badge) => {
    setSelectedBadge(badge)
    setInstagramModalOpen(true)
  }

  const userStats = {
    totalPoints,
    completedQuizzes,
    userName,
  }

  return (
    <div className="space-y-6">
      {badgesEarned.length > 0 ? (
        <>
          {/* Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {badgesEarned.map((badge, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-teal-200 bg-gradient-to-b from-white to-gray-50 rounded-lg">
                  <div className="p-4 text-center">
                    <BadgeIcon
                      badge={badge}
                      size="md"
                      className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                    />
                    <p className="text-sm font-bold text-teal-700 mb-3">
                      {getBadgeEmoji(badge)} {badge}
                    </p>

                    {/* Share Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 space-y-2">
                      <button
                        onClick={() => handleInstagramShare(badge)}
                        className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white shadow-lg w-full px-3 py-1 rounded text-sm flex items-center justify-center gap-2"
                      >
                        <FaInstagram className="text-xs" />
                        Instagram
                      </button>
                      <button
                        onClick={() => handleShareClick(badge)}
                        className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg w-full px-3 py-1 rounded text-sm flex items-center justify-center gap-2"
                      >
                        <FaShare className="text-xs" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Achievement Summary */}
          <motion.div
            className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <FaTrophy className="text-2xl text-teal-600" />
                  <h4 className="text-lg font-bold text-teal-800">Amazing Progress!</h4>
                </div>
                <p className="text-teal-600">Share your achievements and inspire others to join the SDG movement</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-teal-100">
                  <p className="text-xl font-bold text-teal-700">{totalPoints}</p>
                  <p className="text-xs text-teal-600">Total Points</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-teal-100">
                  <p className="text-xl font-bold text-teal-700">{badgesEarned.length}</p>
                  <p className="text-xs text-teal-600">Badges</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm border border-teal-100">
                  <p className="text-xl font-bold text-teal-700">{completedQuizzes}</p>
                  <p className="text-xs text-teal-600">Goals</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                onClick={() => handleInstagramShare(badgesEarned[badgesEarned.length - 1])}
                className="flex-1 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white shadow-lg px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <FaInstagram />
                Share on Instagram
              </button>

              <button
                onClick={() => handleShareClick(badgesEarned[badgesEarned.length - 1])}
                className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <FaRocket />
                Share Achievement
              </button>
            </div>

            <p className="text-xs text-center text-teal-600 mt-2">
              ✨ Content auto-generated • Multiple platforms • Easy sharing!
            </p>
          </motion.div>
        </>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <LockedBadgeIcon size="lg" className="mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No badges yet!</h4>
          <p className="text-sm text-gray-500">
            Complete quizzes to earn your first badge and start sharing your achievements! 🌟
          </p>
        </div>
      )}

      {showProgress && (
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-gray-700 mb-3 font-medium">{getNextBadgeHint()}</p>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalPoints / 75) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">{totalPoints}/75 points earned</p>
        </motion.div>
      )}

      <ShareModal
        badge={selectedBadge}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        userStats={userStats}
      />

      <InstagramShareModal
        badge={selectedBadge}
        isOpen={instagramModalOpen}
        onClose={() => setInstagramModalOpen(false)}
        userStats={userStats}
        achievementType="badge"
      />
    </div>
  )
}

BadgesDisplay.propTypes = {
  badgesEarned: PropTypes.arrayOf(PropTypes.string).isRequired,
  quizScores: PropTypes.arrayOf(
    PropTypes.shape({
      score: PropTypes.number.isRequired,
    }),
  ).isRequired,
  showProgress: PropTypes.bool,
  userName: PropTypes.string,
}

export default BadgesDisplay
