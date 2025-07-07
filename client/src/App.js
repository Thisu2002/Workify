import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Home from "./pages/Home";
import Mentor from "./pages/Mentor";
import LeadPanelist from "./pages/LeadPanelist";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/lead-panelist" element={<LeadPanelist />} />
      </Routes>
    </Router> 
  );
};

export default App;