import React from 'react'
import { Routes, Route } from "react-router-dom";   // ✅ THIS WAS MISSING

import Userlogin from './components/Userlogin.jsx';
import Home from './pages/Home.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Slider from './components/Slider.jsx';
// import Singledata from './components/Singledata.jsx';
import Profile from './components/Profile.jsx'
import ProductsPage from "./pages/ProductsPage.jsx";


const App = () => {
  return (
    <div>

      <Navbar />
      
    
    
     <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/Login" element={<Userlogin />} />
         <Route path="/products" element={<ProductsPage />} /> 
         <Route path="/Home" element={<Home />} />
          <Route path="/profile"  element={<Profile />}  />
     </Routes>


    </div>
  )
}

export default App