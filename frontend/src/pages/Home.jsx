import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/sections/Hero";
import ProductList from "../components/product/ProductList";
import { getCollections } from "../services/product.service";
import Productspage from "./ProductsPage"

const Home = () => {
 
  return (
    <div className="pt-[60px]">
      <Hero />
      <Productspage />
    </div>
  );
};

export default Home;
