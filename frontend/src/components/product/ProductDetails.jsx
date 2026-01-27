import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {getproductById} from '../../services/product.service'

const ProductDetails = () => {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  useEffect(() => {
       getproductById(id)
      .then(data => {
        console.log("PRODUCT DATA 👉", data);
        setProduct(data);
      })
      .catch(err => console.error(err));
  }, [id]);
  if (!product) return <p>Loading...</p>;

  return (
  <div >
    <h1>TEST TEXT</h1>
    <h1>{product.name}</h1>
    <img src={product.url[0]} className="h-100px " />
  </div>
);

};

export default ProductDetails;
