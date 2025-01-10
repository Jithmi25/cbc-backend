import express from "express";
import { createUser,LoginUser,deleteUser,ForgotPassword,ResetPassword } from "../controllers/usercontrollers.js";

const userRouters= express.Router();

userRouters.post("/",createUser);
userRouters.post("/Login",LoginUser)
userRouters.delete("/",deleteUser)
userRouters.post("/forgetPassword",ForgotPassword);
userRouters.post("/resetPassword", ResetPassword);

export default userRouters;