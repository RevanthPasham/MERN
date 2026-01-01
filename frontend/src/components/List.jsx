// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const List = () => {
//   const [State, SetState] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/collections")
//       .then(res => SetState(res.data))
//       .catch(err => console.log(err));
//   }, []);

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//       {State.map((item) => (
//         <div 
//           key={item._id}  
//           onClick={() => navigate(`/product/${item._id}`)}
//           className="cursor-pointer"
//         >
//           <img src={item.url} className="w-full h-[200px] rounded-xl" />
//           <p>{item.name}</p>
//           <p>{item.price[0]}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default List;
