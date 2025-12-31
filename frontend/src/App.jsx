import React from 'react'
import { Routes, Route } from "react-router-dom";   // ✅ THIS WAS MISSING

import Userlogin from './components/Userlogin.jsx';
import Practice from './components/Practice.jsx';
import Home from './components/Home.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Slider from './components/Slider.jsx';
import Singledata from './components/Singledata.jsx';
import Profile from './components/Profile.jsx'

const App = () => {
  return (
    <div>

      <Navbar />
     
    
     <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/product/:id" element={<Singledata />} />
  <Route path="/Login" element={<Userlogin />} />
  <Route path="/Home" element={<Home />} />
  <Route path="/singledata/:id" element={<Singledata />} />
 <Route path="/profile"  element={<Profile />}  />

</Routes>

    </div>
  )
}

export default App