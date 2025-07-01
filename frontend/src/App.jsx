import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/Homepage";
import SDGQuiz from "./pages/QuizesPage";
import LoginSignup from "./components/Login";
import GoalContent from "./components/goalContent";
import KnowledgeBites from "./pages/knowledgeBites";
import ProfilePage from "./pages/Dashboard";
import { AboutUs, ContactUs } from "./pages/about";
import Header from "./components/Header"; 
import Footer from "./components/Footer"; 
import SDGWheel from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import SDGActionPlatform from "./components/SdgActionPlatform";
import TakeActionPage from "./components/TakeActionPage";
const App = () => {
  const location = useLocation();
  const path = location.pathname;

  // Paths where Header/Footer should be hidden
  const shouldHideLayout =
    path === "/signin" ||
    path === "/admin-dashboard" ||
    path.startsWith("/quiz");

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {!shouldHideLayout && <Header />}
      <br/><br/><br/>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sdg-wheel" element={<SDGWheel />} />
          <Route path="/sdg-actions" element={<SDGActionPlatform />} />       
          <Route path="/dashboard" element={<ProfilePage />} />
          <Route path="/goal/:id" element={<GoalContent />} />
          <Route path="/quiz/:goalId" element={<SDGQuiz />} />
          <Route path="/knowledge" element={<KnowledgeBites />} />
          <Route path="/signin" element={<LoginSignup />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
           <Route path="/take-action" element={<TakeActionPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!shouldHideLayout && <Footer />}
    </MantineProvider>
  );
};

export default App;
