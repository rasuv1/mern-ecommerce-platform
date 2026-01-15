import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import  authRoutes  from "./routes/authRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { protect } from "./middleware/authMiddleware.js";


dotenv.config();
connectDB();

const app = express();

//middlewear : pareses the json object to javascript object allowing app to get requests which client sended.
app.use(express.json());

//routs
app.use("/api/auth", authRoutes);

//products
app.use("/api/products", productRoutes);

//test routes
app.get('/',(req,res)=>{
    res.send("API is running......");
});




const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`server is running on PORT ${PORT}`);
});







