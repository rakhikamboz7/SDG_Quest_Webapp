// import poverty from "./assets/poverty.svg.ico";
// import Hunger from "./assets/Hunger.ico";
// import Health from "./assets/Health.ico";
// import education from "./assets/education.svg.ico";
// import gender from "./assets/gender.svg.ico";
// import goal6 from "./assets/goal6.svg.ico";
// import goal7 from "./assets/goal7.png.ico";
// import goal8 from "./assets/goal8.svg.ico";
// import goal9 from "./assets/goal9.svg.ico";
// import goal10 from "./assets/goal10.png.ico";
// import goal11 from "./assets/goal11.svg.ico";
// import goal12 from "./assets/goal12.svg.ico";
// import goal13 from "./assets/goal13.svg.ico";
// import goal14 from "./assets/goal14.svg.ico";
// import goal15 from "./assets/goal15.svg.ico";
// import goal16 from "./assets/goal16.svg.ico";
// import goal17 from "./assets/goal17.svg.ico";
// const icons = {
//   poverty: "./assets/poverty.svg.ico",
//   hunger: "./assets/Hunger.ico",
//   health: "./assets/Health.ico",
//   education: "./assets/education.svg.ico",
//   gender: "./assets/gender.svg.ico",
//   goal6: "./assets/goal6.svg.ico",
//   goal7: "./assets/goal7.png.ico",
//   goal8: "./assets/goal8.svg.ico",
//   goal9: "./assets/goal9.svg.ico",
//   goal10: "./assets/goal10.png.ico",
//   goal11: "./assets/goal11.svg.ico",
//   goal12: "./assets/goal12.svg.ico",
//   goal13: "./assets/goal13.svg.ico",
//   goal14: "./assets/goal14.svg.ico",
//   goal15: "./assets/goal15.svg.ico",
//   goal16: "./assets/goal16.svg.ico",
//   goal17: "./assets/goal17.svg.ico",
// };

import  { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Define a placeholder path for icons since we can't use external images
const SDGIcons = {
  poverty: "./assets/poverty.svg.ico",
  hunger: "./assets/Hunger.ico",
  health: "./assets/Health.ico",
  education: "./assets/education.svg.ico",
  gender: "./assets/gender.svg.ico",
  goal6: "./assets/goal6.svg.ico",
  goal7: "./assets/goal7.png.ico",
  goal8: "./assets/goal8.svg.ico",
  goal9: "./assets/goal9.svg.ico",
  goal10: "./assets/goal10.png.ico",
  goal11: "./assets/goal11.svg.ico",
  goal12: "./assets/goal12.svg.ico",
  goal13: "./assets/goal13.svg.ico",
  goal14: "./assets/goal14.svg.ico",
  goal15: "./assets/goal15.svg.ico",
  goal16: "./assets/goal16.svg.ico",
  goal17: "./assets/goal17.svg.ico",
};

const goalsData = [
  {
    id: 1,
    title: "No Poverty",
    icon: "poverty",
    overview: "Goal 1 aims to end poverty in all its forms everywhere.",
    color: "#E5243B",
    description:
      "Poverty is more than the lack of income and resources to ensure a sustainable livelihood. Its manifestations include hunger and malnutrition, limited access to education and other basic services, social discrimination and exclusion as well as the lack of participation in decision-making.",
  },
  {
    id: 2,
    title: "Zero Hunger",
    icon: "hunger",
    overview: "Goal 2 seeks sustainable solutions to end hunger and achieve food security for all.",
    color: "#DDA63A",
    description:
      "The food and agriculture sector offers key solutions for development, and is central for hunger and poverty eradication. It is time to rethink how we grow, share and consume our food.",
  },
  {
    id: 3,
    title: "Good Health and Well-Being",
    icon: "health",
    overview: "Goal 3 ensures healthy lives and promotes well-being at all ages.",
    color: "#4C9F38",
    description:
      "Ensuring healthy lives and promoting well-being at all ages is essential to sustainable development. Currently, the world is facing a global health crisis unlike any other — COVID-19 is spreading human suffering, destabilizing the global economy and upending the lives of billions of people around the globe.",
  },
  {
    id: 4,
    title: "Quality Education",
    icon: "education",
    overview: "Goal 4 ensures inclusive and equitable quality education.",
    color: "#C5192D",
    description:
      "Obtaining a quality education is the foundation to creating sustainable development. In addition to improving quality of life, access to inclusive education can help equip locals with the tools required to develop innovative solutions to the world's greatest problems.",
  },
  {
    id: 5,
    title: "Gender Equality",
    icon: "gender",
    overview: "Goal 5 aims to achieve gender equality and empower all women and girls.",
    color: "#FF3A21",
    description:
      "Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world. There has been progress over the last decades, but we're still far from a world where women and men are equal.",
  },
  {
    id: 6,
    title: "Clean Water and Sanitation",
    icon: "goal6",
    overview: "Goal 6 aims to ensure availability and sustainable management of water and sanitation for all.",
    color: "#26BDE2",
    description:
      "Clean, accessible water for all is an essential part of the world we want to live in and there is sufficient fresh water on the planet to achieve this. However, due to bad economics or poor infrastructure, millions of people die every year from diseases associated with inadequate water supply, sanitation and hygiene.",
  },
  {
    id: 7,
    title: "Affordable and Clean Energy",
    icon: "goal7",
    overview: "Goal 7 ensures access to affordable, reliable, sustainable, and modern energy for all.",
    color: "#FCC30B",
    description:
      "Energy is central to nearly every major challenge and opportunity the world faces today. Be it for jobs, security, climate change, food production or increasing incomes, access to energy for all is essential.",
  },
  {
    id: 8,
    title: "Decent Work and Economic Growth",
    icon: "goal8",
    overview: "Goal 8 promotes sustained, inclusive economic growth.",
    color: "#A21942",
    description:
      "Sustained and inclusive economic growth can drive progress, create decent jobs for all and improve living standards. COVID-19 has disrupted billions of lives and endangered the global economy. The International Monetary Fund (IMF) expects a global recession as bad as or worse than in 2009.",
  },
  {
    id: 9,
    title: "Industry, Innovation and Infrastructure",
    icon: "goal9",
    overview: "Goal 9 focuses on building resilient infrastructure and fostering innovation.",
    color: "#FD6925",
    description:
      "Investments in infrastructure – transport, irrigation, energy and information and communication technology – are crucial to achieving sustainable development and empowering communities in many countries.",
  },
  {
    id: 10,
    title: "Reduced Inequalities",
    icon: "goal10",
    overview: "Goal 10 aims to reduce inequalities within and among countries.",
    color: "#DD1367",
    description:
      "Reducing inequalities and ensuring no one is left behind are integral to achieving the Sustainable Development Goals. Inequality within and among countries is a persistent cause for concern.",
  },
  {
    id: 11,
    title: "Sustainable Cities and Communities",
    icon: "goal11",
    overview: "Goal 11 seeks to make cities inclusive, safe, resilient, and sustainable.",
    color: "#FD9D24",
    description:
      "The world is becoming increasingly urbanized. Since 2007, more than half the world's population has been living in cities, and that share is projected to rise to 60% by 2030. Cities and metropolitan areas are powerhouses of economic growth.",
  },
  {
    id: 12,
    title: "Responsible Consumption and Production",
    icon: "goal12",
    overview: "Goal 12 promotes sustainable consumption and production patterns.",
    color: "#BF8B2E",
    description:
      "Sustainable consumption and production is about doing more and better with less. It is also about decoupling economic growth from environmental degradation, increasing resource efficiency and promoting sustainable lifestyles.",
  },
  {
    id: 13,
    title: "Climate Action",
    icon: "goal13",
    overview: "Goal 13 calls for urgent action to combat climate change.",
    color: "#3F7E44",
    description:
      "Climate change is affecting every country on every continent. It is disrupting national economies and affecting lives. Weather patterns are changing, sea levels are rising, and weather events are becoming more extreme.",
  },
  {
    id: 14,
    title: "Life Below Water",
    icon: "goal14",
    overview: "Goal 14 aims to conserve and sustainably use oceans and seas.",
    color: "#0A97D9",
    description:
      "The world's oceans – their temperature, chemistry, currents and life – drive global systems that make the Earth habitable for humankind. Our rainwater, drinking water, weather, climate, coastlines, much of our food, and even the oxygen in the air we breathe, are all ultimately provided and regulated by the sea.",
  },
  {
    id: 15,
    title: "Life on Land",
    icon: "goal15",
    overview: "Goal 15 focuses on protecting terrestrial ecosystems.",
    color: "#56C02B",
    description:
      "Nature is critical to our survival: nature provides us with our oxygen, regulates our weather patterns, pollinates our crops, produces our food, feed and fibre. But it is under increasing stress.",
  },
  {
    id: 16,
    title: "Peace, Justice, and Strong Institutions",
    icon: "goal16",
    overview: "Goal 16 promotes peaceful societies.",
    color: "#00689D",
    description:
      "Conflict, insecurity, weak institutions and limited access to justice remain a great threat to sustainable development. The number of people fleeing war, persecution and conflict exceeded 70 million in 2018, the highest level recorded by the UN refugee agency (UNHCR) in almost 70 years.",
  },
  {
    id: 17,
    title: "Partnerships for the Goals",
    icon: "goal17",
    overview: "Goal 17 emphasizes strengthening global partnerships.",
    color: "#19486A",
    description:
      "The SDGs can only be realized with strong global partnerships and cooperation. A successful development agenda requires inclusive partnerships — at the global, regional, national and local levels — built upon principles and values, and upon a shared vision and shared goals placing people and the planet at the centre.",
  },
];

const SDGWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [spinHistory, setSpinHistory] = useState([]);
  const [spinSpeed, setSpinSpeed] = useState(3); // Default spin duration
  const [spinButtonText, setSpinButtonText] = useState("Spin the Wheel");
  const wheelRef = useRef(null);
  const contentControls = useAnimation();

  // Refs for the wheel container and content panel
  const wheelContainerRef = useRef(null);
  const contentPanelRef = useRef(null);

  // Generate unique spin animations
  const getSpinAnimation = () => {
    // Create different spin patterns based on the spin count
    const baseRotations = 2 + (spinCount % 3);
    const additionalRotation = Math.random() * 360;
    const spinAmount = (baseRotations * 360) + additionalRotation;
    
    // Add some variation to spin speed
    const newSpinSpeed = 2.5 + Math.random();
    setSpinSpeed(newSpinSpeed);
    
    return wheelRotation + spinAmount;
  };

  // Function to handle spinning the wheel
  const spinWheel = () => {
    if (isSpinning) return;

    // Update spin button text
    setSpinButtonText("Spinning...");
    
    // Start spinning state
    setIsSpinning(true);
    setShowContent(false);
    
    // Generate animation
    const newRotation = getSpinAnimation();
    setWheelRotation(newRotation);
    
    // Calculate which goal will be selected after the spin
    const segmentAngle = 360 / 17;
    const normalizedRotation = newRotation % 360;
    const goalIndex = Math.floor((360 - normalizedRotation) / segmentAngle) % 17;
    const newGoalId = goalIndex + 1;

    // Update spin history
    const updatedHistory = [...spinHistory];
    if (updatedHistory.length >= 5) updatedHistory.shift(); // Keep only last 5 spins
    updatedHistory.push(newGoalId);
    setSpinHistory(updatedHistory);
    
    // Increment spin counter
    setSpinCount(prevCount => prevCount + 1);

    // After spinning animation completes, show the goal info
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedGoal(newGoalId);
      setShowContent(true);
      setSpinButtonText("Spin Again");
    }, spinSpeed * 1000);
  };

  // Function to handle clicking on a specific goal
  const handleGoalClick = (goalId, e) => {
    e.preventDefault();

    if (isSpinning) return;

    if (selectedGoal === goalId) {
      // Already selected, just toggle content visibility
      setShowContent(!showContent);
      return;
    }

    setIsSpinning(true);
    setShowContent(false);
    setSpinButtonText("Spinning...");

    // Calculate rotation to center the selected goal
    const segmentAngle = 360 / 17;
    const targetRotation = -(goalId - 1) * segmentAngle;

    // Ensure we always rotate in the same direction by adding full rotations
    const currentNormalized = wheelRotation % 360;
    const targetNormalized = targetRotation % 360;
    const fullRotations = Math.floor(wheelRotation / 360) * 360;

    let newRotation;
    if (currentNormalized !== targetNormalized) {
      newRotation = fullRotations + targetNormalized + 360; // Add an extra rotation for visual effect
    } else {
      newRotation = wheelRotation + 360; // Just do a full rotation if already on target
    }

    setWheelRotation(newRotation);

    // After spinning animation completes, show the goal info
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedGoal(goalId);
      setShowContent(true);
      setSpinButtonText("Spin Again");
    }, 1500);
  };

  // Animate content when it becomes visible
  useEffect(() => {
    if (showContent) {
      contentControls.start("visible");
    } else {
      contentControls.start("hidden");
    }
  }, [showContent, contentControls]);

  // Content animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // Highlight animation for the selected segment
  const highlightVariants = {
    initial: { scale: 1, filter: "brightness(1)" },
    highlight: {
      scale: 1.05,
      filter: "brightness(1.2) drop-shadow(0 0 10px rgba(255,255,255,0.5))",
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        duration: 1,
      },
    },
  };

  // Get the currently selected goal data
  const currentGoal = selectedGoal ? goalsData.find(goal => goal.id === selectedGoal) : null;

  // Create SVG icons with colors based on SDG goals
  const renderSDGIcon = (goalIcon, color) => {
    // Each SDG gets a unique simple icon shape based on its id
    switch(goalIcon) {
      case "poverty":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="5" fill={color} />
            <path d="M5 21v-2a7 7 0 0114 0v2" fill={color} />
          </svg>
        );
      case "hunger":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M6,3 C8,12 16,12 18,3" stroke={color} strokeWidth="2" fill="none" />
            <rect x="9" y="14" width="6" height="7" fill={color} />
          </svg>
        );
      // Add cases for other icons
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="6" fill={color} />
          </svg>
        );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900"></div>

      <motion.h1
        className="mb-8 text-4xl font-bold text-center text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        Sustainable Development Goals
      </motion.h1>

      <div className="relative w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-center">
          {/* SDG Wheel Container */}
          <div ref={wheelContainerRef} className="relative flex items-center justify-center w-full max-w-md lg:w-1/2 mb-8 lg:mb-0">
            {/* Wheel Background Glow - Enhanced with dynamic animation */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.3, 0.2],
                background: isSpinning ? 
                  ["linear-gradient(to right, #3b82f6, #8b5cf6)", 
                   "linear-gradient(to right, #8b5cf6, #ec4899)", 
                   "linear-gradient(to right, #ec4899, #3b82f6)"] : 
                  "linear-gradient(to right, #3b82f6, #8b5cf6)",
              }}
              transition={{
                duration: isSpinning ? 2 : 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            {/* Number indicator - shows which goal is selected */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white font-bold">
                {selectedGoal ? `Goal ${selectedGoal}` : 'Select a Goal'}
              </span>
            </div>

            {/* SDG Wheel - Enhanced with dynamic transition speed */}
            <motion.div
              className="relative"
              style={{ width: "min(100%, 400px)", height: "min(100%, 400px)" }}
              initial={{ rotate: 0 }}
              animate={{
                rotate: wheelRotation,
                transition: {
                  type: isSpinning ? "spring" : "tween",
                  duration: isSpinning ? spinSpeed : 1.5,
                  ease: isSpinning ? "easeOut" : [0.42, 0, 0.58, 1],
                  bounce: isSpinning ? 0.25 : 0,
                },
              }}
            >
              <svg
                ref={wheelRef}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 250 250"
                className="w-full h-full transition-transform duration-1000 ease-in-out"
              >
                <g transform="translate(125, 125)">
                  {/* Create segments for all 17 SDGs */}
                  {goalsData.map((goal, index) => {
                    const angle = (360 / 17) * index;
                    const radians = (angle * Math.PI) / 180;
                    const radius = 100; // Increased radius for better visibility
                    
                    // Calculate icon position
                    const iconX = Math.cos(radians) * (radius * 0.6);
                    const iconY = Math.sin(radians) * (radius * 0.6);
                    
                    return (
                      <motion.g
                        key={goal.id}
                        className="transition-all duration-300 hover:opacity-90 hover:drop-shadow-lg cursor-pointer"
                        onClick={(e) => handleGoalClick(goal.id, e)}
                        variants={highlightVariants}
                        initial="initial"
                        animate={selectedGoal === goal.id ? "highlight" : "initial"}
                        transform={`rotate(${angle})`}
                      >
                        <path
                          d={`M 0 0 L ${radius * Math.cos(0)} ${radius * Math.sin(0)} A ${radius} ${radius} 0 0 1 ${radius * Math.cos(2 * Math.PI / 17)} ${radius * Math.sin(2 * Math.PI / 17)} Z`}
                          fill={goal.color}
                          transform={`rotate(${(360 / 17) * 0.5})`}
                          stroke="white"
                          strokeWidth="0.5"
                          strokeOpacity="0.3"
                        />
                        {/* Numbers on the outer edge for better visibility */}
                        <text
                          x={Math.cos(radians + (Math.PI/17)) * (radius * 0.8)}
                          y={Math.sin(radians + (Math.PI/17)) * (radius * 0.8)}
                          fill="white"
                          fontSize="10"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${angle + (360/34)})`}
                          style={{ pointerEvents: "none" }}
                        >
                          {goal.id}
                        </text>
                        {/* Icon representation */}
                        <foreignObject
                          x={iconX - 8}
                          y={iconY - 8}
                          width="16"
                          height="16"
                          style={{ pointerEvents: "none" }}
                        >
                          {renderSDGIcon(goal.icon, "#ffffff")}
                        </foreignObject>
                        <title>{`Goal ${goal.id}: ${goal.title}`}</title>
                      </motion.g>
                    );
                  })}
                  
                  {/* Enhanced center circle */}
                  <circle cx="0" cy="0" r="30" fill="rgba(255,255,255,0.1)" />
                  <circle cx="0" cy="0" r="25" fill="rgba(255,255,255,0.2)" />
                  <text 
                    x="0" 
                    y="-5" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill="white" 
                    fontSize="12"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    SDGs
                  </text>
                  <text 
                    x="0" 
                    y="10" 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill="white" 
                    fontSize="8"
                    className="pointer-events-none"
                  >
                    2030 Agenda
                  </text>
                </g>
              </svg>
            </motion.div>

            {/* Indicator triangle at top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <motion.div
                className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"
                animate={{
                  scale: isSpinning ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
                  duration: 0.5,
                }}
              />
            </div>

            {/* Spin Button - Enhanced with animations and states */}
            <motion.button
              onClick={spinWheel}
              disabled={isSpinning}
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundColor: isSpinning ? ['#3b82f6', '#8b5cf6', '#3b82f6'] : '#3b82f6',
              }}
              transition={{
                duration: 2,
                repeat: isSpinning ? Number.POSITIVE_INFINITY : 0,
              }}
            >
              {spinButtonText}
            </motion.button>

            {/* Previous spins history */}
            {spinHistory.length > 0 && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <span className="text-xs text-gray-400">Previous: </span>
                {spinHistory.map((id, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{ backgroundColor: goalsData.find(g => g.id === id)?.color || '#888' }}
                    onClick={(e) => handleGoalClick(id, e)}
                  >
                    {id}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Goal Information Panel - Enhanced with animations and interactivity */}
          <motion.div
            ref={contentPanelRef}
            className="w-full lg:w-1/2 lg:pl-8"
            variants={containerVariants}
            initial="hidden"
            animate={contentControls}
          >
            {currentGoal ? (
              <>
                <motion.div
                  className="p-6 rounded-lg bg-gray-800 bg-opacity-80 backdrop-blur-sm shadow-xl border-l-4"
                  style={{ borderLeftColor: currentGoal.color }}
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg"
                      style={{ backgroundColor: currentGoal.color }}
                    >
                      {/* Render custom SVG icon */}
                      {renderSDGIcon(currentGoal.icon, "#ffffff")}
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Goal {currentGoal.id}: {currentGoal.title}
                    </h2>
                  </div>

                  <motion.p 
                    className="text-lg text-gray-300 mb-4" 
                    variants={itemVariants}
                    animate={{ 
                      color: ["#CBD5E1", "#F8FAFC", "#CBD5E1"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse"
                    }}
                  >
                    {currentGoal.overview}
                  </motion.p>

                  <motion.div className="mt-6" variants={itemVariants}>
                    <h3 className="text-xl font-semibold text-white mb-2">Description:</h3>
                    <p className="text-gray-300">{currentGoal.description}</p>
                  </motion.div>

                  {/* Navigation buttons */}
                  <motion.div className="mt-6 flex justify-between" variants={itemVariants}>
                    <button
                      onClick={() => {
                        // Find previous goal (wrap around to 17 if at the beginning)
                        const prevGoalId = currentGoal.id === 1 ? 17 : currentGoal.id - 1;
                        handleGoalClick(prevGoalId, { preventDefault: () => {} });
                      }}
                      className="flex items-center text-blue-400 hover:text-blue-300"
                    >
                      <ChevronRight size={16} className="transform rotate-180 mr-1" /> Previous
                    </button>
                    
                    <button
                      onClick={() => {
                        // Find next goal (wrap around to 1 if at the end)
                        const nextGoalId = currentGoal.id === 17 ? 1 : currentGoal.id + 1;
                        handleGoalClick(nextGoalId, { preventDefault: () => {} });
                      }}
                      className="flex items-center text-blue-400 hover:text-blue-300"
                    >
                      Next <ChevronRight size={16} className="ml-1" />
                    </button>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <motion.div
                className="p-6 rounded-lg bg-gray-800 bg-opacity-80 backdrop-blur-sm shadow-xl text-center"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-white mb-4">UN Sustainable Development Goals</h2>
                <p className="text-gray-300 mb-4">
                  Spin the wheel or click on a segment to learn about each of the 17 UN Sustainable Development Goals. 
                  These global goals were established to create a better future for all by addressing the world's most pressing challenges.
                </p>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {Array.from({ length: 17 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: goalsData[idx].color }}
                      onClick={(e) => handleGoalClick(idx + 1, e)}
                    >
                      {idx + 1}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SDGWheel;