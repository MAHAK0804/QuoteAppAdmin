import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Shayaris from "./pages/Shayaris";
import AdminLogin from "./pages/Login";
import Explore from "./pages/Explore";
import SoundManager from "./pages/Sound";

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* <div className="flex-1 p-6"> */}
        <Routes>
          <Route path="/" element={<AdminLogin />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/quotes" element={<Shayaris />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/sound" element={<SoundManager />} />


        </Routes>
        {/* </div> */}
      </div>
    </Router>
  );
};

export default App;
