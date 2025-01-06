import user from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

export function createUser (req, res)  {

    const newUserData=req.body
    newUserData.password=bcrypt.hashSync(newUserData.password,10)

    const newUser = new user(newUserData);
    newUser.save().then(() => {
            res.json({
                message: "user Created."
            });
        })
        .catch((err) => { 
            res.json({
                message: "Error creating user",
                error: err.message 
            });
        });

    if(newUserData.type == "admin"){
        if(req.user==null){
            res.json({
                message:"Please Login as Administrator to create admin accounts."
            })
            return
        }
        if(req.user.type!="admin"){
            res.json({
                message:"Please Login as Administrator to create admin accounts."
            })
            return
        }
    }    
}

export function LoginUser(req, res) {
    user.find({ email: req.body.email })
        .then((users) => {
            if (users.length === 0) {
                return res.status(404).json({ message: "Email Not Found." });
            }

            const foundUser = users[0]; // Renamed to avoid shadowing.
            const isPasswordCorrect = bcrypt.compareSync(
                req.body.password,
                foundUser.password
            );

            if (isPasswordCorrect) {
                
                const token=jwt.sign({
                    email:user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isBlocked: user.isBlocked,
                    type:user.type,
                    profilePic: user.profilePic
            },process.env.SECRET)
                return res.status(200).json
                ({ 
                    message: "User Login Successful." ,
                    token:token
                });
            } else {
                return res.status(401).json({ message: "Incorrect password." });
            }
        })
        .catch((err) => {
            console.error(err); // Log error for debugging.
            return res.status(500).json({ message: "Internal Server Error." });
        });
}
export function deleteUser(res,req){
user.deleteone({email:req.body.email}).then(
    ()=>{
        res.json({
            message:"User Deleted."
        })
    }
)
}

// "email": "wickjitha@gmail.com","password": "secure",- admin 
// "email": "wickjitha123@gmail.com","password": "123",- customer

export function isAdmin(req){
    if(req.user==null){
        return false
    }
    if(req.user.type != "admin"){
        return false
    }
    return true
}
export function isCustomer(req){
    if(req.user==null){
        return false
    }
    if(req.user.type != "customer"){
        return false
    }
    return true
}