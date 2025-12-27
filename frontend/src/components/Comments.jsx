import React, { useState, useEffect } from "react";
import axios from "axios";

const Comments = ({ productId }) => {

  const [commen, setComment] = useState({ comment: "" });
  const [comm, getComments] = useState([]);

  // ❌ REMOVED invalid token set line

  useEffect(() => {
    if (!productId) return;

    axios
      .get(`http://localhost:5000/api/comment/${productId}`)
      .then((res) => {
        getComments(res.data.data);
        console.log(res.data.data)
      })
      .catch((err) => console.log(err));
  }, [productId]);

  const handleChange = (e) => {
    setComment({
      ...commen,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.post(
        `http://localhost:5000/api/comment/${productId}`,
        { comment: commen.comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComment({ comment: "" });

      const resu = await axios.get(
        `http://localhost:5000/api/comment/${productId}`
      );
      getComments(resu.data.data);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="comment"
          value={commen.comment}
          placeholder="Write a comment"
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <div>
        {comm.map((item) => (
          <div key={item._id} className="border-2">
              <div className=" flex h-[40px] gap-5  ">

                 <img src={item.userId?.picture || "/default-user.png"} className="rounded-full"/>
                <p className="items-center">{item.userId?.name} </p>

              </div>
           <div className="h-[50px] ">
             <p>{item.comment}</p>
            </div>
           
         
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
