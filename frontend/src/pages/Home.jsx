import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/sections/Hero";
import ProductList from "../components/product/ProductList";
import { getCollections } from "../services/product.service";
import Productspage from "./ProductsPage"
import ProductDetails from "../components/product/ProductDetails";
import Collections from "./Collections";

const Home = () => {
 
  return (
    <div className="">
      <Hero />
       <Collections />
      
     
     
    </div>
  );
};

export default Home;
