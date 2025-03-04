import "react";
import { Link } from "react-router-dom";
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


function SdgWheel() {
 return (
 <div className="flex justify-center items-center h-screen">
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 200 100"  // Increase the width and height values
  className="w-full h-full max-w-12xl max-h-12xl hover:cursor-pointer"
>

 <g>
 {/* SEGMENT 1 - No Poverty */}
 <Link to="/goal/1">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#E5243B"
 d="M90.46 40.57a16.6 16.6 0 0 1 2.61-3.37l-8.58-9.4c-2.16 2.05-4 4.45-5.45 7.08l11.42 5.69z"
 />
 <image
 href={poverty}
 x="84"
 y="32.5"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 1: No Poverty</title>
 </g>
 </Link>


 {/* SEGMENT 2 - Zero Hunger */}
 <Link to="/goal/2">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#DDA63A"
 d="M111.5 33.92c1.3.6 2.5 1.36 3.6 2.26l8.6-9.4a29.27 29.27 0 0 0-7.63-4.76l-4.58 11.9z"
 />
 <image
 href={Hunger}
 x="114"
 y="27"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 2: Zero Hunger</title>
 </g>
 </Link>


 {/* SEGMENT 3 - Good Health and Well-Being */}
 <Link to="/goal/3">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#4C9F38"
 d="M131.2 36.75l-11.4 5.69c.54 1.27.93 2.62 1.14 4.03l12.69-1.2c-.38-3-1.2-5.87-2.43-8.52"
 />
 <image
 href={Health}
 x="124"
 y="40"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 3: Good Health and Well-Being</title>
 </g>
 </Link>


 {/* SEGMENT 4 - Quality Education */}
 <Link to="/goal/4">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#C5192D"
 d="M118.98 40.79l11.4-5.69a29.33 29.33 0 0 0-5.33-7.07l-8.6 9.4c.98 1 1.83 2.13 2.53 3.36"
 />
 <image
 href={education}
 x="121"
 y="32"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 4: Quality Education</title>
 </g>
 </Link>


 {/* SEGMENT 5 - Gender Equality */}
 <Link to="/goal/5">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#FF3A21"
 d="M88.19 48.9c0-.26 0-.52.02-.77l-12.7-1.14a29.22 29.22 0 0 0 .8 8.96l12.27-3.51a16.42 16.42 0 0 1-.39-3.55"
 />
 <image
 href={gender}
 x="80"
 y="43"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 5: Gender Equality</title>
 </g>
 </Link>


 {/* SEGMENT 6 - Clean Water and Sanitation */}
 <Link to="/goal/6">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#26BDE2"
 d="M117.38 59.32c-.9 1.1-1.94 2.08-3.1 2.91l6.7 10.85a29.42 29.42 0 0 0 6.57-6.09l-10.17-7.67z"
 />
 <image
 href={goal6}
 x="118"
 y="63"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 6: Clean Water and Sanitation</title>
 </g>
 </Link>


 {/* SEGMENT 7 - Affordable and Clean Energy */}
 <Link to="/goal/7">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#FCC30B"
 d="M121.12 48.9c0 1.2-.13 2.37-.38 3.5L133 55.91a29.1 29.1 0 0 0 .8-8.82l-12.7 1.2.02.6"
 />
 <image
 href={goal7}
 x="125"
 y="48.5"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 7: Affordable and Clean Energy</title>
 </g>
 </Link>


 {/* SEGMENT 8 - Decent Work and Economic Growth */}
 <Link to="/goal/8">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#A21942"
 d="M92.13 59.57l-10.14 7.7a29.43 29.43 0 0 0 6.62 6l6.7-10.83a16.6 16.6 0 0 1-3.18-2.87"
 />
 <image
 href={goal8}
 x="86"
 y="56"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 8: Decent Work and Economic Growth</title>
 </g>
 </Link>


 {/* SEGMENT 9 - Industry, Innovation and Infrastructure */}
 <Link to="/goal/9">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#FD6925"
 d="M88.4 46.3c.22-1.44.64-2.81 1.21-4.1l-11.4-5.67a28.99 28.99 0 0 0-2.52 8.62l12.7 1.14z"
 />
 <image
xlinkHref={goal9}
 x="82"
 y="42"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 9: Industry, Innovation and Infrastructure</title>
 </g>
 </Link>


 {/* SEGMENT 10 - Reduced Inequalities */}
 <Link to="/goal/10">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#DD1367"
 d="M119.43 74.07l-6.7-10.84a16.4 16.4 0 0 1-3.9 1.59l2.36 12.53c2.94-.67 5.71-1.8 8.24-3.28"
 />
 <image
 href={goal10}
 x="114"
 y="70"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 10: Reduced Inequalities</title>
 </g>
 </Link>


 {/* SEGMENT 11 - Sustainable Cities and Communities */}
 <Link to="/goal/11">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#FD9D24"
 d="M120.25 54.17a16.45 16.45 0 0 1-1.78 3.67l10.18 7.67c1.65-2.37 2.95-5 3.85-7.82l-12.25-3.52z"
 />
 <image
 href={goal11}
 x="124"
 y="57"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 11: Sustainable Cities and Communities</title>
 </g>
 </Link>


 {/* SEGMENT 12 - Responsible Consumption and Production */}
 <Link to="/goal/12">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#BF8B2E"
 d="M107.03 65.18a16.58 16.58 0 0 1-4.3.06l-2.35 12.54a29.43 29.43 0 0 0 9-.07l-2.35-12.53z"
 />
 <image
 href={goal12}
 x="104"
 y="61"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 12: Responsible Consumption and Production</title>
 </g>
 </Link>


 {/* SEGMENT 13 - Climate Action */}
 <Link to="/goal/13">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#3F7E44"
 d="M105.7 32.46c1.42.1 2.78.36 4.08.79l4.58-11.9a29.02 29.02 0 0 0-8.65-1.63v12.74z"
 />
 <image
 href={goal13}
 x="106"
 y="24"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 13: Climate Action</title>
 </g>
 </Link>


 {/* SEGMENT 14 - Life Below Water */}
 <Link to="/goal/14">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#0A97D9"
 d="M100.92 64.93a16.38 16.38 0 0 1-4.04-1.53l-6.7 10.85a29.07 29.07 0 0 0 8.38 3.2l2.36-12.52z"
 />
 <image
 href={goal14}
 x="96"
 y="61"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 14: Life Below Water</title>
 </g>
 </Link>


 {/* SEGMENT 15 - Life on Land */}
 <Link to="/goal/15">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#56C02B"
 d="M99.7 33.19c1.33-.42 2.72-.67 4.16-.74V19.7c-3.06.09-6 .64-8.76 1.6l4.6 11.89z"
 />
 <image
 href={goal15}
 x="98"
 y="24"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 15: Life on Land</title>
 </g>
 </Link>


 {/* SEGMENT 16 - Peace, Justice, and Strong Institutions */}
 <Link to="/goal/16">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#00689D"
 d="M91.01 58.1c-.8-1.2-1.46-2.5-1.94-3.9l-12.25 3.52a29.1 29.1 0 0 0 4.05 8.1L91 58.1z"
 />
 <image
 href={goal16}
 x="81"
 y="56.5"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 16: Peace, Justice, and Strong Institutions</title>
 </g>
 </Link>


 {/* SEGMENT 17 - Partnerships for the Goals */}
 <Link to="/goal/17">
 <g className="transition-all duration-300 hover:opacity-80 hover:drop-shadow-lg">
 <path
 fill="#19486A"
 d="M94.45 35.98a16.46 16.46 0 0 1 3.53-2.14l-4.6-11.88a29.2 29.2 0 0 0-7.52 4.6l8.6 9.42z"
 />
 <image
 href={goal17}
 x="90.5"
 y="27"
 width="5"
 height="5"
 className="cursor-pointer"
 />
 <title>Goal 17: Partnerships for the Goals</title>
 </g>
 </Link>
 </g>
 </svg>
 </div>
 );
}


export default SdgWheel;
