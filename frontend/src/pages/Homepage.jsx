import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShuffle, FaLightbulb, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@mantine/core/styles.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import homeImg from "../assets/home6.jpg";
import missionImage1 from "../assets/home2.jpg";
import missionImage2 from "../assets/home6.jpg";

const videos = [
  { id: "0XTBYMfZyrM", title: "Introduction to SDGs" },
  { id: "NU6rc_vm9rs", title: "Climate Action Explained" },
  { id: "ZVqSC_hN2lk", title: "Sustainable Development Goals Overview" },
  { id: "dQw4w9WgXcQ", title: "Global Goals for Sustainable Development" },
  { id: "eBGIQ7ZuuiU", title: "Achieving SDGs by 2030" },
  { id: "RX2elsVjY-c", title: "Responsible Consumption and Production" }
];

const flashcards = [
  {
    question: "Which SDG aims to achieve zero hunger?",
    image: "https://www.orfonline.org/public/uploads/posts/image/Malnutrition-in-india.jpg",
    hint: "SDG 2 focuses on ending hunger and promoting sustainable agriculture."
  },
  {
    question: "What does SDG 13 advocate for?",
    image: "src/assets/wmremove-transformed.jpeg",
    hint: "It's all about taking urgent action to combat climate change."
  },
  {
    question: "Which goal promotes gender equality?",
    image: "src/assets/sngine_dcb0169096430d9a40dd0a232003d1c7.jpg",
    hint: "SDG 5 aims to achieve gender equality and empower all women and girls."
  }
];

const MissionSection = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.5
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: 0.7
      }
    }
  };

  const navigate = useNavigate();

  return (
    <motion.div
      className="mt-8 md:mt-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
        Our Mission?
      </motion.h2>
      <p className="text-black mt-2 text-sm md:text-base lg:text-lg leading-relaxed max-w-6xl">
        Empowering minds through interactive learning, Awareness and Action Towards Sustainable Development Goals. SDG Quest&#39;s mission is to inspire and educate individuals
        about the 17 Sustainable Development Goals.
      </p>
      <motion.button
        onClick={() => navigate("/about")}
        className="mt-4 md:mt-5 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-800 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
      >
        Learn More
      </motion.button>

      {/* Services Grid */}
      <motion.ul
        className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
        variants={textVariants}
      >
        <li className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg md:text-xl font-medium text-teal-700">Goal&#39;s Content</h3>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            In-depth information such as overview, key-points, learning resources on each of the 17 SDG goals.
          </p>
        </li>
        <li className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg md:text-xl font-medium text-teal-700">Goal&#39;s Quizzes</h3>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Test your knowledge of each goal with interactive quizzes in a tailored learning environment.
          </p>
        </li>
        <li className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg md:text-xl font-medium text-teal-700">Progress Tracking</h3>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Monitor your learning and quiz progress as you delve deeper into the SDGs.
          </p>
        </li>
        <li className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg md:text-xl font-medium text-teal-700">Rewards & Badges</h3>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            Earn badges and rewards for milestones reached as you master the SDG content.
          </p>
        </li>
      </motion.ul>

      {/* Inspiration Quote */}
      <div className="mt-8 md:mt-12 bg-teal-700 rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">Inspiration of the Day</h3>
        <p className="italic text-white text-base md:text-lg">
          &#34;Be the change that you wish to see in the world.&#34; – Mahatma Gandhi
        </p>
      </div>

      {/* Who Are We Section */}
      <motion.div
        className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        variants={containerVariants}
      >
        <div>
          <motion.h2 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
            Who Are We...?
          </motion.h2>
          <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
            Welcome to SDG Quest, your interactive platform dedicated to educating individuals on the 17 Sustainable Development Goals.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <img
            src={missionImage1}
            alt="Who We Are"
            className="w-full max-w-[300px] md:max-w-[400px] rounded-lg shadow-md"
          />
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        variants={containerVariants}
      >
        <div className="flex justify-center md:justify-start">
          <img
            src={missionImage2}
            alt="Why Choose Us"
            className="w-full max-w-[300px] md:max-w-[400px] rounded-lg shadow-md"
          />
        </div>
        <div>
          <motion.h3 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
            Why Choose Us...?
          </motion.h3>
          <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
            SDG Quest offers tailored learning experiences, engaging quizzes, progress tracking, and reward systems that inspire action.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ResourceCarousel = () => {
  const carouselRef = useRef(null);
  const scroll = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="mt-8 md:mt-12 w-full max-w-7xl mx-auto relative px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-teal-700">
        Featured Resources
      </h2>
      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-2 rounded-full shadow-md hover:bg-teal-500 transition duration-300"
        onClick={() => scroll("left")}
      >
        <FaChevronLeft size={24} />
      </button>
      <div ref={carouselRef} className="flex mt-4 overflow-hidden space-x-4">
        {videos.map((video) => (
          <div key={video.id} className="p-1 min-w-[200px] flex-shrink-0">
            <div className="video-responsive">
              <iframe
                title={video.title}
                src={`https://www.youtube.com/embed/${video.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-48 rounded-lg shadow-lg"
              />
            </div>
            <p className="mt-2 text-base text-center text-gray-800 font-semibold">
              {video.title}
            </p>
          </div>
        ))}
      </div>
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white p-2 rounded-full shadow-md hover:bg-teal-500 transition duration-300"
        onClick={() => scroll("right")}
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  );
};

const ShuffleCard = () => {
  const [index, setIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const shuffleCards = () => {
    setShowHint(false);
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    setIndex(randomIndex);
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <h3 className="text-2xl md:text-3xl font-bold text-teal-800 mb-4 text-center">
        Try Shuffling the Cards!
      </h3>
      <div className="w-full max-w-lg flex flex-col items-center bg-white rounded-2xl shadow-xl p-4 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-xl md:text-2xl font-bold text-teal-700 mb-4">
            {flashcards[index].question}
          </h2>
          <img
            src={flashcards[index].image}
            alt="Flashcard Visual"
            className="w-full h-auto mb-4 rounded-lg"
            style={{ maxHeight: '200px' }} // Set a maximum height for the image
          />
        </motion.div>
        {showHint && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-700 mt-2"
          >
            {flashcards[index].hint}
          </motion.p>
        )}
        <div className="flex justify-between gap-4 mt-4">
          <button
            onClick={shuffleCards}
            className="flex-1 px-4 py-2 bg-teal-700 text-white rounded-lg flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-300"
          >
            <FaShuffle /> Shuffle
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg flex items-center justify-center gap-2 shadow-md hover:scale-105 transition-transform duration-300"
          >
            <FaLightbulb /> Hint
          </button>
        </div>
      </div>
    </div>
  );
};


function HomePage() {
  return (
    <>
      <Header /><br/><br/>
      <div className="w-full py-15 bg-gray-100 md:py-20">
        <div className="w-full px-4 md:px-8 flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center w-full max-w-7xl">
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-teal-800 mb-4">
                Welcome to <br />
                <strong>SDG Quest</strong> - Track your journey toward mastering SDGs!
              </h1>
              <p className="text-gray-700 text-base md:text-lg">
                Chart your path to a sustainable future—discover, engage, and transform the world with SDG Quest as your guide to mastering meaningful change.
              </p>
            </div>
            <motion.img
              src={homeImg}
              alt="Illustration of Sustainable Development Goals"
              className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
            />
          </div>

          <MissionSection />

          <section className="mt-10 py-5 w-full bg-gray-50">
  <div className="container mx-auto flex flex-col items-center">
    <ShuffleCard />
  </div>
</section>


          <ResourceCarousel />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HomePage;
