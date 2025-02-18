import { Routes, Route } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';


import Home from './pages/Home';
import HomePage from './pages/Homepage';
import SDGQuiz from './pages/QuizesPage';
import LoginSignup from './components/Login';
import GoalContent from './components/goalContent';
import KnowledgeBites from './pages/knowledgeBites';
import ProfilePage from "./pages/Dashboard";
import { AboutUs, ContactUs } from "./pages/about";
import { API_BASE_URL } from "./config";


const App = () => {
    console.log({API_BASE_URL});
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
        
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<Home />} />
                    {/* <Route path="/profile" element={<ProfilePage />} /> */}
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/goal/:id" element={<GoalContent />} />
                    <Route path="/quiz/:goalId" element={<SDGQuiz />} />
                    <Route path="/knowledge" element={<KnowledgeBites />} />
                    <Route path="/signup" element={<LoginSignup />} />
                    <Route path="/about" element ={< AboutUs/>}/>
                    <Route path="/contact" element ={<ContactUs/>}/>
                </Routes>
               
            
        </MantineProvider>
    );
};

export default App;

