import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

//middlewear : pareses the json object to javascript object allowing app to get requests which client sended.
app.use(express.json());

//test routes
app.get('/',(req,res)=>{
    res.send("API is running......");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`server is running on PORT ${PORT}`);
   
});







