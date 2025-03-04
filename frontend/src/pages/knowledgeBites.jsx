import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { knowledgeBites } from '../knowledgeBites';
import PropTypes from 'prop-types';

const KnowledgeBites = () => {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const GoalCard = ({ goal }) => (
    <div
      className="cursor-pointer transform transition-transform hover:scale-105 mx-2 sm:mx-4 lg:mx-5"
      onClick={() => setSelectedGoal(goal)}
    >
      <div
        className="w-30 h-30 rounded-full border-4 p-1 hover:animate-pulse"
        style={{ borderColor: goal.color }}
      >
        <img
          src={goal.icon}
          alt={goal.title}
          lassName="w-150 h-30 rounded-full object-cover"
        />
      </div>
      <p className="text-left mt-1.5 font-semibold text-center">{goal.title}</p>
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
    <div className="min-h-screen bg-gray-100">
      <Header /><br /><br /><br />
      <div className="container flex-1 justify-item-centre mx-auto px-4 py-16">
        <div className="p-8 rounded-lg mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-4">
            Welcome to SDG Knowledge Hub!
          </h1>
          <p className="text-[#036666] text-base md:text-lg">
            Explore practical tips and innovative solutions for each Sustainable Development Goal.<br />
            Click on any goal to dive deeper into making a difference.
          </p>
        </div>

        <div className="justify-between-center ml-18 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
          {knowledgeBites.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>

        {selectedGoal && (
          <div className="fixed inset-0 mt-20 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white mt-8 rounded-2xl p-5 max-w-lg sm:max-w-2xl w-full max-h-90vh overflow-y-auto">
              <div className="flex items-center mb-6">
                <img
                  src={selectedGoal.icon}
                  alt={selectedGoal.title}
                  className="w-20 h-20 rounded-full mr-4"
                />
                <h2 className="text-xl md:text-2xl font-bold">{selectedGoal.title}</h2>
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="ml-auto text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Tips for Action</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {selectedGoal.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Sustainable Solutions</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {selectedGoal.solutions.map((solution, index) => (
                    <li key={index}>{solution}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default KnowledgeBites;
