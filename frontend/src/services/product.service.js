import axios from "axios";

export const getCollections = async () => {
  const res = await axios.get("http://localhost:5000/api/collections");
  return res.data;
};
