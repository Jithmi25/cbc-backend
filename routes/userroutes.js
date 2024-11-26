import express from "express";
import { createUser,LoginUser } from "../controllers/usercontrollers.js";

const userRouters= express.Router();

userRouters.post("/",createUser);
userRouters.post("/Login",LoginUser)

export default userRouters;