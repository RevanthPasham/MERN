import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/sections/Hero";
import ProductList from "../components/product/ProductList";
import Productspage from "./ProductsPage"
import ProductDetails from "../components/product/ProductDetails";
import Collections from "./Collections";

const Home = () => {
 
  return (
    <div className="">
      <Hero />
       <Collections />
      
      <Productspage />
     
    </div>
  );
};

export default Home;
