const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
    default:
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1717666542~exp=1717670142~hmac=a1029f1ec9c00800a5cfce81c3c241ec9d86f1ef00fe3c22fa38cc8f585e9976&w=740",
  },

  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },

  favourites: [{ type: mongoose.Types.ObjectId, ref: "books" }],

  cart: [{ type: mongoose.Types.ObjectId, ref: "books" }],

  orders: [{ type: mongoose.Types.ObjectId, ref: "order" }],

},{timestamps:true});

module.exports = mongoose.model("users", user)
