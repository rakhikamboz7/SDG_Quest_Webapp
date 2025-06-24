"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FaCheck, FaExclamationTriangle, FaTimes } from "react-icons/fa"
import PropTypes from "prop-types"

const Toast = ({ message, type = "success", onClose }) => {
  const icons = {
    success: FaCheck,
    error: FaExclamationTriangle,
    warning: FaExclamationTriangle,
  }

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  }

  const IconComponent = icons[type]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-4 right-4 z-50"
      >
        <div
          className={`${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm`}
        >
          <IconComponent className="text-lg flex-shrink-0" />
          <p className="font-medium">{message}</p>
          <button onClick={onClose} className="ml-auto text-white hover:text-gray-200 transition-colors">
            <FaTimes />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning"]),
  onClose: PropTypes.func.isRequired,
}

export default Toast
