import './App.css';
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage'
import RegisterPage from './components/views/RegisterPage/RegisterPage'


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element = {<LandingPage />} />
          <Route exact path="/LoginPage" element = {<LoginPage />} />
          <Route exact path="/RegisterPage" element = {<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

