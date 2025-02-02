import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import userRoutes from './routes/userroutes.js';
import productRouters from './routes/productroutes.js';
import jwt from "jsonwebtoken";
import cors from "cors";

import dotenv from "dotenv";
import orderRouter from './routes/orderroutes.js';
dotenv.config()

const app = express();

const mongoUrl=process.env.MONGO_DB_URL
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection; // Access the connection
  
  // Event Listeners for Connection
  db.on("error", (err) => {
    console.error("Connection error:", err);
  });
  
  db.once("open", () => {
    console.log("Database connected.");
  });

app.use(cors())

app.use(bodyParser.json())

app.use((req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    console.log("Token received:", token);

    if (token!==null) {
        jwt.verify(token, process.env.SECRET, (error, decoded) => {
            if (!error) {
                console.log(decoded)
                req.user = decoded
            }
            next(); // Proceed only after successful verification
        });
    } else {
        next(); // No token, proceed to the next middleware
    }
});

app.use("/api/user",userRoutes)
app.use("/api/product",productRouters)
app.use("/api/order",orderRouter)

app.listen(
    3000,
    ()=>{
        console.log("Server is running on part 3000");
    }
);
    
