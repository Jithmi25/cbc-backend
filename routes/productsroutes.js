import express from "express";
import { getProduct,createproduct,deleteProduct } from "../controllers/productcontrollers.js";

//create productRoutes
const productRoutes= express.Router();

productRoutes.get("/",getProduct)

productRoutes.post("/",createproduct)

productRoutes.delete("/",deleteProduct)

export default productRoutes;