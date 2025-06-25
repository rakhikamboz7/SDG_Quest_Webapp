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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      navigate("/signin");
    };

    const handleStartQuiz = () => {
      const nextQuizId = quizScores.length + 1;
      navigate(nextQuizId <= 17 ? `/quiz/${nextQuizId}` : "/profile");
    };

    return (
      <>
        <header className="bg-white p-4 w-full fixed top-0 left-0 flex justify-between items-center shadow-lg z-50 md:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="SDG Quest Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-[#00786F] text-2xl font-bold">
              <Link to="/">SDG Quest</Link>
            </h1>
          </div>

          {/* Navigation Links for Large Screens */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/sdg-wheel" className="text-[#00786F] hover:text-green-800">Learn Goals</Link>
            <Link to="/knowledge" className="text-[#00786F] hover:text-green-800">Tips and Solutions</Link>
            <button onClick={handleStartQuiz} className="text-[#00786F] hover:text-green-800 rounded-md">
              Start Quiz
            </button>
          </nav>

          {/* Mobile Menu Button and Signup Button */}
          <div className="flex items-center">
            {/* Show Signup Button for Logged Out Users */}
            {!user ? (
              <>
                <Link to="/signin" className="bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded mr-2">
                  Signup
                </Link>
                {/* Hamburger Menu for Logged Out Users */}
                <button className="md:hidden text-[#00786F]" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu size={28} />
                </button>
              </>
            ) : (
              // User's First Letter and Profile Dropdown for Logged In Users
              <div className="relative flex items-center">
                <button onClick={() => setShowProfileDropdown(!showProfileDropdown)} className="flex items-center focus:outline-none">
                  {/* Circular styled div for the user's first letter */}
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#00786F] text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <svg className={`ml-2 h-10 w-5 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 md:mt-30 mt-60 w-48 bg-white rounded-md shadow-xl border">

                      <Link to="/sdg-wheel" className="md:hidden block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Learn Goals</Link>
                      <Link to="/knowledge" className="md:hidden block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Knowledge Bites</Link>
                      <Link to={handleStartQuiz} className="md:hidden block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Start Quiz</Link>
                  
                    <hr className="ml-2 mr-2 md:hidden shadow-xl" />
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Dashboard</Link>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Sidebar for small screens (for logged-off users only) */}
        {isSidebarOpen && !user && (
          <div className={`fixed mb-5 left-0 h-full bg-white w-64 shadow-lg z-40`}>
            <div className="flex justify-end p-4">
              <button onClick={() => setIsSidebarOpen(false)}>
                <X size={28} className="mt-20 text-[#00786F]" />
              </button>
            </div>
            <nav className="flex flex-col p-4 space-y-4">
              <Link to="/sdg-wheel" className="text-[#00786F] hover:text-green-800" onClick={() => setIsSidebarOpen(false)}>Learn Goals</Link>
              <Link to="/knowledge" className="text-[#00786F] hover:text-green-800" onClick={() => setIsSidebarOpen(false)}>Knowledge Bites</Link>
              <button onClick={() => { handleStartQuiz(); setIsSidebarOpen(false); }} className="bg-[#00786F] text-white hover:bg-green-800 rounded-md py-2">
                Start Quiz
              </button>
            </nav>
          </div>
        )}

        {/* Background Overlay when Sidebar is open */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black opacity-50 z-30" onClick={() => setIsSidebarOpen(false)}></div>
        )}
      </>
    );
  };

  export default Header;

