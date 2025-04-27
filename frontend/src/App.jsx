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

const App = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/signin";
  const isQuzPage = location.pathname === "/quiz/:goalId";

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {" "}
      {!isAuthPage && isQuzPage && <Header />}{" "}
      <main>
        {" "}
        <Routes>
          {" "}
          <Route path="/" element={<HomePage />} />{" "}
          <Route path="/home" element={<SDGWheel />}/>{" "}          
          <Route path="/dashboard" element={<ProfilePage />} />{" "}
          <Route path="/goal/:id" element={<GoalContent />} />{" "}
          <Route path="/quiz/:goalId" element={<SDGQuiz />} />{" "}
          <Route path="/knowledge" element={<KnowledgeBites />} />{" "}
          <Route path="/signin" element={<LoginSignup />} />{" "}
          <Route path="/about" element={<AboutUs />} />{" "}
          <Route path="/contact" element={<ContactUs />} />{" "}
        </Routes>{" "}
      </main>{" "}
      {!isAuthPage && isQuzPage && <Footer />}{" "}
    </MantineProvider>
  );
};

export default App;
