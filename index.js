import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import studentRoutes from './routes/studentroutes.js';
import productRoutes from './routes/productsroutes.js';
import userRoutes from './routes/userroutes.js';
import jwt from "jsonwebtoken";

const app = express();
const mongoUrl="mongodb+srv://magicinmace:123@cluster0.0ssx5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

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

app.use(bodyParser.json())
/*app.use(
    (req,res,next)=>{
        const token=req.header("Authorization")?.replace("Bearer","")
       console.log(token)
        if (token != null) {
            jwt.verify(token,"cbc-secret-key-1234", (error, decoded) => {
                if (!error) {
                    console.log(decoded)
                    req.user = decoded
                }
            });
        }
        next()
    }
)*/
app.use((req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    console.log("Token received:", token);

    if (token!==null) {
        jwt.verify(token, "cbc-secret-key-1234", (error, decoded) => {
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

app.use("/api/students",studentRoutes)
app.use("/api/products",productRoutes)
app.use("/api/user",userRoutes)

/*app.get("/",
    (req,res)=>{
        console.log(req);
        console.log("hello world1");
        res.json(
            {
                message:"Hello" + req.body.name
            }
        );
    }
);*/


app.listen(
    3000,
    ()=>{
        console.log("Server is running on part 3000");
    }
);
    
