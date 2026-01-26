import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


const CollectionProducts = () => {
  const { name } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/collections/${name}`)
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [name]);

  if (loading) return <p>Loading...</p>;

  if (products.length === 0) {
    return <p>No products found</p>;
  }

  return (
    <section className="px-4 py-4">
      <h2 className="text-xl font-semibold mb-4">
        {decodeURIComponent(name)}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product._id} className="border rounded p-2">
            <img
              src={product.url?.[0]}
              alt={product.name}
              className="w-full h-[160px] object-cover"
            />
            <p className="mt-2 font-medium">{product.name}</p>
            <p className="text-sm">₹{product.price?.[0]}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionProducts;
