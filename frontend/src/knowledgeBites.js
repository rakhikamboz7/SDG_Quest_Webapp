import goal1 from "./assets/goal1.ico";
import goal2 from "./assets/goal2.ico";
import goal3 from "./assets/goal3.ico";
import goal4 from "./assets/goal4.svg.ico";
import goal5 from "./assets/goal5.svg.ico";
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

// Changed from object to array structure for easier mapping
export const knowledgeBites = [
  {
    id: 1,
    icon: goal1,
    color: '#E5243B',
    title: 'No Poverty',
    tips: [
      'Support local businesses and entrepreneurs from low-income communities',
      'Donate to reliable microfinance organizations',
      'Advocate for fair wages and social protection policies',
      'Volunteer at local poverty alleviation programs',
      'Support education initiatives for underprivileged children'
    ],
    solutions: [
      'Implementation of universal basic income programs',
      'Expanding access to financial services and credit',
      'Creating job training and skill development programs',
      'Establishing social safety nets and welfare systems',
      'Developing affordable housing initiatives'
    ]
  },
  {
    id: 2,
    icon: goal2,
    color: '#DDA63A',
    title: 'Zero Hunger',
    tips: [
      'Reduce food waste by planning meals and storing food properly',
      'Support local farmers and farmers markets',
      'Participate in community gardens',
      'Donate to food banks and hunger relief organizations',
      'Choose sustainable food options'
    ],
    solutions: [
      'Implementing sustainable agriculture practices',
      'Improving food distribution systems',
      'Developing drought-resistant crops',
      'Creating food waste reduction programs',
      'Establishing school feeding programs'
    ]
  },
  {
    id: 3,
    icon: goal3,
    color: '#4C9F38',
    title: 'Good Health and Well-being',
    tips: [
      'Practice regular exercise and maintain a healthy diet',
      'Get regular health check-ups',
      'Support mental health awareness',
      'Promote vaccination programs',
      'Practice proper hygiene habits'
    ],
    solutions: [
      'Expanding healthcare access in rural areas',
      'Developing telemedicine infrastructure',
      'Implementing preventive healthcare programs',
      'Creating mental health support systems',
      'Improving maternal healthcare services'
    ]
  },
  {
    id: 4,
    icon: goal4,
    color: '#C5192D',
    title: 'Quality Education',
    tips: [
      'Support local education initiatives',
      'Mentor students in your community',
      'Donate educational materials and books',
      'Advocate for inclusive education',
      'Share skills through volunteer teaching'
    ],
    solutions: [
      'Developing digital learning platforms',
      'Creating accessible educational infrastructure',
      'Implementing teacher training programs',
      'Establishing adult education centers',
      'Providing educational scholarships'
    ]
  },
  {
    id: 5,
    icon: goal5,
    color: '#FF3A21',
    title: 'Gender Equality',
    tips: [
      'Challenge gender stereotypes',
      'Support women-owned businesses',
      'Advocate for equal pay',
      'Promote girls\' education',
      'Support women\'s leadership initiatives'
    ],
    solutions: [
      'Implementing workplace equality policies',
      'Creating women\'s empowerment programs',
      'Developing gender-sensitive legislation',
      'Establishing support systems for working mothers',
      'Creating mentorship programs for women'
    ]
  },
  {
    id: 6,
    icon: goal6,
    color: '#26BDE2',
    title: 'Clean Water and Sanitation',
    tips: [
      'Conserve water in daily activities',
      'Avoid water pollution',
      'Support water conservation projects',
      'Use water-efficient appliances',
      'Report water leaks promptly'
    ],
    solutions: [
      'Developing water purification systems',
      'Implementing rainwater harvesting',
      'Creating sustainable sewage treatment',
      'Establishing water management policies',
      'Building efficient irrigation systems'
    ]
  },
  {
    id: 7,
    icon: goal7,
    color: '#FCC30B',
    title: 'Affordable and Clean Energy',
    tips: [
      'Use energy-efficient appliances',
      'Install solar panels where possible',
      'Support renewable energy initiatives',
      'Reduce energy consumption',
      'Choose green energy providers'
    ],
    solutions: [
      'Expanding renewable energy infrastructure',
      'Developing smart grid systems',
      'Creating energy storage solutions',
      'Implementing energy efficiency policies',
      'Supporting clean energy research'
    ]
  },
  {
    id: 8,
    icon: goal8,
    color: '#A21942',
    title: 'Decent Work and Economic Growth',
    tips: [
      'Support fair trade products',
      'Promote workplace safety',
      'Advocate for workers\' rights',
      'Support small businesses',
      'Promote ethical business practices'
    ],
    solutions: [
      'Creating job training programs',
      'Developing small business support systems',
      'Implementing fair labor policies',
      'Establishing worker protection laws',
      'Creating entrepreneurship opportunities'
    ]
  },
  {
    id: 9,
    icon: goal9,
    color: '#FD6925',
    title: 'Industry, Innovation and Infrastructure',
    tips: [
      'Support sustainable industries',
      'Promote innovation in your workplace',
      'Use sustainable transportation',
      'Support infrastructure development',
      'Embrace new technologies'
    ],
    solutions: [
      'Developing smart cities',
      'Creating sustainable industrial zones',
      'Implementing green manufacturing',
      'Building resilient infrastructure',
      'Supporting technological innovation'
    ]
  },
  {
    id: 10,
    icon: goal10,
    color: '#DD1367',
    title: 'Reduced Inequalities',
    tips: [
      'Promote inclusive practices',
      'Support diversity initiatives',
      'Challenge discrimination',
      'Advocate for equal opportunities',
      'Support marginalized communities'
    ],
    solutions: [
      'Implementing inclusive policies',
      'Creating equal opportunity programs',
      'Developing anti-discrimination laws',
      'Establishing social mobility initiatives',
      'Supporting inclusive education'
    ]
  },
  {
    id: 11,
    icon: goal11,
    color: '#FD9D24',
    title: 'Sustainable Cities and Communities',
    tips: [
      'Use public transportation',
      'Support local community projects',
      'Participate in urban gardening',
      'Promote recycling programs',
      'Support sustainable urban planning'
    ],
    solutions: [
      'Developing green building standards',
      'Creating sustainable transport systems',
      'Implementing smart city technologies',
      'Establishing community spaces',
      'Building resilient urban infrastructure'
    ]
  },
  {
    id: 12,
    icon: goal12,
    color: '#BF8B2E',
    title: 'Responsible Consumption and Production',
    tips: [
      'Practice responsible shopping',
      'Reduce waste generation',
      'Choose sustainable products',
      'Support eco-friendly brands',
      'Practice recycling and composting'
    ],
    solutions: [
      'Implementing circular economy practices',
      'Developing sustainable supply chains',
      'Creating waste reduction programs',
      'Establishing recycling infrastructure',
      'Promoting sustainable production methods'
    ]
  },
  {
    id: 13,
    icon: goal13,
    color: '#3F7E44',
    title: 'Climate Action',
    tips: [
      'Reduce carbon footprint',
      'Support climate initiatives',
      'Use renewable energy',
      'Practice energy conservation',
      'Promote environmental awareness'
    ],
    solutions: [
      'Implementing carbon reduction policies',
      'Developing clean energy systems',
      'Creating climate resilient infrastructure',
      'Establishing emission control measures',
      'Supporting green technology development'
    ]
  },
  {
    id: 14,
    icon: goal14,
    color: '#0A97D9',
    title: 'Life Below Water',
    tips: [
      'Reduce plastic usage',
      'Support ocean cleanup initiatives',
      'Choose sustainable seafood',
      'Avoid harmful chemicals',
      'Participate in beach cleanups'
    ],
    solutions: [
      'Creating marine protected areas',
      'Implementing sustainable fishing practices',
      'Developing ocean cleanup technologies',
      'Establishing water pollution controls',
      'Supporting marine conservation'
    ]
  },
  {
    id: 15,
    icon: goal15,
    color: '#56C02B',
    title: 'Life on Land',
    tips: [
      'Plant trees and support reforestation',
      'Protect local wildlife',
      'Support conservation efforts',
      'Practice sustainable gardening',
      'Reduce paper consumption'
    ],
    solutions: [
      'Implementing forest protection policies',
      'Creating wildlife corridors',
      'Developing sustainable land use practices',
      'Establishing biodiversity preservation',
      'Supporting ecosystem restoration'
    ]
  },
  {
    id: 16,
    icon: goal16,
    color: '#00689D',
    title: 'Peace, Justice and Strong Institutions',
    tips: [
      'Promote peaceful dialogue',
      'Support transparency initiatives',
      'Participate in local governance',
      'Report corruption',
      'Support human rights'
    ],
    solutions: [
      'Strengthening justice systems',
      'Developing anti-corruption measures',
      'Creating conflict resolution mechanisms',
      'Implementing good governance practices',
      'Establishing peace-building programs'
    ]
  },
  {
    id: 17,
    icon: goal17,
    color: '#19486A',
    title: 'Partnerships for the Goals',
    tips: [
      'Build community partnerships',
      'Support international cooperation',
      'Promote knowledge sharing',
      'Engage in global initiatives',
      'Foster cross-sector collaboration'
    ],
    solutions: [
      'Creating global partnership platforms',
      'Developing cooperation frameworks',
      'Implementing resource sharing systems',
      'Establishing international networks',
      'Supporting collaborative projects'
    ]
  }
];

export default knowledgeBites;
