/* eslint-disable react/prop-types */
"use client"

import { motion } from "framer-motion"

const LockedBadgeIcon = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl",
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-gray-300 to-gray-500 
        flex items-center justify-center shadow-lg border-2 border-gray-200 opacity-40 ${className}`}
      initial={{ opacity: 0.2 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 0.5 }}
    >
      <span className="text-gray-600">🔒</span>
    </motion.div>
  )
}

export default LockedBadgeIcon
