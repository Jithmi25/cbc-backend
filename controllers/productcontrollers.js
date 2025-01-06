import Product from "../models/product.js";
import { isAdmin } from "./usercontrollers.js";

export async function createProduct(req, res) {
    const newProductData = req.body;

    if (!isAdmin(req)) {
        return res.status(401).json({
            message:"Please Login as Administrator to add Product."
        });
    }

    try {
        const newProduct = new Product(newProductData);
        await newProduct.save();
        res.status(201).json({
            message: "Product Created."
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while creating the product."
        });
    }
}

export async function getProducts(req, res) {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: error.message || "An error occurred while fetching products."
        });
    }
}
