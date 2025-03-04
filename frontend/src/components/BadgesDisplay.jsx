import PropTypes from "prop-types";
import { motion } from "framer-motion";

const BadgesDisplay = ({ badgesEarned, quizScores, showProgress = true }) => {
    const getNextBadgeHint = () => {
        const totalPoints = quizScores.reduce((acc, quiz) => acc + quiz.score, 0);
        if (totalPoints < 5) return `You are ${5 - totalPoints} points away from earning the 🥉 Bronze Badge!`;
        if (totalPoints < 30) return `You are ${30 - totalPoints} points away from earning the 🥈 Silver Badge!`;
        if (totalPoints < 75) return `You are ${75 - totalPoints} points away from earning the 🥇 Gold Badge!`;
        return "Fantastic! You've unlocked all badges! 🏆";
    };

    return (
        <div className="py-4">
            {badgesEarned.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">
                    {badgesEarned.map((badge, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col items-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <img
                                src={`/badges/${badge.toLowerCase()}-badge.png`}
                                alt={`${badge} Badge`}
                                className="w-16 h-16 mb-2"
                                onError={(e) => {
                                    console.error("Error loading badge image");
                                    e.target.src = "/badges/default-badge.png";
                                }}
                            />
                            <p className="text-sm font-semibold text-teal-700">
                                {badge} Badge
                            </p>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-4">
                    <img
                        src="/badges/locked-badge.png"
                        alt="Locked Badge"
                        className="w-16 h-16 mx-auto mb-2 opacity-40"
                    />
                    <p className="text-sm text-gray-500">
                        No badges yet! Keep going! 😊
                    </p>
                </div>
            )}

            {showProgress && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{getNextBadgeHint()}</p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-full bg-teal-600 rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.min(
                                    (quizScores.reduce((acc, quiz) => acc + quiz.score, 0) / 75) * 100,
                                    100
                                )}%`
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

BadgesDisplay.propTypes = {
    badgesEarned: PropTypes.arrayOf(PropTypes.string).isRequired,
    quizScores: PropTypes.arrayOf(
        PropTypes.shape({
            score: PropTypes.number.isRequired,
        })
    ).isRequired,
    showProgress: PropTypes.bool
};

BadgesDisplay.defaultProps = {
    showProgress: true
};

export default BadgesDisplay;

