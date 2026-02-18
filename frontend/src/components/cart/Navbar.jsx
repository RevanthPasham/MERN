// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import reactLogo from "../assets/react.svg";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [user, setUser] = useState(null);

//   // 🔹 READ USER WHEN ROUTE CHANGES
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     setUser(storedUser ? JSON.parse(storedUser) : null);
//   }, [location]);
            
//   const handleSearch = async (e) => {
//     const value = e.target.value;
//     setQuery(value);

//     if (!value) {
//       setResults([]);
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `http://localhost:5000/api/search?q=${value}`
//       );
//       setResults(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   return (
//     <div className="flex justify-between items-center bg-gray-500 p-3 relative">

//       {/* Logo */}
//       <img src={reactLogo} className="w-10 cursor-pointer" onClick={() => navigate("/")} />

//       {/* Search */}
//       <div className="relative w-1/3">
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={query}
//           onChange={handleSearch}
//           className="w-full px-3 py-1 rounded text-black"
//         />

//         {results.length > 0 && (
//           <div className="absolute bg-white w-full mt-1 shadow rounded z-50">
//             {results.map((item) => (
//               <Link
//                 key={item._id}
//                 to={`/singledata/${item._id}`}
//                 onClick={() => {
//                   setQuery("");
//                   setResults([]);
//                 }}
//               >
//                 <div className="px-3 py-2 hover:bg-gray-200 cursor-pointer">
//                   {item.name}
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Profile / Login */}
//       {user ? (
//         <div className="flex items-center gap-3" onClick={()=>navigate("/profile")}>
//             <img
//             src={user.picture}
//             alt="profile"
//             referrerPolicy="no-referrer"
//            className="w-10 h-10 rounded-full object-cover border border-white cursor-pointer"
//            onError={(e) => {
//             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//               user.name || "User"
//              )}&background=0D8ABC&color=fff`;
//            }}
//           />
   

         
//         </div>
//       ) : (
//         <button
//           onClick={() => navigate("/login")}
//           className="text-white font-semibold"
//         >
//           Login
//         </button>
//       )}
//     </div>
//   );
// };

// export default Navbar;
