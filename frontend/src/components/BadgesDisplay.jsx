"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import { motion } from "framer-motion"
import { FaShare, FaTrophy } from "react-icons/fa"
import BadgeIcon from "./badge-icon"
import LockedBadgeIcon from "./locked-badge-icon"
import ShareModal from "./share-modal"

const BadgesDisplay = ({ badgesEarned, quizScores, showProgress = true, userName = "User" }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false)
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

  const userStats = {
    totalPoints,
    completedQuizzes,
    userName,
  }

  return (
    <div className="py-4">
      {badgesEarned.length > 0 ? (
        <>
          <div className="flex flex-wrap justify-center gap-4">
            {badgesEarned.map((badge, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-teal-700 border-2 hover:border-teal-200 bg-white rounded-lg">
                  <div className="p-4 text-center bg-gradient-to-b from-white to-gray-50">
                    <BadgeIcon
                      badge={badge}
                      size="md"
                      className="mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                    />
                    <p className="text-sm font-bold text-teal-700 mb-3">
                      {getBadgeEmoji(badge)} {badge} Badge
                    </p>

                    <button
                      onClick={() => handleShareClick(badge)}
                      className="bg-teal-600 hover:bg-teal-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 px-3 py-1 rounded text-sm font-medium"
                    >
                      <FaShare className="mr-2 text-xs inline" />
                      Share Achievement
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Achievement Summary */}
          <motion.div
            className="mt-6 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="text-center mb-4">
              <FaTrophy className="text-3xl text-teal-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-teal-800">Amazing Progress!</h3>
              <p className="text-teal-600">Share your achievements and inspire others to join the SDG movement</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-700">{totalPoints}</p>
                <p className="text-sm text-teal-600">Total Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-700">{badgesEarned.length}</p>
                <p className="text-sm text-teal-600">Badges Earned</p>
              </div>
            </div>

            <button
              onClick={() => handleShareClick(badgesEarned[badgesEarned.length - 1])}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <FaShare className="mr-2 inline" />
              Share Latest Achievement
            </button>
          </motion.div>
        </>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <LockedBadgeIcon size="md" className="mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-2">No badges yet!</p>
          <p className="text-sm text-gray-500">
            Complete quizzes to earn your first badge and start sharing your achievements! 🌟
          </p>
        </div>
      )}

      {showProgress && (
        <motion.div
          className="mt-6 p-4 bg-white rounded-lg shadow-lg border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-gray-700 mb-3 font-medium">{getNextBadgeHint()}</p>
          <div className="mt-2 h-3 bg-gray-200 rounded-full overflow-hidden">
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
