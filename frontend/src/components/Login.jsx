import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

function LoginSignup() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError('');
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    try {
      await axios.post(`${BACKEND_URL}/register`, formData);
      alert('Registration successful!');
      resetForm();
      setIsSignUp(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${BACKEND_URL}/login`, {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', res.data.userId);

      const userRes = await axios.get(`${BACKEND_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = {
        name: userRes.data.name,
        email: userRes.data.email,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      alert(`Welcome, ${userData.name}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen">
      {!user ? (
        <div className="relative bg-white w-full md:w-[800px] m-10 max-w-full min-h-[400px] h-[500px] rounded-3xl shadow-lg overflow-hidden transition-all duration-500">
          {/* Mobile View */}
          <div className="md:hidden m-10 py-0">
            <div className="flex flex-col items-center justify-center mb-6">
              <img src="logo.svg" alt="Logo" className="w-12 h-12 mb-2" />
              <h1 className="text-2xl font-semibold mb-2">
                {isSignUp ? "Create an Account" : "Sign In"}
              </h1>
            </div>
            <form onSubmit={isSignUp ? handleRegister : handleLogin}>
              {isSignUp && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
                />
              )}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
              />
              {isSignUp && (
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
                />
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-700 text-white px-6 py-2 mt-3 rounded-md focus:outline-none hover:bg-teal-600 disabled:opacity-50"
              >
                {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>
            <button 
              onClick={handleToggle}
              className="w-full bg-teal-700 text-white px-8 py-2 rounded-md focus:outline-none hover:bg-teal-600 mt-3 p"
            >
              {isSignUp ? "Already a member? Sign In" : "New here? Sign Up"}
            </button>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="flex flex-col md:flex-row w-full">
              {/* Sign In Form */}
              <div
                className={`flex flex-col items-center justify-center p-15 w-full md:w-1/2 transition-opacity duration-500 ${
                  isSignUp ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
                }`}
              >
                <img src="logo.svg" alt="Logo" className="w-15 h-25 mb-4 rounded-full" />
                <h1 className="text-2xl mb-5 font-semibold">Sign In</h1>
                <div className="flex justify-center mb-4 space-x-4">
                  <button className="text-2xl cursor-pointer"><FaGoogle /></button>
                  <button className="text-2xl cursor-pointer"><FaFacebook /></button>
                  <button className="text-2xl cursor-pointer"><FaGithub /></button>
                  <button className="text-2xl cursor-pointer"><FaLinkedin /></button>
                </div>
                <p className="text-sm mb-2 text-gray-500">Or use your email for login</p>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-700 text-white px-6 py-2 rounded-md focus:outline-none hover:bg-teal-600 disabled:opacity-50 ml-21"
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              </div>

              {/* Sign Up Form */}
              <div
                className={`flex flex-col items-center justify-center p-15 w-full ms-20 md:w-1/2 transition-opacity duration-500 ${
                  isSignUp ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
              >
                <img src="/logo.svg" alt="Logo" className="w-15 h-20 mt-0" />
                <h1 className="text-2xl mb-5 font-semibold">Create an Account</h1>
                <div className="flex justify-center mb-4 space-x-4">
                  <button className="text-2xl cursor-pointer"><FaGoogle /></button>
                  <button className="text-2xl cursor-pointer"><FaFacebook /></button>
                  <button className="text-2xl cursor-pointer"><FaGithub /></button>
                  <button className="text-2xl cursor-pointer"><FaLinkedin /></button>
                </div>
                <p className="text-sm mb-2 text-gray-500">Or provide us with your info!</p>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleRegister} encType="multipart/form-data">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full p-2 mb-2 border rounded-md text-sm outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-700 text-white px-6 py-2 rounded-md focus:outline-none hover:bg-teal-600 disabled:opacity-50 ml-22 justify-center"
                  >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </form>
              </div>
            </div>

            {/* Toggle Panel */}
            <div
              className={`absolute top-0 left-1/2 w-1/2 h-full bg-teal-700 text-white flex flex-col items-center justify-center transition-transform duration-500 ${
                isSignUp ? "-translate-x-full" : "translate-x-0"
              }`}
            >
              <h1 className="text-2xl mb-3">{isSignUp ? "Already a member?" : "New here?"}</h1>
              <p className="text-sm mb-4">
                {isSignUp ? "Back for more? Let's dive into the action!" : "Join us to get started!"}
              </p>
              <button
                onClick={handleToggle}
                className="border border-white px-6 py-2 rounded-md hover:bg-white hover:text-teal-700 transition duration-300"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl">Welcome, {user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}

export default LoginSignup;