import { createProduct, getProducts } from "../controllers/productcontrollers.js";
import express from "express";


const productRouters= express.Router();

productRouters.get("/",getProducts);
productRouters.post("/",createProduct);

export default productRouters;