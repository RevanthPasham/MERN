// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Comments = ({ productId }) => {

//   const [commen, setComment] = useState({ comment: "" });
//   const [comm, getComments] = useState([]);
//   const [star,setStar]= useState(0);
//   const [rating,setRating]= useState(0);
//   const [totalRating,settotalRating]= useState(0);

//   // ❌ REMOVED invalid token set line

//   useEffect(() => {
//     if (!productId) return;

//     axios
//       .get(`http://localhost:5000/api/comment/${productId}`)
//       .then((res) => {
//         getComments(res.data.data);
//         console.log(res.data.data)
//       })
//       .catch((err) => console.log(err));
//   }, [productId]);




//   useEffect(()=>
//   {
//     if(!productId) return;
//     axios.get(`http://localhost:5000/api/comment/summary/${productId}`)
//     .then((res)=>
//     {
//       setRating(res.data)
//       console.log(res.data)
//     })
//     .catch((err)=>console.log(err))
   
//   },[productId]);

  

//   const handleChange = (e) => {
//     setComment({
//       ...commen,
//       [e.target.name]: e.target.value
//     });
//   };

//   const StarRating = ({ rating }) => {
//   return (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((num) => (
//         <span
//           key={num}
//           style={{
//             color: num <= rating ? "gold" : "#ccc",
//             fontSize: "18px",
//           }}
//         >
//           ★
//         </span>
//       ))}
//     </div>
//   );
// };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await axios.post(
//         `http://localhost:5000/api/comment/${productId}`,
//         { comment: commen.comment,
//           star:star

//          },
       
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setComment({ comment: "" });

//       const resu = await axios.get(
//         `http://localhost:5000/api/comment/${productId}`
//       );
//       getComments(resu.data.data);


      
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div>

//        <div>
//         <p>overal rating </p>
//         <StarRating rating={rating.avgRating} />
//         <p>{rating.avgRating} out of 5</p>
//         <p>{rating.totalRating} global ratings</p>
//        </div>
//       <p>write a review</p>
//       <div>
//         {[1,2,3,4,5].map((num)=>
//         (
//           <span key={num} onClick={()=>setStar(num)}>   ★ </span>
//         ))}
//       </div>
      

//       <div className="h-[80px] flex flex-col" >
//         <form onSubmit={handleSubmit} >
//         <input className="h-[75px]"
//           type="text"
//           name="comment"
//           value={commen.comment}
//           placeholder="Write a comment"
//           onChange={handleChange}
//           required
//         />
//        <div>
//          <button type="submit">Submit</button>
//        </div>
//       </form>

//       </div>
  

//       <div className="pt-[55px]">
//         {comm.map((item) => (
//           <div key={item._id} className="border-2">
//               <div className=" flex h-[40px] gap-5  ">
               
//                  <img src={item.userId?.picture || "/default-user.png"} className="rounded-full"/>
//                  <div>
//                    <p className="items-center">{item.userId?.name} </p>
//                  <StarRating rating={item.star} />

//                   </div>
//               </div>
//            <div className="h-[50px]  ">
             
//              <p>{item.comment}</p>

//              <p className="text-xs text-gray-400">
//   {new Date(item.createdAt).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   })}
// </p>

//             </div>
           
         
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Comments;
