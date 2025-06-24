import { useState } from "react";
import { Link } from "react-router-dom";
// import Header from '../components/Header';
// import Footer from '../components/Footer'; // Update for React Router

const sdgs = [
  { goal: "No Poverty", color: "bg-red-500" },
  { goal: "Zero Hunger", color: "bg-yellow-500" },
  { goal: "Good Health and Well-being", color: "bg-green-500" },
  { goal: "Quality Education", color: "bg-red-600" },
  { goal: "Gender Equality", color: "bg-orange-500" },
  { goal: "Clean Water and Sanitation", color: "bg-blue-500" },
  { goal: "Affordable and Clean Energy", color: "bg-yellow-600" },
  { goal: "Decent Work and Economic Growth", color: "bg-red-700" },
  { goal: "Industry, Innovation and Infrastructure", color: "bg-orange-600" },
  { goal: "Reduced Inequality", color: "bg-pink-500" },
  { goal: "Sustainable Cities and Communities", color: "bg-yellow-700" },
  { goal: "Responsible Consumption and Production", color: "bg-orange-700" },
  { goal: "Climate Action", color: "bg-green-600" },
  { goal: "Life Below Water", color: "bg-blue-600" },
  { goal: "Life on Land", color: "bg-green-700" },
  { goal: "Peace, Justice and Strong Institutions", color: "bg-blue-700" },
  { goal: "Partnerships for the Goals", color: "bg-purple-500" },
];

const impactAreas = [
  {
    icon: "🏆",
    title: "Gamified Quests",
    description: "Participate in fun and impactful challenges related to different SDGs.",
  },
  { icon: "🎓", title: "Educational Resources", description: "Learn through articles, quizzes, and workshops." },
  {
    icon: "🌍",
    title: "Community Engagement",
    description: "Collaborate with like-minded individuals and organizations.",
  },
  { icon: "📢", title: "Advocacy & Awareness", description: "Spread knowledge and drive real change." },
];

function AboutUs() {

  const [hoveredSDG, setHoveredSDG] = useState(null);

  return (
    <div>
         
          <div className="py-39 max-w-6xl mx-auto">
        
    

      {/* Intro Section */}
      <section className="mb-12 bg-blue-50 p-6 rounded-lg shadow-md">
        <p className="text-lg mb-4 text-gray-700 leading-relaxed">
          Welcome to SDG Quest, a platform dedicated to driving global awareness and action toward achieving the United
          Nations Sustainable Development Goals (SDGs). We believe in making sustainability engaging and accessible
          through interactive challenges, educational resources, and real-world impact.
        </p>
      </section>

      {/* SDGs Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-teal-700">What Are the SDGs?</h2>
        <p className="mb-6 text-gray-700 leading-relaxed">
          The Sustainable Development Goals (SDGs) are a collection of 17 global goals set by the United Nations to
          address urgent challenges, including poverty, climate action, gender equality, quality education, and
          sustainable communities. These goals aim to create a better future for people and the planet by 2030.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sdgs.map((sdg, index) => (
            <div
              key={index}
              className={`${sdg.color} text-white text-center p-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer`}
              onMouseEnter={() => setHoveredSDG(index)}
              onMouseLeave={() => setHoveredSDG(null)}
            >
              <span className={`text-2xl font-bold ${hoveredSDG === index ? "hidden" : "block"}`}>{index + 1}</span>
              <span className={`text-sm ${hoveredSDG === index ? "block" : "hidden"}`}>{sdg.goal}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Areas */}
      <section className="mb-12 bg-green-50 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">Our Mission</h2>
        <p className="mb-4 text-gray-700">At SDG Quest, our mission is to:</p>
        <ul className="list-none space-y-2 mb-4">
          {[
            "Educate individuals and communities about the importance of SDGs.",
            "Engage users through interactive challenges and learning modules.",
            "Empower people to take real-world actions and contribute to sustainability.",
          ].map((item, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How We Make an Impact Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-700">How We Make an Impact</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {impactAreas.map((area, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <div className="text-4xl mb-2">{area.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{area.title}</h3>
              <p className="text-gray-700">{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Get in Touch Section */}
      <section className="mb-12 bg-yellow-50 p-6 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-semibold mb-4 text-yellow-700">Join Us in Our Journey!</h2>
        <p className="mb-6 text-gray-700">
          Whether you&apos;re a student, educator, business, or NGO, SDG Quest is your platform to take meaningful action
          toward a sustainable future. Let&apos;s create impact, one quest at a time!
        </p>
        <Link
          to="/contact" // React Router Update
          className="bg-yellow-500 text-white px-8 py-3 rounded-full hover:bg-yellow-600 transition duration-300 inline-block text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Get Started
        </Link>
      </section>
      
    </div>
  
    </div>
  );
}

 function ContactUs() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitFeedback, setSubmitFeedback] = useState("");
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitFeedback("");
  
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1500));
  
      setIsSubmitting(false);
      setSubmitFeedback("Thank you for your message. We'll get back to you soon!");
      setFormData({ name: "", email: "", message: "" });
    };
  
    return (
        <div>
           
      <div className="py-30 max-w-2xl mx-auto">
        
        <h1 className="text-4xl font-bold mb-8 text-center text-teal-600">Contact Us</h1>
        <div className="bg-white shadow-md rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 transform hover:-translate-y-1 hover:shadow-lg"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
          {submitFeedback && (
            <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              <p className="font-medium">{submitFeedback}</p>
            </div>
          )}
        </div>
       
      </div>
    
      </div>
    );
  }
  export { AboutUs, ContactUs };