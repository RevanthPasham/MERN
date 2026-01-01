// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import RelatedProducts from "./RelatedProducts";
// import Comments from './Comments'

// const Singledata = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [Data, SetData] = useState(null);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/collections/${id}`)
//       .then((res) => SetData(res.data))
//       .catch((err) => console.log(err));
//   }, [id]);

//   // ✅ ADD TO CART FUNCTION
//   const addToCart = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user) {
//       alert("Please login first");
//       navigate("/login");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/cart/add", {
//         userId: user._id,
//         productId: Data._id
//       });

//       alert("Added to cart");

//     } catch (err) {
//       console.log(err);
//       alert("Failed to add to cart");
//     }
//   };

//   if (!Data) return <p>Loading...</p>;

//   return (
//     <div className="p-4">
//       <div>
//         <img src={Data.url} className="w-full h-80 rounded-xl" />
//         <p className="text-2xl font-bold">{Data.name}</p>
//         <p className="text-lg">₹ {Data.price.join(", ")}</p>
//         <p>{Data.weight}</p>
//         <p>{Data.discount.join(", ")}</p>
//         <p>{Data.catagory.join(", ")}</p>

//         {/* ✅ ADD TO CART BUTTON */}
//         <button
//           onClick={addToCart}
//           className="mt-4 bg-amber-600 text-white px-4 py-2 rounded-md"
//         >
//           Add to Cart
//         </button>
//       </div>

//       <RelatedProducts />
//       <Comments productId={id} />
//     </div>
//   );
// };

// export default Singledata;
