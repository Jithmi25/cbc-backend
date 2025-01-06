import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productId : {
        type:String,
        require:true,
        unique: true
    },
    productName : {
        type:String,
        require:true,
    },
    altName : [
        {
            type:String, 
        }
    ],
    images : [
        {
            type:String, 
        }
    ],
    price : {
        type: Number,
        require:true,
    },
    lastPrice : {
        type: Number,
        require:true,
    },
    description : {
        type:String,
        require:true,
    },
    stockCount : {
        type: Number,
        require:true,
    }
});

const product = mongoose.model("product",productSchema);

export default product;