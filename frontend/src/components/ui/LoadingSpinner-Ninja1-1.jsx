"use client"

import { motion } from "framer-motion"
import PropTypes from "prop-types"

const LoadingSpinner = ({ size = "md", color = "teal" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  const colorClasses = {
    teal: "border-teal-500",
    blue: "border-blue-500",
    white: "border-white",
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    />
  )
}
LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  color: PropTypes.oneOf(["teal", "blue", "white"]),
}

export default LoadingSpinner

