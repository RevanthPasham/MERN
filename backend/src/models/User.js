// const mongoose = require("mongoose");
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String },
//   provider: {
//     type: String,
//     enum: ["local", "google"],
//     default: "local"
//   },
//   picture: { type: String },
//    isFirstLogin: {
//     type: Boolean,
//     default: true}
// });
// const catagory = new mongoose.Schema(
//   {
//     name:{type:String,required:true},
//     imgurl:{type:String,required:true},
//     catogory:{type:[String],required:true}
//   }
// )
// const User = mongoose.model("User", userSchema);
// const catago= mongoose.model("catago",catagory);


// module.exports = {User,catago};