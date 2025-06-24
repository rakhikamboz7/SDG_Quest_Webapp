// Static SDG Goals data with icons and fallback information
import goal1 from "./assets/goal1.ico"
import goal2 from "./assets/goal2.ico"
import goal3 from "./assets/goal3.ico"
import goal4 from "./assets/goal4.svg.ico"
import goal5 from "./assets/goal5.svg.ico"
import goal6 from "./assets/goal6.svg.ico"
import goal7 from "./assets/goal7.png.ico"
import goal8 from "./assets/goal8.svg.ico"
import goal9 from "./assets/goal9.svg.ico"
import goal10 from "./assets/goal10.png.ico"
import goal11 from "./assets/goal11.svg.ico"
import goal12 from "./assets/goal12.svg.ico"
import goal13 from "./assets/goal13.svg.ico"
import goal14 from "./assets/goal14.svg.ico"
import goal15 from "./assets/goal15.svg.ico"
import goal16 from "./assets/goal16.svg.ico"
import goal17 from "./assets/goal17.svg.ico"


export const goalDetails = {
  1: {
    goalNumber: 1,
    title: "No Poverty",
    shortDescription: "End poverty in all its forms everywhere",
    overview: "Goal 1 aims to end poverty in all its forms everywhere.",
    color: "#E5243B",
    icon: goal1, 
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-01.jpg",
    description:
      "Poverty is more than the lack of income and resources to ensure a sustainable livelihood. Its manifestations include hunger and malnutrition, limited access to education and other basic services, social discrimination and exclusion as well as the lack of participation in decision-making.",
    knowledgeBite:
      "Did you know? Over 700 million people still live in extreme poverty today, surviving on less than $1.90 per day!",
    keyPoints: [
      "Eradicate extreme poverty for all people everywhere",
      "Reduce at least by half the proportion of men, women and children living in poverty",
      "Implement nationally appropriate social protection systems",
      "Ensure equal rights to economic resources and basic services",
    ],
  },
  2: {
    goalNumber: 2,
    title: "Zero Hunger",
    shortDescription: "End hunger, achieve food security and improved nutrition",
    overview: "Goal 2 seeks sustainable solutions to end hunger and achieve food security for all.",
    color: "#DDA63A",
    icon: goal2,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-02.jpg",
    description:
      "The food and agriculture sector offers key solutions for development, and is central for hunger and poverty eradication. It is time to rethink how we grow, share and consume our food.",
    knowledgeBite: "Amazing fact: We produce enough food to feed everyone on Earth, yet 1 in 9 people still go hungry!",
    keyPoints: [
      "End hunger and ensure access to safe, nutritious food",
      "End all forms of malnutrition",
      "Double agricultural productivity of small-scale food producers",
      "Ensure sustainable food production systems",
    ],
  },
  3: {
    goalNumber: 3,
    title: "Good Health and Well-Being",
    shortDescription: "Ensure healthy lives and promote well-being for all",
    overview: "Goal 3 ensures healthy lives and promotes well-being at all ages.",
    color: "#4C9F38",
    icon : goal3,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-03.jpg",
    description: "Ensuring healthy lives and promoting well-being at all ages is essential to sustainable development.",
    knowledgeBite:
      "Incredible progress: Child mortality has been cut in half since 1990, saving millions of young lives!",
    keyPoints: [
      "Reduce global maternal mortality ratio",
      "End preventable deaths of newborns and children",
      "End epidemics of AIDS, tuberculosis, malaria",
      "Achieve universal health coverage",
    ],
  },
  4: {
    goalNumber: 4,
    title: "Quality Education",
    shortDescription: "Ensure inclusive and equitable quality education",
    overview: "Goal 4 ensures inclusive and equitable quality education.",
    color: "#C5192D",
    icon: goal4,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-04.jpg",
    description: "Obtaining a quality education is the foundation to creating sustainable development.",
    knowledgeBite: "Education power: For every year of schooling, a person's income increases by about 10%!",
    keyPoints: [
      "Ensure free, equitable and quality primary and secondary education",
      "Ensure equal access to affordable quality technical education",
      "Eliminate gender disparities in education",
      "Build and upgrade education facilities",
    ],
  },
  5: {
    goalNumber: 5,
    title: "Gender Equality",
    shortDescription: "Achieve gender equality and empower all women and girls",
    overview: "Goal 5 aims to achieve gender equality and empower all women and girls.",
    color: "#FF3A21",
    icon: goal5,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-05.jpg",
    description:
      "Gender equality is not only a fundamental human right, but a necessary foundation for a peaceful, prosperous and sustainable world.",
    knowledgeBite: "Empowerment fact: Countries with more women in leadership have better environmental policies!",
    keyPoints: [
      "End all forms of discrimination against women and girls",
      "Eliminate all forms of violence against women and girls",
      "Eliminate harmful practices like child marriage",
      "Ensure full participation in leadership and decision-making",
    ],
  },
  6: {
    goalNumber: 6,
    title: "Clean Water and Sanitation",
    shortDescription: "Ensure availability and sustainable management of water",
    overview: "Goal 6 aims to ensure availability and sustainable management of water and sanitation for all.",
    color: "#26BDE2",
    icon: goal6,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-06.jpg",
    description: "Clean, accessible water for all is an essential part of the world we want to live in.",
    knowledgeBite: "Water wisdom: A person can survive weeks without food, but only days without water!",
    keyPoints: [
      "Achieve universal access to safe and affordable drinking water",
      "Achieve access to adequate sanitation and hygiene",
      "Improve water quality and reduce pollution",
      "Increase water-use efficiency across all sectors",
    ],
  },
  7: {
    goalNumber: 7,
    title: "Affordable and Clean Energy",
    shortDescription: "Ensure access to affordable, reliable, sustainable energy",
    overview: "Goal 7 ensures access to affordable, reliable, sustainable, and modern energy for all.",
    color: "#FCC30B",
    icon: goal7,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-07.jpg",
    description: "Energy is central to nearly every major challenge and opportunity the world faces today.",
    knowledgeBite: "Solar power: The sun provides more energy to Earth in one hour than humanity uses in a year!",
    keyPoints: [
      "Ensure universal access to affordable, reliable modern energy services",
      "Increase substantially the share of renewable energy",
      "Double the global rate of improvement in energy efficiency",
      "Enhance international cooperation on clean energy",
    ],
  },
  8: {
    goalNumber: 8,
    title: "Decent Work and Economic Growth",
    shortDescription: "Promote sustained, inclusive economic growth",
    overview: "Goal 8 promotes sustained, inclusive economic growth.",
    color: "#A21942",
    icon: goal8,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-08.jpg",
    description:
      "Sustained and inclusive economic growth can drive progress, create decent jobs for all and improve living standards.",
    knowledgeBite: "Job creation: Small and medium enterprises employ about 70% of workers worldwide!",
    keyPoints: [
      "Sustain per capita economic growth",
      "Achieve higher levels of economic productivity",
      "Promote policies that support decent job creation",
      "Eradicate forced labor, modern slavery and human trafficking",
    ],
  },
  9: {
    goalNumber: 9,
    title: "Industry, Innovation and Infrastructure",
    shortDescription: "Build resilient infrastructure, promote innovation",
    overview: "Goal 9 focuses on building resilient infrastructure and fostering innovation.",
    color: "#FD6925",
    icon: goal9,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-09.jpg",
    description:
      "Investments in infrastructure are crucial to achieving sustainable development and empowering communities.",
    knowledgeBite: "Innovation impact: Mobile phones have connected more people than any technology in human history!",
    keyPoints: [
      "Develop quality, reliable, sustainable infrastructure",
      "Promote inclusive and sustainable industrialization",
      "Increase access to financial services and markets",
      "Upgrade infrastructure and retrofit industries for sustainability",
    ],
  },
  10: {
    goalNumber: 10,
    title: "Reduced Inequalities",
    shortDescription: "Reduce inequality within and among countries",
    overview: "Goal 10 aims to reduce inequalities within and among countries.",
    color: "#DD1367",
    icon: goal10,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-10.jpg",
    description:
      "Reducing inequalities and ensuring no one is left behind are integral to achieving the Sustainable Development Goals.",
    knowledgeBite: "Equality boost: More equal societies have higher levels of trust and social cohesion!",
    keyPoints: [
      "Progressively achieve and sustain income growth for bottom 40%",
      "Empower and promote social, economic inclusion of all",
      "Ensure equal opportunity and reduce outcome inequalities",
      "Adopt policies for greater equality",
    ],
  },
  11: {
    goalNumber: 11,
    title: "Sustainable Cities and Communities",
    shortDescription: "Make cities inclusive, safe, resilient and sustainable",
    overview: "Goal 11 seeks to make cities inclusive, safe, resilient, and sustainable.",
    color: "#FD9D24",
    icon: goal11,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-11.jpg",
    description:
      "Cities and metropolitan areas are powerhouses of economic growth, contributing about 60% of global GDP.",
    knowledgeBite: "Urban future: By 2050, nearly 70% of the world's population will live in cities!",
    keyPoints: [
      "Ensure access to adequate, safe housing for all",
      "Provide access to safe, affordable transport systems",
      "Enhance inclusive and sustainable urbanization",
      "Strengthen efforts to protect cultural and natural heritage",
    ],
  },
  12: {
    goalNumber: 12,
    title: "Responsible Consumption and Production",
    shortDescription: "Ensure sustainable consumption and production patterns",
    overview: "Goal 12 promotes sustainable consumption and production patterns.",
    color: "#BF8B2E",
    icon: goal12,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-12.jpg",
    description: "Sustainable consumption and production is about doing more and better with less.",
    knowledgeBite:
      "Waste fact: If food waste were a country, it would be the third-largest emitter of greenhouse gases!",
    keyPoints: [
      "Implement the 10-year framework on sustainable consumption",
      "Achieve sustainable management and efficient use of natural resources",
      "Halve per capita global food waste",
      "Achieve environmentally sound management of chemicals and waste",
    ],
  },
  13: {
    goalNumber: 13,
    title: "Climate Action",
    shortDescription: "Take urgent action to combat climate change",
    overview: "Goal 13 calls for urgent action to combat climate change.",
    color: "#3F7E44",
    icon: goal13,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-13.jpg",
    description:
      "Climate change is affecting every country on every continent, disrupting national economies and affecting lives.",
    knowledgeBite: "Climate hope: Renewable energy is now the cheapest source of power in most parts of the world!",
    keyPoints: [
      "Strengthen resilience and adaptive capacity to climate hazards",
      "Integrate climate change measures into policies and planning",
      "Improve education and awareness on climate change",
      "Implement commitment to climate finance",
    ],
  },
  14: {
    goalNumber: 14,
    title: "Life Below Water",
    shortDescription: "Conserve and sustainably use the oceans, seas",
    overview: "Goal 14 aims to conserve and sustainably use oceans and seas.",
    color: "#0A97D9",
    icon: goal14,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-14.jpg",
    description: "The world's oceans drive global systems that make the Earth habitable for humankind.",
    knowledgeBite: "Ocean magic: Oceans produce over 50% of the oxygen we breathe and absorb 25% of CO2 emissions!",
    keyPoints: [
      "Prevent and reduce marine pollution",
      "Sustainably manage and protect marine ecosystems",
      "Minimize ocean acidification",
      "Regulate harvesting and end overfishing",
    ],
  },
  15: {
    goalNumber: 15,
    title: "Life on Land",
    shortDescription: "Protect, restore and promote sustainable use of ecosystems",
    overview: "Goal 15 focuses on protecting terrestrial ecosystems.",
    color: "#56C02B",
    icon: goal15,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-15.jpg",
    description:
      "Nature is critical to our survival: it provides oxygen, regulates weather patterns, and pollinates our crops.",
    knowledgeBite:
      "Forest power: A single tree can absorb 48 pounds of CO2 per year and produce oxygen for two people!",
    keyPoints: [
      "Ensure conservation and restoration of terrestrial ecosystems",
      "Promote sustainable management of forests",
      "Combat desertification and restore degraded land",
      "Take urgent action to reduce degradation of natural habitats",
    ],
  },
  16: {
    goalNumber: 16,
    title: "Peace, Justice and Strong Institutions",
    shortDescription: "Promote peaceful and inclusive societies",
    overview: "Goal 16 promotes peaceful societies.",
    color: "#00689D",
    icon: goal16,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-16.jpg",
    description:
      "Conflict, insecurity, weak institutions and limited access to justice remain a great threat to sustainable development.",
    knowledgeBite: "Peace dividend: Countries with strong institutions grow 2-3 times faster economically!",
    keyPoints: [
      "Reduce violence and related death rates everywhere",
      "End abuse, exploitation, trafficking of children",
      "Promote rule of law and ensure equal access to justice",
      "Develop effective, accountable institutions at all levels",
    ],
  },
  17: {
    goalNumber: 17,
    title: "Partnerships for the Goals",
    shortDescription: "Strengthen the means of implementation and revitalize partnerships",
    overview: "Goal 17 emphasizes strengthening global partnerships.",
    color: "#19486A",
    icon: goal17,
    heroImage: "https://sdgs.un.org/sites/default/files/goals/E_SDG_Icons-17.jpg",
    description:
      "The SDGs can only be realized with strong global partnerships and cooperation built upon shared values.",
    knowledgeBite: "Partnership power: International cooperation has helped eradicate diseases and connect the world!",
    keyPoints: [
      "Strengthen domestic resource mobilization",
      "Enhance North-South, South-South cooperation",
      "Promote development of sound technologies",
      "Enhance global partnership for sustainable development",
    ],
  },
}

// Helper function to get goal details with fallback
export const getGoalDetails = (goalNumber) => {
  return goalDetails[goalNumber] || null
}

// Helper function to merge Sanity data with static data
export const mergeGoalData = (sanityGoal, staticGoal) => {
  if (!staticGoal) return sanityGoal

  return {
    ...staticGoal,
    ...sanityGoal,
    // Always use static icon and preserve shortDescription if not in Sanity
    icon: staticGoal.icon,
    shortDescription: sanityGoal.shortDescription || staticGoal.shortDescription,
    knowledgeBite: sanityGoal.knowledgeBite || staticGoal.knowledgeBite,
    keyPoints: sanityGoal.keyPoints || staticGoal.keyPoints,
  }
}
