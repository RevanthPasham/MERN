import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const RelatedProducts = () => {
  const { id } = useParams();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/collections/${id}/related`)
      .then((res) => setRelated(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">Related Products</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {related.map((item) => (
          <Link key={item._id} to={`/singledata/${item._id}`}>
            <div className="shadow p-2 rounded hover:scale-105 transition">
              <img
                src={item.url}
                className="h-40 w-full object-cover rounded"
              />
              <p className="font-semibold">{item.name}</p>
              <p>₹ {item.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
);
};

export default RelatedProducts;







