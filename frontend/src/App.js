import axios from "axios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import EndingPage from './pages/EndingPage';
import Instruction from './pages/Instruction';
import LandingPage from "./pages/LandingPage";
import LogInPage from './pages/LogInPage';
import MyPage from './pages/MyPage';
import YogaCoach from './pages/YogaCoach';
import YogaList from './pages/YogaList';
import RoutinePage from './pages/RoutinePage';
import AboutPage from './pages/AboutPage';


axios.defaults.baseURL = "http://3.35.60.125:8080/yf";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* 웹 서비스 소개 페이지 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        {/* <Instruction /> */}
        <Route path="/Instruction" element={<Instruction />} />
        {/* <YogaCoach /> */}
        <Route path="/YogaCoach" element={<YogaCoach />} />
        {/* <LogInPage /> */}
        <Route path="/LogInPage" element={<LogInPage />} />
        {/* <YogaList /> */}
        <Route path="/YogaList" element={<YogaList />} />
        {/* <MyPage /> */}
        <Route path="/MyPage" element={<MyPage />} />
        {/* <EndingPage /> */}
        <Route path="/EndingPage" element={<EndingPage />} />
        {/* <RoutinePage /> */}
        <Route path="/RoutinePage" element={<RoutinePage />} />
        {/* <AboutPage /> */}
        <Route path="/AboutPage" element={<AboutPage />} />
      </Routes>
    </BrowserRouter> 
  );
}

export default App;
