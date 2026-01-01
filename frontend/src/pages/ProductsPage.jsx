import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCollections } from "../services/product.service";
import ProductList from "../components/product/ProductList";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  getCollections()
    .then((data) => {
      console.log("API DATA 👉", data);
      setProducts(data);
    })
    .catch(err => console.log("API ERROR 👉", err));
}, []);

  return (
    <ProductList
      products={products}
      onSelect={(id) => navigate(`/product/${id}`)}
    />
  );
};

export default ProductsPage;
