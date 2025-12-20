import React, { useState, useEffect } from "react";
import axios from "axios";

const Comments = ({ productId }) => {

  const [comment, setComment] = useState({ comments: "" });
  const [comm, getComments] = useState([]);

   
   useEffect(() => {
     if (!productId) return;

    axios
      .get(`http://localhost:5000/api/comment/${productId}`)
      .then((res) => {
        
       
      getComments(res.data.data); // expecting array
     })
      .catch((err) => console.log(err));
  }, [productId]);

  const handleChange = (e) => {
    setComment({
      ...comment,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:5000/api/comment/${productId}`,
      {comments: [comment.comments] }
      );


      setComment({ comments: "" });
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

      {/* COMMENT INPUT */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="comments"
          value={comment.comments}
          placeholder="Write a comment"
          onChange={handleChange}
        />
        <button type="submit">Submit</button>
      </form>

      {/* COMMENT LIST */}
     <div>
  {comm.map((item) =>
    item.comments.map((text, index) => (
      <div key={`${item._id}-${index}`}>
        <p>{text}</p>
      </div>
    ))
  )}
</div>


    </div>
  );
};

export default Comments;
