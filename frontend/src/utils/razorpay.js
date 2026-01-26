export const openRazorpay = ({ order, user }) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: "INR",
    name: "My Store",
    description: "Cart Payment",
    order_id: order.id,
    prefill: {
      name: user?.name,
      email: user?.email,
      
    },
    theme: { color: "#f97316" },

    handler: function (response) {
      console.log("Payment Success:", response);
      alert("Payment Successful 🎉");
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
