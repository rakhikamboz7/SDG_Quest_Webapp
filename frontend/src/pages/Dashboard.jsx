import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  ArcElement,
  Tooltip,
} from "chart.js";
import axios from "axios";
import BadgesDisplay from "../components/BadgesDisplay";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ArcElement, Tooltip);

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState("default-profile.png");
  const [uploadError, setUploadError] = useState("");
  const [quizScores, setQuizScores] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [badgesEarned, setBadgesEarned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("user");
    const userId = localStorage.getItem("userId");

    if (!storedUser || !userId) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setProfileImage(userData.profilePicture || "default-profile.png");

    // Set welcome message based on current hour
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    setWelcomeMessage(`${greeting}, ${userData.name}! 👋`);

    // Fetch quiz scores using the user's ID
    fetchScores(userId);
  }, [navigate]);

  // Fetch scores API call wrapped in useCallback to avoid unnecessary re-renders.
  const fetchScores = useCallback(async (userId) => {
    try {
      // Assumes API endpoint /scores/:userId returns { userScores: [...] }
      const res = await axios.get(`${BACKEND_URL}/api/scores/${userId}`);
      const scoresData = res.data.userScores || [];
      setQuizScores(scoresData);
      assignBadges(scoresData);
    } catch (error) {
      console.error("Error fetching scores:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Assign badges based on total quiz score
  const assignBadges = (scores) => {
    const totalPoints = scores.reduce((acc, quiz) => acc + (quiz.score || 0), 0);
    const earnedBadges = [];
    if (totalPoints >= 75) earnedBadges.push("Gold");
    if (totalPoints >= 30) earnedBadges.push("Silver");
    if (totalPoints > 0) earnedBadges.push("Bronze");
    setBadgesEarned(earnedBadges);
  };

  // Handle profile image change and update the user both locally and on the server.
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError("No file selected.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageBase64 = reader.result;
      // Update the user state and localStorage with the new profile image
      const updatedUser = { ...user, profilePicture: imageBase64 };
      setProfileImage(imageBase64);
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUploadError("");
      try {
        await axios.put(`${BACKEND_URL}/api/user/profile-picture`, {
          profilePicture: imageBase64,
        });
        console.log("Profile picture updated successfully!");
      } catch (error) {
        console.error("Error updating profile image:", error);
        setUploadError("Failed to update profile image.");
      }
    };
    reader.readAsDataURL(file);
  };

  // Logout clears user data and navigates to signup.
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    navigate("/signup");
  };

  // Compute total scores per goal (assumes 17 goals)
  const goalScores = Array(17).fill(0);
  quizScores.forEach((quiz) => {
    const goalIndex = parseInt(quiz.goalId) - 1;
    if (goalIndex >= 0 && goalIndex < 17) {
      goalScores[goalIndex] += quiz.score || 0;
    }
  });
  const quizzesData = {
    labels: Array.from({ length: 17 }, (_, i) => `Goal ${i + 1}`),
    datasets: [
      {
        label: "Total Score per Goal",
        data: goalScores,
        backgroundColor: "#008080",
      },
    ],
  };

  // Compute quiz completion data
  const completedQuizzes = quizScores.length;
  const remainingQuizzes = 17 - completedQuizzes;
  const quizCompletionData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [completedQuizzes, remainingQuizzes],
        backgroundColor: ["#008080", "#f0b100"],
      },
    ],
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-lg">
        <div className="p-6 space-y-4">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full rounded-full border-4 border-teal-700"
              />
              <label className="absolute bottom-0 right-0 bg-teal-700 p-2 rounded-full cursor-pointer">
                <input type="file" accept="image/*" onChange={handleProfileImageChange} className="hidden" />
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </label>
            </div>
            {user && (
              <>
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </>
            )}
            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors mb-2 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-teal-700">{welcomeMessage}</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your personal dashboard. Track your progress and achieve your goals!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Quizzes Progress (Grouped by Goal)
            </h3>
            <div className="h-40 md:h-64">
              <Bar
                data={quizzesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { y: { beginAtZero: true, max: 5,
                    ticks: {
                      stepSize: 1, // Ensures each tick increments by 1
                    },
                   } },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quiz Completion</h3>
            <div className="h-40 md:h-64">
              <Doughnut
                data={quizCompletionData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats and Rewards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-teal-50 rounded-lg">
                <p className="text-sm text-teal-700">Total Points</p>
                <p className="text-2xl font-bold text-teal-700">
                  {quizScores.reduce((acc, quiz) => acc + (quiz.score || 0), 0)}/{85}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">Completed Goals</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {completedQuizzes}/{17}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Rewards</h3>
            <div className="flex flex-col items-center mt-2">
              <BadgesDisplay badgesEarned={badgesEarned} quizScores={quizScores} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

