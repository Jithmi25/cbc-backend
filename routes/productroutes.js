import { createProduct, getProducts,deleteProduct } from "../controllers/productcontrollers.js";
import express from "express";


const productRouters= express.Router();

productRouters.get("/",getProducts);
productRouters.post("/",createProduct);
productRouters.delete("/:productId", deleteProduct);


export default productRouters;