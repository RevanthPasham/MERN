const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",   
      required: true

    },

    name: {
      type: String,
      required: true
    },

    email: {
      type: String,

      required: true
    },

    phone: {
      type: Number,

      required: true
    },

    city: {
      type: String,

      required: true
    },

    pincode: {
      type: Number,

      required: true
    },

    address: {
      type: String,
      
      required: true
    },

    reference: {
      type: String
    }
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
