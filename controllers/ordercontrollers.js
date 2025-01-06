import order from "../models/order.js";
import Order from "../models/order.js"; 
import { isCustomer } from "./usercontrollers.js"; 

export async function createOrder(req, res) {
    if (!isCustomer(req)) {
        return res.status(401).json({
            message: "Please Login as Customer to Order Product."
        });
    }

    try {
        // Fetch the latest order by date
        const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

        let orderId;

        if (latestOrder.length === 0) {
            orderId = "CBC001";
        } else {
            const currentOrderId = latestOrder[0].orderId;

            // Extract the numeric part of the order ID
            const numberString = currentOrderId.replace("CBC", "").trim();
            const number = parseInt(numberString, 10);

            // Increment the numeric part and format it as a 4-digit string
            const newNumber = (number + 1).toString().padStart(4, "0");
            orderId = "CBC" + newNumber;
        }

        // Create a new order
        const newOrderData = req.body;
        newOrderData.orderId = orderId;
        newOrderData.email = req.user.email;

        const newOrder = new Order(newOrderData);

        await newOrder.save();

        res.json({
            message: "Order created."
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while ordering the product."
        });
    }
}

export async function getOrders(req, res) {
    // Check if the user is an admin
    if (!isAdmin(req)) {
        return res.status(403).json({
            message: "Access denied. Only admins can view orders."
        });
    }

    try {
        const orders = await order.find({});
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while fetching orders."
        });
    }
}