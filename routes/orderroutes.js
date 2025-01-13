import express from "express";
import { createOrder, getOrders, returnItem } from "../controllers/ordercontrollers.js";

const orderRouter= express.Router();

orderRouter.post("/",createOrder);
orderRouter.get("/",getOrders);
orderRouter.post("/returnItem",returnItem);

export default orderRouter;