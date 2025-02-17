const Footer = () => {
  return (
    <footer className="bg-white text-teal-700 shadow-md py-6 px-4 md:px-8 lg:px-16 flex flex-col items-center w-full">
      {/* Main Footer Content */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
        {/* Left Side: Logo and Tagline */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center space-x-4">
            <img src="src/assets/logo.svg" alt="SDG Logo" className="w-20 h-16 md:w-24 md:h-20" />
            <div className="text-center md:text-left">
              <h2 className="text-lg md:text-xl font-medium">Learn, Maintain, Support, Uphold</h2>
              <p className="text-base md:text-lg font-semibold mt-1">Start Contributing to a healthy community Today!!</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:text-left">
          <a href="/about" className="hover:text-green-800">About</a>
          <a href="/profile" className="hover:text-green-800">Dashboard</a>
          <a href="/contact" className="hover:text-green-800">Contact Us</a>
          <a href="/home" className="hover:text-green-800">Learn Goals</a>
          <a href="/privacy" className="hover:text-green-800">Privacy Policy</a>
          <a href="/play-quiz" className="hover:text-green-800">Play Quiz</a>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold">Let&#39;s Chat!</h3>
          <div className="flex space-x-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img src="src/assets/x-icon.svg" alt="Twitter" className="w-8 h-8" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/icons8-facebook.svg" alt="Facebook" className="w-8 h-8" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img src="/instagram.svg" alt="Instagram" className="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <hr className="w-full border-t border-gray-300 my-4" />
      <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} SDG Quest. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
