require("dotenv").config();


const express= require("express");
const cors=require("cors")

const app=express();

app.use(cors());
app.use(express.json())
const connectdb= require("./config/db");
connectdb();


app.use("/api",      require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api",     require("./routes/addressRoutes"));
app.use("/api",      require("./routes/CommentRoutes"))
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api",require("./routes/ProductsRoutes"))
app.use("/api",require("./routes/CollectionRoutes"))



const PORT= process.env.PORT || 5000;

app.listen(PORT,()=>
{
    console.log(`Server is running on port ${PORT}`);
}
)
