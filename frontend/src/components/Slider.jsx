// import React, { useEffect ,useState} from 'react'
// import react from  "../assets/react.svg";
// import axios from "axios"


// const Slider = () => {
//     const [items,setitems]= useState([]);
//     useEffect(()=>
//     {
//         axios.get("http://localhost:5000/api/category")
//         .then((res)=>
//         {
//             setitems(res.data)
//             console.log(items)
//         })
        
//         .catch((err)=>
//         {
//             console.log("error fetchig data")
//         });
//     },[])
//   return (
//    <div className=" flex w-full] overflow-x-auto">
//   {items.map((item) => (
//     <div
//       key={item._id}
//       className="min-w-[250px] mx-2 rounded-lg hover:scale-105 transition"
//     >
//       <img src={item.imgurl} className="w-full h-40 object-cover" />
//       <p>{item.name}</p>
//       <p className="text-gray-400">{item.catogory[0]}</p>
//     </div>
//   ))}
// </div>

//   )
// }

// export default Slider