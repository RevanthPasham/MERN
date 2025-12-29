import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Address from "./Address";
import { openRazorpay } from "../utils/razorpay";

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    const localdata = localStorage.getItem("user");

    if (!localdata) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(localdata);
    setUser(parsedUser);

    axios
      .get(`http://localhost:5000/api/cart/${parsedUser._id}`)
      .then((res) => {
        const items = res?.data?.items;
        setCart(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        console.log(err);
        setCart([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const removeCart = async (productId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/cart/${user._id}/${productId}`
      );

      const items = res?.data?.items;
      setCart(Array.isArray(items) ? items : []);
    } catch (err) {
      console.log(err);
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    const price = item.productId?.price?.[0] || 0;
    return sum + price * item.quantity;
  }, 0);

  const handlePayment = async () => {
    if (totalAmount <= 0) {
      alert("Cart is empty");
      return;
    }

    try {
      setPayLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/payment/create-order",
        { amount: totalAmount }
      );

      openRazorpay({
        order: res.data.order,
        user,
      });
    } catch (err) {
      console.log(err);
      alert("Payment failed");
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please login</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Welcome {user.name}</h2>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-3 py-1 rounded-md mt-2"
      >
        Logout
      </button>

      {/* Address Section */}
      <Address />

      {/* Cart Section */}
      <h3 className="text-lg font-semibold mt-6">My Cart</h3>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div
              key={item.productId?._id || index}
              className="flex gap-4 border p-3 mt-3 rounded"
            >
              <img
                src={item.productId?.url}
                alt={item.productId?.name}
                className="w-20 h-20 rounded"
              />

              <div className="flex justify-between w-full">
                {/* LEFT */}
                <div>
                  <p className="font-bold">{item.productId?.name}</p>
                  <p>₹ {item.productId?.price?.[0]}</p>
                  <p>Qty: {item.quantity}</p>

                  <button
                    className="border-2 border-orange-700 rounded-2xl px-3 py-1 mt-1"
                    onClick={() =>
                      navigate(`/singledata/${item.productId?._id}`)
                    }
                  >
                    View
                  </button>
                </div>

                {/* RIGHT */}
                <div className="flex items-start">
                  <button
                    className="text-red-600 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCart(item.productId?._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* PAYMENT SECTION */}
          <div className="mt-6 border-t pt-4">
            <p className="text-lg font-bold">Total: ₹ {totalAmount}</p>

            <button
              onClick={handlePayment}
              disabled={payLoading}
              className="bg-orange-600 text-white px-6 py-2 rounded mt-3"
            >
              {payLoading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
