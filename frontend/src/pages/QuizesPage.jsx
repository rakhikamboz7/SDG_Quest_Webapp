import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BadgesDisplay from '../components/BadgesDisplay';
import { API_BASE_URL } from '../config';


function QuizPage() {
    const { goalId } = useParams();
    const navigate = useNavigate();

    const [quizScores, setQuizScores] = useState([]);
    const [badgesEarned, setBadgesEarned] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [allQuizzes, setAllQuizzes] = useState([]);
   

  
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
                const response = await axios.get(`${API_BASE_URL}/api/quizzes`);
                setAllQuizzes(response.data);

                const foundQuiz = response.data.find((q) => String(q.goalId) === String(goalId));
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
            if (!token || !userId) {
                alert("User not authenticated!");
                navigate("/login");
                return;
            }

            const response = await axios.post(`${BACKEND_URL}
                /api/scores/submit`,
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
            alert("Error saving score. Please try again later.");
        }
    };

    const handleNextQuiz = () => {
        const currentQuizIndex = allQuizzes.findIndex((q) => String(q.goalId) === String(goalId));
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
                    onClick={() => navigate("/")} 
                    className="bg-teal-700 text-white px-4 py-2 rounded-lg"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-8 p-4 max-w-xl mx-auto bg-white shadow-lg rounded-lg relative">
           
            <h1 className="text-2xl font-bold">Quiz for Goal {goalId}</h1>
            <div className="w-full bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-teal-50 rounded-lg">
                        <p className="text-sm text-teal-700">Total Points</p>
                        <p className="text-2xl font-bold text-teal-700">
                            {quizScores.reduce((acc, quiz) => acc + quiz.score, 0)}/{85}
                        </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700">Completed Quizzes</p>
                        <p className="text-2xl font-bold text-yellow-700">{quizScores.length}/17</p>
                    </div>
                </div>
            </div>

            {!showResult ? (
                <div className="w-full p-4 text-center">
                    <h2 className="text-2xl font-bold text-teal-700 mb-6">
                        {quiz.questions[currentQuestion]?.question}
                    </h2>
                    <div className="grid grid-cols-1 gap-4">
                        {quiz.questions[currentQuestion]?.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                                disabled={selectedOption !== null}
                                className={`w-full p-4 text-left rounded-lg border shadow-md transition-all duration-300 ${
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
                            className="mt-4 bg-teal-700 text-white px-4 py-2 rounded-lg w-full shadow-md hover:shadow-lg"
                        >
                            Next Question
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
                    <p className="text-xl">Your score: {score} out of {quiz.questions.length}</p>

                    <BadgesDisplay
                        badgesEarned={badgesEarned}
                        quizScores={quizScores}
                        showProgress={true}
                    />

                    <div className="mt-6 space-x-4">
                        <button
                            onClick={handleNextQuiz}
                            className="bg-teal-700 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition-colors"
                        >
                            Next Quiz
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuizPage;