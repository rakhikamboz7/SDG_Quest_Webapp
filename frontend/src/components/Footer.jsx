"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, ArrowRight } from "lucide-react"
import logo from "../assets/logo.svg"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL 
const PRIMARY_COLOR = "#005a54"

const Footer = () => {
  const [quizScores, setQuizScores] = useState([])
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const userId = localStorage.getItem("userId")
        if (userId) {
          const res = await axios.get(`${BACKEND_URL}/api/scores/${userId}`)
          setQuizScores(res.data.userScores || [])
        }
      } catch (error) {
        console.error("Error fetching quiz scores:", error)
      }
    }

    fetchScores()
  }, [])

  const handleStartQuiz = (e) => {
    e.preventDefault()
    const nextQuizId = quizScores.length + 1
    navigate(nextQuizId <= 17 ? `/quiz/${nextQuizId}` : "/dashboard")
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    console.log("Newsletter subscription:", email)
    setEmail("")
    alert("Thank you for subscribing to our newsletter!")
  }

  const footerLinks = {
    platform: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Learn Goals", href: "/sdg-wheel" },
      { label: "Knowledge Hub", href: "/knowledge" },
      { label: "SDG Actions", href: "/sdg-actions" },
      { label: "Start Quiz", onClick: handleStartQuiz },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    community: [
      { label: "SDG Actions", href: "/sdg-actions" },
      { label: "Forums", href: "/forums" },
      { label: "Events", href: "/events" },
      { label: "Blog", href: "/blog" },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Compact Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold mb-2">Stay Updated with SDG Quest</h3>
              <p className="text-gray-400 text-sm">
                Get updates on sustainable development goals and community achievements.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto lg:mx-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-400 text-sm"
                  style={{ focusRingColor: PRIMARY_COLOR }}
                  required
                />
                <motion.button
                  type="submit"
                  className="px-4 py-2 text-white rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity text-sm"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Subscribe</span>
                  <ArrowRight size={16} />
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Compact Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo || "/placeholder.svg"} alt="SDG Quest Logo" className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold">SDG Quest</h2>
                <p className="text-xs text-gray-400">Sustainable Future Starts Here</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Empowering minds through interactive learning, awareness, and action towards Sustainable Development
              Goals.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail size={14} />
                <span>contact@sdgquest.org</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone size={14} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin size={14} />
                <span>Global Impact Center</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  {link.onClick ? (
                    <button
                      onClick={link.onClick}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-base font-semibold mb-3">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Compact Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-gray-400 text-xs">© {new Date().getFullYear()} SDG Quest. All rights reserved.</div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-xs">Follow us:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
                      style={{ hoverBackgroundColor: PRIMARY_COLOR }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent size={14} />
                    </motion.a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
