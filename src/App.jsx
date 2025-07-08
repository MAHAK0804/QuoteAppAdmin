import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Shayaris from "./pages/Shayaris";
import AdminLogin from "./pages/Login";

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* <div className="flex-1 p-6"> */}
        <Routes>
          <Route path="/" element={<AdminLogin />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/shayaris" element={<Shayaris />} />
        </Routes>
        {/* </div> */}
      </div>
    </Router>
  );
};

export default App;
