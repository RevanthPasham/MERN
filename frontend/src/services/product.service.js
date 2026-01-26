import axios from "axios";
export const getProducts = async () => {
  const res = await axios.get("http://localhost:5000/api/products");
  return res.data;
};

export const getproductById= async (id)=>
{
    const res= await axios.get(`http://localhost:5000/api/products/${id}`)
    return res.data
}