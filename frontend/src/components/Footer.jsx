"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import { Mail, Phone, MapPin, Twitter, Facebook, Instagram, ArrowRight } from "lucide-react"
import logo from "../assets/logo.svg"

const BACKEND_URL = "http://localhost:10000"
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
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email)
    setEmail("")
    alert("Thank you for subscribing to our newsletter!")
  }

  const footerLinks = {
    platform: [
      { label: "Learn Goals", href: "/sdg-wheel" },
      { label: "Knowledge Hub", href: "/knowledge" },
      { label: "SDG Actions", href: "/sdg-actions" },
      { label: "Start Quiz", onClick: handleStartQuiz },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    support: [
      { label: "Help Center", href: "/help" },
      { label: "Community", href: "/community" },
      { label: "Documentation", href: "/docs" },
      { label: "API", href: "/api" },
    ],
  }

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Stay Updated with SDG Quest</h3>
              <p className="text-gray-400 text-lg">
                Get the latest updates on sustainable development goals, new features, and community achievements.
              </p>
            </div>
            <div>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-white placeholder-gray-400"
                  style={{ focusRingColor: PRIMARY_COLOR }}
                  required
                />
                <motion.button
                  type="submit"
                  className="px-6 py-3 text-white rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Subscribe</span>
                  <ArrowRight size={18} />
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div
                className="w-30 h-30 rounded-full flex items-center justify-center"
                
              >
                <img src={logo || "/placeholder.svg"} alt="SDG Quest Logo" className="w-48 h-48" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">SDG Quest</h2>
                <p className="text-sm text-gray-400">Sustainable Future Starts Here</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering minds through interactive learning, awareness, and action towards Sustainable Development
              Goals. Join our mission to create a better world for everyone.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} />
                <span>contact@sdgquest.org</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone size={18} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin size={18} />
                <span>Global Impact Center, Earth</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  {link.onClick ? (
                    <button
                      onClick={link.onClick}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link to={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SDG Quest. All rights reserved. Building a sustainable future together.
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
                      style={{ hoverBackgroundColor: PRIMARY_COLOR }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent size={18} />
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
