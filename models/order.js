import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
 orderId: {
    type:String,
    require:true,
    unique: true
},
email: {
    type:String,
    require:true,
},
orderedItems: [
    {
        name: {
            type:String,
            require:true,
        },
        price : {
            type: Number,
            require:true,
            min: 0
        },
        quantity : {
            type: Number,
            require:true,
            min: 1
        },
        image: {
            type:String,
            require:true,
        }
    }
],
date: {
    type: Date,
    default: Date.now
},
paymentId: {
    type:String,
},
status: {
    type: String,
    default: "preparing"
},
notes: {
    type:String,
},
returnItem:[
    {
        date: {
            type: Number,
        },
        orderId: {
            type:String,
        },
        name: {
            type:String, 
        },
        status:{
            type: String,  
        },
        description:{
            type: String,
        }
    }
],
name:{
    type: String,
    require:true, 
},
address:{
    type: String,
    require:true,
},
phone:{
    type: Number,
    require:true,
    match: /^[0-9]{10,15}$/
}
})


const order = mongoose.model("order",orderSchema);

export default order;