import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Restaurants from './pages/Restaurants';
import Signup from './pages/SignUp';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/restaurants">Browse</Link> |{" "}
        <Link to="/signup">Sign Up</Link> |{" "}
        <Link to="/login">Log In</Link>
      </nav>
      <Routes>
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/signup"      element={<Signup />} />
        <Route path="/login"       element={<Login />} />
        <Route path="*"            element={<Restaurants />} />
      </Routes>
    </BrowserRouter>
  );
}
