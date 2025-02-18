import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
// import { goalDetails } from "../goalDetail";
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';
import poverty from "../assets/poverty.svg.ico";
import Hunger from "../assets/Hunger.ico";
import Health from "../assets/Health.ico";
import education from "../assets/education.svg.ico";
import gender from "../assets/gender.svg.ico";
import goal6 from "../assets/goal6.svg.ico";
import goal7 from "../assets/goal7.png.ico";
import goal8 from "../assets/goal8.svg.ico";
import goal9 from "../assets/goal9.svg.ico";
import goal10 from "../assets/goal10.png.ico";
import goal11 from "../assets/goal11.svg.ico";
import goal12 from "../assets/goal12.svg.ico";
import goal13 from "../assets/goal13.svg.ico";
import goal14 from "../assets/goal14.svg.ico";
import goal15 from "../assets/goal15.svg.ico";
import goal16 from "../assets/goal16.svg.ico";
import goal17 from "../assets/goal17.svg.ico";
const goalsData = [
  {
    id: 1,
    title: "No Poverty",
    icon: poverty,
    overview:
      "Goal 1 aims to end poverty in all its forms everywhere. The number of people living in extreme poverty dropped by more than half between 1990 and 2015.",
    color: "#E5243B",
  },
  {
    id: 2,
    title: "Zero Hunger",
    icon: Hunger,
    overview:
      "Goal 2 seeks sustainable solutions to end hunger and achieve food security for all.",
    color: "#DDA63A",
  },
  {
    id: 3,
    title: "Good Health and Well-Being",
    icon: Health,
    overview:
      "Goal 3 ensures healthy lives and promotes well-being at all ages.",
    color: "#4C9F38",
  },
  {
    id: 4,
    title: "Quality Education",
    icon:education,
    overview:
      "Goal 4 ensures inclusive and equitable quality education and promotes lifelong learning opportunities.",
    color: "#C5192D",
  },
  {
    id: 5,
    title: "Gender Equality",
    icon: gender,
    overview:
      "Goal 5 aims to achieve gender equality and empower all women and girls.",
    color: "#FF3A21",
  },
  {
    id: 6,
    title: "Goal 6: Clean Water and Sanitation",
    icon: goal6,
    overview:
      "Goal 6 aims to ensure availability and sustainable management of water and sanitation for all. Billions of people still lack access to safe water and sanitation.",
    color: "#26BDE2",
  },
  {
    id: 7,
    title: "Goal 7: Affordable and Clean Energy",
    icon: goal7,
    overview:
      "Goal 7 ensures access to affordable, reliable, sustainable, and modern energy for all. Transitioning to renewable energy is key to fighting climate change.",
    color: "#FCC30B",
  },
  {
    id: 8,
    title: "Goal 8: Decent Work and Economic Growth",
    icon: goal8,
    overview:
      "Goal 8 promotes sustained, inclusive economic growth, full employment, and decent work for all while ensuring labor rights and economic productivity.",
    color: "#A21942",
  },
  {
    id: 9,
    title: "Goal 9: Industry, Innovation and Infrastructure",
    icon: goal9,
    overview:
      "Goal 9 focuses on building resilient infrastructure, promoting sustainable industrialization, and fostering innovation to drive economic progress.",
    color: "#FD6925",
  },
  {
    id: 10,
    title: "Goal 10: Reduced Inequalities",
    icon: goal10,
    overview:
      "Goal 10 aims to reduce inequalities within and among countries by ensuring equal opportunities and promoting social and economic inclusion.",
    color: "#DD1367",
  },
  {
    id: 11,
    title: "Goal 11: Sustainable Cities and Communities",
    icon: goal11,
    overview:
      "Goal 11 seeks to make cities inclusive, safe, resilient, and sustainable by addressing housing, transportation, and environmental challenges.",
    color: "#FD9D24",
  },
  {
    id: 12,
    title: "Goal 12: Responsible Consumption and Production",
    icon: goal12,
    overview:
      "Goal 12 promotes sustainable consumption and production patterns, aiming to reduce waste and encourage responsible resource management.",
    color: "#BF8B2E",
  },
  {
    id: 13,
    title: "Goal 13: Climate Action",
    icon: goal13,
    overview:
      "Goal 13 calls for urgent action to combat climate change and its impacts through adaptation, mitigation, and increased resilience.",
    color: "#3F7E44",
  },
  {
    id: 14,
    title: "Goal 14: Life Below Water",
  icon: goal14,
    overview:
      "Goal 14 aims to conserve and sustainably use the oceans, seas, and marine resources to prevent pollution and habitat destruction.",
    color: "#0A97D9",
  },
  {
    id: 15,
    title: "Goal 15: Life on Land",
    icon: goal15,
    overview:
      "Goal 15 focuses on protecting, restoring, and promoting the sustainable use of terrestrial ecosystems, forests, and biodiversity.",
    color: "#56C02B",
  },
  {
    id: 16,
    title: "Goal 16: Peace, Justice, and Strong Institutions",
  icon: goal16,
    overview:
      "Goal 16 promotes peaceful and inclusive societies, ensuring access to justice for all and building effective, accountable institutions.",
    color: "#00689D",
  },
  {
    id: 17,
    title: "Goal 17: Partnerships for the Goals",
  icon: goal17,
    overview:
      "Goal 17 emphasizes strengthening global partnerships for sustainable development, improving international cooperation and financial support.",
    color: "#19486A",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const { id } = useParams();

  
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('https://sdg-quest-webapp.onrender.com/api/quizzes/');
        console.log("Fetched quizzes:", response.data.myData); // Debug log
        setQuizzes(response.data.myData);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <br />
      <br />

      <div className="container mt-20 mx-auto px-6">
        <h1 className="font-bold text-4xl text-yellow-500 mb-5">
          Learn And Explore The Goals Here
        </h1>
        <p className="text-[#036666] text-lg">
          You can learn more about specific goals and Start playing Quizzes.
        </p>

        <div className="grid mt-10 mb-15 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goalsData.map((goal) => {
            // Debug logs
            // console.log("Current goal:", goal);
            const matchingQuiz = quizzes?.find(quiz => {
              // console.log("Comparing:", quiz._id, goal.id); // Debug log
              return quiz.goalId === goal.id;
            });
            console.log("Matching quiz:", matchingQuiz); 
            return (
              <div
                key={goal.id}
                className="bg-white rounded-lg shadow-lg p-5 flex flex-col justify-between border-l-8"
                style={{ borderColor: goal.color }}
              >
                {/* Top Section (Icon & Title) */}
                <div className="flex items-center justify-between mb-3">
                  <img
                    src={goal.icon}
                    alt={goal.title}
                    className="h-10 w-10 object-contain"
                  />
                  <h2 className="text-lg font-bold text-gray-800">
                    {goal.title}
                  </h2>
                </div>

                {/* Overview (Description) */}
                <p className="text-gray-600 text-justify text-sm mb-4">
                  {goal.overview}
                  <br />
                  <Link
                    className="text-black"
                    to={`/goal/${goal.id}`}
                    style={{ color: goal.color }}
                  >
                    Learn More
                  </Link>
                </p>

                {/* Bottom Section (Quiz Button) */}
                <div className="flex justify-between items-center">
               
                    <button
                      onClick={() => {
                        navigate(`/quiz/${goal.id}`);
                      }}
                      className="bg-teal-700 text-white px-2 py-1 ml-60 rounded-md text-sm hover:bg-teal-600"
                    >
                      Start Quiz
                    </button>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
