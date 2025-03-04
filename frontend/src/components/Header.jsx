import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Menu, X } from "lucide-react";
import logo from '../assets/logo.svg';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";

const Header = () => {
  const [quizScores, setQuizScores] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const res = await axios.get(`${BACKEND_URL}/api/scores/${userId}`);
          setQuizScores(res.data.userScores || []);
        }
      } catch (error) {
        console.error("Error fetching quiz scores:", error);
      }
    };
    fetchScores();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/signup");
  };

  const handleStartQuiz = () => {
    const nextQuizId = quizScores.length + 1;
    navigate(nextQuizId <= 17 ? `/quiz/${nextQuizId}` : "/profile");
  };

  return (
    <header className="bg-white p-4 w-full fixed top-0 left-0 flex justify-between items-center shadow-md z-50 md:px-8">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="SDG Quest Logo" className="h-10 w-10 mr-2" />
        <h1 className="text-[#00786F] text-2xl font-bold">
          <Link to="/">SDG Quest</Link>
        </h1>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-[#00786F]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Navigation */}
      <nav className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none flex flex-col md:flex-row items-center md:space-x-6 font-bold md:py-0 py-4 transition-all duration-300 ${isMobileMenuOpen ? "block" : "hidden md:flex"}`}>
        <Link to="/home" className="text-[#00786F] hover:text-green-800" onClick={() => setIsMobileMenuOpen(false)}>Learn Goals</Link>
        <Link to="/knowledge" className="text-[#00786F] hover:text-green-800" onClick={() => setIsMobileMenuOpen(false)}>Knowledge Bites</Link>
        <button onClick={() => { handleStartQuiz(); setIsMobileMenuOpen(false); }} className="text-[#00786F] hover:text-green-800 focus:outline-none">
          Start Quiz
        </button>
      </nav>

      {/* Profile Dropdown or Signup Button */}
      <div className="relative hidden md:flex items-center">
        {user ? (
          <div>
            <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="text-[#00786F] hover:text-gray-500 flex items-center focus:outline-none">
              {user.name}
              <svg className={`ml-2 h-4 w-4 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signup" className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-5 rounded">
            Signup
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
