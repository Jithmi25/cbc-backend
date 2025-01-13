import Order from "../models/order.js"; 
import product from "../models/product.js";
import Product from "../models/product.js"; 
import { isCustomer } from "./usercontrollers.js"; 
import { isAdmin } from "./usercontrollers.js"; 

export async function createOrder(req, res) {
    // Check if the user is a customer
    if (!isCustomer(req)) {
        return res.status(401).json({
            message: "Please Login as Customer to Order Product.",
        });
    }

    try {
        // Fetch the latest order by date to generate a new unique order ID
        const latestOrder = await Order.find().sort({ date: -1 }).limit(1);
        let orderId;

        if (latestOrder.length === 0) {
            orderId = "CBC001"; // First order ID if no orders exist
        } else {
            const currentOrderId = latestOrder[0].orderId;
            const numberString = currentOrderId.replace("CBC", "").trim(); // Extract numeric part
            const number = parseInt(numberString, 10); // Convert to integer
            const newNumber = (number + 1).toString().padStart(4, "0"); // Increment and format
            orderId = "CBC" + newNumber; // Generate new order ID
        }

        // Validate and process order data
        const newOrderData = req.body;
        if (!newOrderData || !newOrderData.orderedItems || !Array.isArray(newOrderData.orderedItems)) {
            return res.status(400).json({
                message: "Invalid order data.",
            });
        }

        const newProductArray = []; // To hold validated product details
        const orderedItems = newOrderData.orderedItems;

        for (let i = 0; i < orderedItems.length; i++) {
            const foundProduct = await Product.findOne({
                productId: orderedItems[i].productId, // Search for product by productId
            });

            if (!foundProduct) {
                return res.status(404).json({
                    message: `Product with Id ${orderedItems[i].productId} not found.`,
                });
            }

            // Add product details to newProductArray
            newProductArray.push({
                productName: foundProduct.productName,
                price: foundProduct.price,
                quantity: orderedItems[i].quantity,
                image: Array.isArray(foundProduct.image) && foundProduct.image.length > 0 
                    ? foundProduct.image[0] 
                    : null, // Use null or a default value if no image is available
            });
        }

        const updateStock = async (req, res) => {
            try {
                const orderedItems = req.body.orderedItems; // Array of { productId, quantity }
        
                for (let j = 0; j < orderedItems.length; j++) {
                    const { productId, quantity } = orderedItems[j];
        
                    // Find the product by ID
                    const product = await Product.findById(productId);
        
                    if (!product) {
                        return res.status(404).json({
                            message: `Product with ID ${productId} not found.`,
                        });
                    }
        
                    // Check if sufficient stock exists
                    if (product.stockCount < quantity) {
                        return res.status(400).json({
                            message: `Sorry! Product '${product.name}' is out of stock. Stay with us.`,
                        });
                    }
        
                    // Deduct the ordered quantity from the stock
                    product.stockCount -= quantity;
        
                    // Save the updated product
                    await product.save();
                }
        
                return res.status(200).json({
                    message: 'Stock updated successfully!',
                });
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: 'An error occurred while updating stock.',
                });
            }
        };
        

        console.log(newProductArray); 

        newOrderData.orderedItems = newProductArray

        newOrderData.orderId = orderId; // Assign generated order ID
        newOrderData.email = req.user.email; // Assign customer email
        newOrderData.products = newProductArray; // Add validated product details to the order

        // Save the new order in the database
        const newOrder = new Order(newOrderData);
        await newOrder.save();

        res.status(201).json({
            message: "Order created successfully.",
            orderId: newOrder.orderId,
        });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({
            message: error.message || "An error occurred while ordering the product.",
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
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            message: error.message || "An error occurred while fetching orders."
        });
    }
}

export async function returnItem(req, res) {
    try {
        const { orderId, returnItem } = req.body;

        // Check if the user is a customer
        if (!req.user || req.user.role !== "customer") {
            return res.status(403).json({ message: "Access denied. Only customers can return items." });
        }

        // Validate input
        if (!orderId || !returnItem || !returnItem.name || !returnItem.quantity) {
            return res.status(400).json({ message: "Missing return details. Please provide all required fields." });
        }

        // Find the order in the database
        const order = await Order.findOne({ orderId, email: req.user.email });

        if (!order) {
            return res.status(404).json({ message: "Order not found or doesn't belong to the customer." });
        }

        // Check if the product exists in the original order
        const orderedItem = order.orderedItems.find(item => item.name === returnItem.name);

        if (!orderedItem) {
            return res.status(404).json({ message: `Item '${returnItem.name}' was not part of the order.` });
        }

        // Check if the quantity is valid
        if (returnItem.quantity > orderedItem.quantity) {
            return res.status(400).json({
                message: `Invalid return quantity. You can only return up to ${orderedItem.quantity} of '${returnItem.name}'.`,
            });
        }

        // Add the return item details to the order's returnItem array
        order.returnItem.push({
            ...returnItem,
            date: Date.now(),
            status: "Pending",
        });

        // Save the updated order
        await order.save();

        return res.status(200).json({
            message: "Return request submitted successfully.",
            returnItem: order.returnItem[order.returnItem.length - 1],
        });
    } catch (error) {
        console.error("Error processing return request:", error);
        return res.status(500).json({
            message: "An error occurred while processing the return request. Please try again.",
        });
    }
}
