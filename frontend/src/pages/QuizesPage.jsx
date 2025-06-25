import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BadgesDisplay from "../components/BadgesDisplay";
import { motion, useAnimation, AnimatePresence } from "framer-motion"
const BACKEND_URL =
 import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";

 function QuizPage() {

 const { goalId } = useParams();
 const navigate = useNavigate();
 const [quizScores, setQuizScores] = useState([]); //past score store
 const [badgesEarned, setBadgesEarned] = useState([]); //
 const [quiz, setQuiz] = useState(null);
 const [loading, setLoading] = useState(true);
 const [currentQuestion, setCurrentQuestion] = useState(0);
 const [selectedOption, setSelectedOption] = useState(null);
 const [score, setScore] = useState(0);
 const [showCelebration, setShowCelebration] = useState(false);
 const [showResult, setShowResult] = useState(false);
 const [allQuizzes, setAllQuizzes] = useState([]);
 const [showPopup, setShowPopup] = useState(false);

 useEffect(() => {
 setCurrentQuestion(0);
 setSelectedOption(null);
 setScore(0);
 setShowResult(false);
 setLoading(true);
 fetchScores(); // Fetch scores when component mounts
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [goalId]);

 const assignBadges = (scores) => {
 const totalPoints = scores.reduce((acc, quiz) => acc + quiz.score, 0);
 const earnedBadges = [];
 if (totalPoints >= 75) earnedBadges.push("Gold");
 if (totalPoints >= 30) earnedBadges.push("Silver");
 if (totalPoints >= 5) earnedBadges.push("Bronze");
 return earnedBadges;
 };

 const fetchScores = async () => {
 try {
 const userId = localStorage.getItem("userId");
 const res = await axios.get(`${BACKEND_URL}/api/scores/${userId}`);
 const scores = res.data.userScores || [];
 setQuizScores(scores);
 setBadgesEarned(assignBadges(scores));
 } catch (error) {
 console.error("Error fetching scores:", error);
 }
 };

 useEffect(() => {
 const fetchQuizzes = async () => {
 try {
 const response = await axios.get(`${BACKEND_URL}/api/quizzes`);
 setAllQuizzes(response.data);

 const foundQuiz = response.data.find(
 (q) => String(q.goalId) === String(goalId)
 );
 if (foundQuiz) {
 setQuiz(foundQuiz);
 } else {
 console.log("No quiz found for goalId:", goalId);
 setQuiz(null);
 }
 } catch (error) {
 console.error("Error fetching quizzes:", error);
 } finally {
 setLoading(false);
 }
 };

 fetchQuizzes();
 }, [goalId]);

 const handleOptionSelect = (option) => {
 setSelectedOption(option);
 if (option.isCorrect) {
 setScore((prevScore) => prevScore + 1);
 }
 };

 const handleNext = async () => {
 if (quiz && currentQuestion < quiz.questions.length - 1) {
 setCurrentQuestion((prev) => prev + 1);
 setSelectedOption(null);
 } else {
 setShowResult(true);
 await saveScore(score);
 }
 };

 const saveScore = async (quizScore) => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const currentQuizIndex = allQuizzes.findIndex(
        (q) => String(q.goalId) === String(goalId)
      );

      // If user is not authenticated and tries the 2nd quiz (index 1), show popup
      if ((!token || !userId) && currentQuizIndex === 1) {
        setShowPopup(true);
        return;
      }

 const response = await axios.post(
 `${BACKEND_URL}/api/scores/submit`,
 {
 userId,
 goalId: goalId,
 quizId: quiz._id,
 score: quizScore,
 totalQuestions: quiz.questions.length,
 },
 {
 headers: {
 Authorization: `Bearer ${token}`,
 "Content-Type": "application/json",
 },
 }
 );
 console.log("Score saved successfully:", response.data);
 await fetchScores(); // Refresh scores after saving new score
 } catch (error) {
 console.error("Error saving score:", error);
//  alert("Error saving score. Please try again later.");
 }
 
};

 const handleNextQuiz = () => {
 const currentQuizIndex = allQuizzes.findIndex(
 (q) => String(q.goalId) === String(goalId)
 );
 if (currentQuizIndex !== -1 && currentQuizIndex < allQuizzes.length - 1) {
 const nextQuiz = allQuizzes[currentQuizIndex + 1];
 navigate(`/quiz/${nextQuiz.goalId}`);
 } else {
 navigate("/");
 }
 };

 if (loading) {
 return <div className="text-center p-4">Loading...</div>;
 }


 if (!quiz) {
 return (
 <div className="text-center p-4">
 <p>No quiz found for this goal.</p>
 <button
 onClick={() => navigate("/profile")}
 className="bg-teal-700 text-white px-4 py-2 rounded-lg"
 >
 Back to dashboard
 </button>
 </div>
 );
 }
  const particleVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, Math.random() * 20 - 10, 0],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        delay: Math.random() * 2,
      },
    },
  }

 return (
    
 <div className="p-4 md:p-6 lg:p-8 flex flex-col items-center mt-8 md:mt-12 max-w-md md:max-w-lg lg:max-w-xl mx-auto bg-white shadow-lg rounded-lg">
   <AnimatePresence>
         {showCelebration && (
           <div className="fixed inset-0 pointer-events-none z-50">
             {Array.from({ length: 20 }).map((_, i) => (
               <motion.div
                 key={i}
                 className="absolute text-2xl"
                 style={{
                   left: `${Math.random() * 100}%`,
                   top: `${Math.random() * 100}%`,
                 }}
                 variants={particleVariants}
                 animate="animate"
               >
                 {["🎉", "✨", "🌟", "🎊", "💫"][Math.floor(Math.random() * 5)]}
               </motion.div>
             ))}
           </div>
         )}
       </AnimatePresence>
 <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">Quiz for Goal {goalId}</h1>
 <div className="w-full">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
 <div className="p-4 bg-teal-50 rounded-lg">
 <p className="text-sm text-teal-700">Total Points</p>
 <p className="text-2xl font-bold text-teal-700">
 {quizScores.reduce((acc, quiz) => acc + quiz.score, 0)}/{85}
 </p>
 </div>
 <div className="p-4 bg-yellow-50 rounded-lg">
 <p className="text-sm text-yellow-700">Completed Quizzes</p>
 <p className="text-2xl font-bold text-yellow-700">
 {quizScores.length}/17
 </p>
 </div>
 </div>
 </div>


 {!showResult ? (
 <div className="w-full">
 <h2 className="text-xl md:text-2xl font-bold text-teal-700 text-center mb-6">
 {quiz.questions[currentQuestion]?.question}
 </h2>
 <div className="grid grid-cols-1 gap-4 mb-4">
 {quiz.questions[currentQuestion]?.options.map((option, index) => (
 <button
 key={index}
 onClick={() => handleOptionSelect(option)}
 disabled={selectedOption !== null}
 className={`w-full p-3 md:p-4 text-left rounded-lg border shadow-md transition-all duration-300 ${
 selectedOption === option
 ? option.isCorrect
 ? "bg-green-500 text-white"
 : "bg-red-500 text-white"
 : ""
 }`}
 >
 {option.text}
 </button>
 ))}
 </div>
 {selectedOption && (
 <button
 onClick={handleNext}
 className="w-full mt-4 bg-teal-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
 >
 Next Question
 </button>
 )}
 </div>
 ) : (
 <div className="w-full text-center">
 <h2 className="text-2xl md:text-3xl font-bold mb-4">Quiz Complete!</h2>
 <p className="text-xl md:text-2xl">
 Your score: {score} out of {quiz.questions.length}
 </p>


 <BadgesDisplay
 badgesEarned={badgesEarned}
 quizScores={quizScores}
 showProgress={true}
 />

 <div className="mt-6 space-x-2 md:space-x-4">
 <button
 onClick={handleNextQuiz}
 className="bg-teal-700 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors"
 >
 Next Quiz
 </button>
 <button
 onClick={() => navigate("/")}
 className="bg-gray-500 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
 >
 Back to Home
 </button>
 </div>
 </div>
 )}
 {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold">Sign in to Continue</h2>
            <p>You need to sign in to access more quizzes.</p>
            <div className="mt-4 ml-11 flex space-x-4">
              <button onClick={() => navigate("/signin")} className="bg-teal-700 text-white px-4 py-2 rounded-lg">Sign In</button>
              <button onClick={() => navigate("/")} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Go to Home</button>
            </div>
          </div>
        </div>
      )}
 </div>
 );
}

export default QuizPage;
