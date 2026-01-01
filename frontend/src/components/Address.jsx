// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Address = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (!user) return <p>Please login</p>;

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     city: "",
//     pincode: "",
//     address: "",
//     reference: ""
//   });

//   const [savedAddress, setSavedAddress] = useState(null);
//   const [edit, setEdit] = useState(false);

//   // FETCH ADDRESS
//   useEffect(() => {
//     axios
//       .get(`http://localhost:5000/api/add/${user._id}`)
//       .then(res => {
//         if (res.data) {
//           setSavedAddress(res.data);
//           setForm(res.data); // 🔑 prefill
//         }
//       })
//       .catch(() => {});
//   }, [user._id]);

//   const handleChange = e =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();

//     let res;
//     if (savedAddress) {
//       // UPDATE
//       res = await axios.put(
//         `http://localhost:5000/api/add/${user._id}`,
//         form
//       );
//     } else {
//       // CREATE
//       res = await axios.post(
//         "http://localhost:5000/api/add",
//         { userId: user._id, ...form }
//       );
//     }

//     setSavedAddress(res.data);
//     setEdit(false);
//     alert("Address saved");
//   };

//   const handleDelete = async () => {
//     await axios.delete(`http://localhost:5000/api/add/${user._id}`);
//     setSavedAddress(null);      // 🔑 clear UI
    
//   };


//   return (
//     <div>
//       {/* VIEW MODE */}
//       {savedAddress && !edit && (
//         <div>
//           <p>Delivering to {savedAddress.address}</p>
//           <p>{savedAddress.city} - {savedAddress.pincode}</p>
//           <p>{savedAddress.reference}</p>
//           <button onClick={() => setEdit(true)}>Edit</button>

          
//           <button onClick={handleDelete}> Delete Adddress</button>
//         </div>
//       )}

//       {/* ADD / EDIT FORM */}
//       {(!savedAddress || edit) && (
//         <form onSubmit={handleSubmit}>
//           {Object.keys(form).map(key => (
//             <input
//               key={key}
//               name={key}
//               value={form[key]}
//               onChange={handleChange}
//               placeholder={key}
//               required
//             />
//           ))}
//           <button type="submit">Save Address</button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Address;
