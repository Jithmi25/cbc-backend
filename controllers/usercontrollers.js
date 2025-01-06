import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createUser(req, res) {
    const newUserData = req.body;

    // Check if the user type is admin and validate req.user
    if (newUserData.type === "admin") {
        if (!req.user || req.user.type !== "admin") {
            return res.status(401).json({
                message: "Please Login as Administrator to create admin accounts."
            });
        }
    }

    // Hash password
    newUserData.password = bcrypt.hashSync(newUserData.password, 10);

    // Save user
    const newUser = new User(newUserData);
    newUser.save()
        .then(() => {
            res.status(201).json({ message: "User Created." });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error creating user.",
                error: "An error occurred while creating the user."
            });
        });
}

export function LoginUser(req, res) {
    User.findOne({ email: req.body.email })
        .then((foundUser) => {
            if (!foundUser) {
                return res.status(404).json({ message: "Email Not Found." });
            }

            // Verify password
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, foundUser.password);
            if (isPasswordCorrect) {
                const token = jwt.sign(
                    {
                        email: foundUser.email,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        isBlocked: foundUser.isBlocked,
                        type: foundUser.type,
                        profilePic: foundUser.profilePic
                    },
                    process.env.SECRET
                );
                return res.status(200).json({ message: "User Login Successful.", token });
            } else {
                return res.status(401).json({ message: "Incorrect password." });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error." });
        });
}

export function deleteUser(req, res) {
    User.deleteOne({ email: req.body.email })
        .then(() => {
            res.status(200).json({ message: "User Deleted." });
        })
        .catch((err) => {
            res.status(500).json({ message: "Error deleting user.", error: err.message });
        });
}

// 
export function isAdmin(req) {
    if (!req.user || req.user.type !== "admin") {
        return false;
    }
    return true;
}

export function isCustomer(req) {
    if (!req.user || req.user.type !== "customer") {
        return false;
    }
    return true;
}