import { useState } from 'react';
import { knowledgeBites } from '../knowledgeBites';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const KnowledgeBites = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const GoalCard = ({ goal }) => (
    <div
      className="cursor-pointer transform transition-transform hover:scale-105 mx-auto flex flex-col items-center justify-center"
      onClick={() => setSelectedGoal(goal)}
      title={goal.title} // Shows title on hover
    >
      <div
        className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 p-2 flex items-center justify-center hover:animate-pulse"
        style={{ borderColor: goal.color }}
      >
        <img
          src={goal.icon}
          alt={goal.title}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>
  );

  GoalCard.propTypes = {
    goal: PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
     
      <div className="container mx-auto px-4 py-15 flex-1">
        <div className="text-center p-6 rounded-lg mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-4">
            Welcome to SDG Knowledge Hub!
          </h1>
          <p className="text-[#036666] text-base md:text-lg">
            Explore practical tips and innovative solutions for each Sustainable Development Goal.<br />
            Click on any goal to dive deeper into making a difference.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 place-items-center">
          {knowledgeBites.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        {selectedGoal && (
          <div className="mt-20 fixed inset-0 flex items-center bg-black/30 backdrop-blur-sm justify-center bg-opacity-20 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 0.9 }}
              exit={{ opacity: 0.5, scale: 0.8 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white shadow-2xl rounded-2xl p-5 w-full max-w-lg sm:max-w-2xl overflow-y-auto"
            >
              <div className="flex items-center mb-6">
                <img
                  src={selectedGoal.icon}
                  alt={selectedGoal.title}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full mr-4 shadow-md"
                />
                <h2 className="text-lg text-left justify-align-items md:text-2xl font-bold">{selectedGoal.title}</h2>
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="ml-auto text-gray-500 hover:text-red-600 text-2xl transition-transform transform hover:scale-110"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold mb-3">Tips for Action</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {selectedGoal.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-3">Sustainable Solutions</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  {selectedGoal.solutions.map((solution, index) => (
                    <li key={index}>{solution}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        )}
      </div>
 
    </div>
  );
};

export default KnowledgeBites;

