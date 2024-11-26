import express from "express";
import { createUser,LoginUser,deleteUser } from "../controllers/usercontrollers.js";

const userRouters= express.Router();

userRouters.post("/",createUser);
userRouters.post("/Login",LoginUser)
userRouters.delete("/",deleteUser)

export default userRouters;