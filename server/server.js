import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import  authRoutes  from "./routes/authRoutes.js"
import { protect } from "./middleware/authMiddleware.js";


dotenv.config();
connectDB();

const app = express();

//middlewear : pareses the json object to javascript object allowing app to get requests which client sended.
app.use(express.json());

//routs
app.use("/api/auth", authRoutes);

//test routes
app.get('/',(req,res)=>{
    res.send("API is running......");
});

app.get("/api/test",protect,(req,res)=>{
  
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`server is running on PORT ${PORT}`);
});







