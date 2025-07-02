import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import logo from "../assets/logo.svg"

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000"

const Footer = () => {
  const [quizScores, setQuizScores] = useState([])
  const [user, setUser] = useState(null)
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

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("userId")
    setUser(null)
    navigate("/signin")
  }

  const handleStartQuiz = (e) => {
    e.preventDefault()
    const nextQuizId = quizScores.length + 1
    navigate(nextQuizId <= 17 ? `/quiz/${nextQuizId}` : "/dashboard")
  }

  return (
    <footer className="bg-white text-teal-700 shadow-md py-6 px-4 md:px-8 lg:px-16 w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Logo & Message */}
        <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left">
          <div className="flex items-center space-x-4">
            <img src={logo} alt="SDG Logo" className="w-16 h-12 md:w-20 md:h-16 lg:w-24 lg:h-20" />
            <div>
              <h2 className="text-base md:text-lg lg:text-xl font-small">
                Learn, Maintain, Support, Uphold
              </h2>
              <p className="text-sm md:text-base lg:text-lg font-semibold mt-1">
                Start Contributing to a healthy community Today!!
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left text-sm md:text-base">
            <a href="/about" className="hover:text-green-800 transition">About</a>
            <a href="/dashboard" className="hover:text-green-800 transition">Dashboard</a>
            <a href="/contact" className="hover:text-green-800 transition">Contact Us</a>
            <a href="/sdg-wheel" className="hover:text-green-800 transition">Learn Goals</a>
            <a href="/privacy" className="hover:text-green-800 transition">Privacy Policy</a>
            <a href={`/quiz/${quizScores.length + 1}`} onClick={handleStartQuiz} className="text-[#00786F] hover:text-green-800 rounded-md">
              Play Quiz
            </a>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center md:items-end space-y-3 text-center md:text-right">
          <h3 className="text-sm md:text-lg font-semibold">Let&#39;s Chat!</h3>
          <div className="flex space-x-3 md:space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="/twitter.svg" alt="Twitter" className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 transition" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons8-facebook.svg" alt="Facebook" className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/instagram.svg" alt="Instagram" className="w-6 h-6 md:w-8 md:h-8 hover:scale-110 transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <hr className="w-full border-t border-gray-300 my-4" />
      <p className="text-xs md:text-sm text-gray-600 text-center">
        &copy; {new Date().getFullYear()} SDG Quest. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
