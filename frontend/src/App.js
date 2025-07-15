// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelection from "./pages/RoleSelection";
import ApplicantForm from "./pages/FormApplicant";
import PolicePage from "./pages/PolicePage";
import VerifierPage from "./pages/VerifierPage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/" element={<RoleSelection />} />
        <Route path="/pengaju" element={<ApplicantForm />} />
        <Route path="/polisi" element={<PolicePage />} />
        <Route path="/verifikator" element={<VerifierPage />} />
      </Routes>
    </Router>
  );
}

export default App;
