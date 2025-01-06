import product  from "../models/product.js";
import product from "../models/product.js";
import { isAdmin } from "./usercontrollers.js";

export function createProduct(req,res) { 

    const newProductData = req.body 

    if(!isAdmin(req)){
        res.json({
            message:"Please Login as Administrator to add Product."
        })
        return
    }

    const product =  new product (newProductData)
    
    product.save().then(
        ()=>{
            res.json({
                message : "Product Created."
            })
        }
    ).catch((error)=>{
        res.json({
            message : error
        })
    })
}
 
export function getProducts(req,res) {
    product.find({}).then((product) =>
    {
        res.json(product)
    })
}
