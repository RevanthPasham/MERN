const mongoose = require("mongoose");




const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // password is OPTIONAL (for Google users)
  password: { type: String },

  // identify login method
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  picture: { type: String }
});



const catagory = new mongoose.Schema(
  {
    name:{type:String,required:true},
    imgurl:{type:String,required:true},
    catogory:{type:[String],required:true}
  }
)




const Collection = new mongoose.Schema(
  {
     name:{type:String,required:true},
     url:{type:String,required:true},
     price:{type:[Number],required:true},
     weight:{type:String,required:true},
     discount:{type:[String],required:true},
     catagory:{type:[String],required:true}

  }
)

const User = mongoose.model("User", userSchema);
const catago= mongoose.model("catago",catagory);
const Collectionmodel=mongoose.model("Collection",Collection)

module.exports = {User,catago,Collectionmodel};