/* eslint-disable react/prop-types */
"use client"

import { motion } from "framer-motion"

const BadgeIcon = ({ badge, size = "md", className = "" }) => {
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

  const getBadgeColors = (badge) => {
    const colors = {
      Bronze: "from-amber-600 to-amber-800",
      Silver: "from-gray-400 to-gray-600",
      Gold: "from-yellow-400 to-yellow-600",
      Platinum: "from-purple-400 to-purple-600",
      Diamond: "from-blue-400 to-blue-600",
    }
    return colors[badge] || "from-teal-400 to-teal-600"
  }

  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl",
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${getBadgeColors(badge)} 
        flex items-center justify-center shadow-lg border-2 border-white ${className}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <span className="drop-shadow-sm">{getBadgeEmoji(badge)}</span>
    </motion.div>
  )
}

export default BadgeIcon
