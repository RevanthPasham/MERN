// import React, { useState } from 'react';
// import axios from 'axios';

// const Practice = () => {

//   const [state, setState] = useState(true); // true = register, false = login
//   const [data, setData] = useState({
//     name: "",
//     email: "",
//     password: ""
//   });

//   // Update Inputs
//   const updateData = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const url = state 
//       ? "http://localhost:5000/api/register" 
//       : "http://localhost:5000/api/login";

//     const payload = state 
//       ? data 
//       : { email: data.email, password: data.password };

//     try {
//       const res = await axios.post(url, payload);
//       alert(state ? "Registered!" : "Login Successful!");
//     } catch (err) {
//       console.log(err);
//       alert("Error occurred");
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         {state && (
//           <div>
//             <input 
//               type="text"
//               name="name"
//               placeholder="Name"
//               value={data.name}
//               onChange={updateData}
//               required
//             />
//             <br />

//             <input 
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={data.email}
//               onChange={updateData}
//               required
//             />
//             <br />

//             <input 
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={data.password}
//               onChange={updateData}
//               required
//             />
//           </div>
//         )}

//         {!state && (
//           <div>
//             <input 
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={data.email}
//               onChange={updateData}
//               required
//             />
//             <br />

//             <input 
//               type="password"
//               name="password"
//               placeholder="Password"
//               value={data.password}
//               onChange={updateData}
//               required
//             />
//           </div>
//         )}

//         <br />
//         <button type="submit">Submit</button>
//       </form>

//       <button onClick={() => setState(!state)}>
//         {state 
//           ? "Already have an account? Login" 
//           : "Don't have an account? Register"}
//       </button>
//     </div>
//   );
// };

// export default Practice;
