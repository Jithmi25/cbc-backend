import product from "../models/product.js";
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

export async function deleteProduct(req, res) {
    if (!isAdmin(req)) {
        return res.status(401).json({
            message:"Please Login as Administrator to delete Product."
        });
    }

    try {
      const productId = req.params.productId;
      const result = await product.deleteOne({ productId });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      res.status(200).json({ message: "Product deleted successfully." });
    } catch (err) {
      res.status(500).json({ message: "Error deleting product.", error: err.message });
    }
  }
  
