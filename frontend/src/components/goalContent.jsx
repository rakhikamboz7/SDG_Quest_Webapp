import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { goalDetails } from "../goalDetail";
import { useNavigate } from "react-router-dom";

const GoalContent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const goal = goalDetails[id];
  const [showTip, setShowTip] = useState(false);

  if (!goal)
    return <div className="text-center text-red-500 font-bold text-lg">Goal not found</div>;

  const handleShowTip = () => {
    setShowTip(true);
    setTimeout(() => setShowTip(false), 15000);
  };

  return (
    <>
      <Header />
      
      <div className="container mx-auto py-30 px-4 md:px-8">
        <div className="rounded-lg shadow-lg p-4 mb-3 flex flex-wrap md:flex-nowrap items-center justify-between bg-pink"
          style={{ background: `${goal.color}` }}>
          
          <div className="flex items-center space-x-4 relative">
            <button
              onClick={handleShowTip}
              className="w-16 h-16 rounded-full border-4 border-white flex justify-center items-center overflow-hidden relative hover:shadow-lg hover:shadow-green-400">
              <img src={goal.icon} alt={goal.title} className="w-full h-full object-cover rounded-full border-4 border-green-500 p-1 animate-pulse" />
            </button>
            
            {showTip && (
              <div className="absolute top-full left-0 bg-white text-black p-3 rounded-lg shadow-lg w-64 animate-fade-in border-l-4 border-green-500">
                <p className="text-sm font-semibold">{goal.knowledgeBite}</p>
              </div>
            )}
            
            <h2 className="text-xl md:text-2xl font-bold text-white">{goal.title}</h2>
          </div>
          
          <button
            onClick={() => navigate(`/quiz/${id}`)}
            className="bg-white text-teal-700 font-bold mr-10 px-2 py-2 rounded-md text-sm hover:bg-teal-600 hover:text-white mt-0 md:mt-0 w-25 md:w-auto text-center">
            Start Quiz
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center">
          <img src={goal.image} alt={goal.title} className="w-full md:w-[400px] h-auto md:h-[300px] object-cover rounded-lg mb-4 md:mb-0" />
          
          <div className="md:ml-8">
            <h2 className="text-xl font-bold mb-3">Overview</h2>
            <p className="text-gray-700">{goal.overview}</p>
            <h2 className="text-xl font-bold mt-6 mb-3">Key Points</h2>
            <ul className="list-disc pl-6 space-y-2">
              {goal.keyPoints.map((point, index) => (
                <li key={index} className="text-gray-700">{point}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Related Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[goal.videos, goal.videos2].map((video, index) => (
              <div key={index} className="p-2 border rounded">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${video}`}
                  title={`Related Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 gap-3">
            {goal.resources.map((resource, index) => (
              <a key={index} href={resource.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {resource.title}
              </a>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default GoalContent;

