import product from "../models/product.js";
import jwt from "jsonwebtoken";

export function getProduct(req, res) {
    product.find()
        .then((productList) => {
            res.json({
                list: productList
            });
        })
        .catch((err) => {
            res.json({
                message: "Error!",
                error: err.message // Optional: include error details for debugging
            });
        });
}

 export function createproduct (req, res)  {

    console.log(req.user)
    if(req.user==null){
        res.json({
            message:"Your Not Logged In"
        })
        return
    }
    if(req.user.type!="admin"){
        res.json({
            message:"Only Admin Has The Accesss"
        })
        return
    }

    const newProduct = new product(req.body);
    newProduct.save().then(() => {
            res.json({
                message: "Product Created."
            });
        })
        .catch((err) => { 
            res.json({
                message: "Error creating product",
                error: err.message 
            });
        });
}
export function deleteProduct (req, res)  {
    product.deleteOne({name:req.body.name}).then(() => {
        res.json({
            message: "Product deleted."
        });
    })
    .catch((err) => { 
        res.json({
            message: "Error deleting product",
            error: err.message 
        });
    });
}