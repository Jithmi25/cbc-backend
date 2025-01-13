import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import user from "../models/user.js";

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
                return res.status(200).json({
                     message: "User Login Successful.",
                     token:token ,
                     user : {
                        email: foundUser.email,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        type: foundUser.type,
                        profilePic: foundUser.profilePic
                     }
                    });
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

//forgot-password
export async function ForgotPassword (req, res) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate token
        const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET1, { expiresIn: '1h' });
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password.</p>`
        });

        res.status(200).json({ message: 'Password reset email sent' });
    }catch (error) {
        console.error('Error in ForgotPassword:', error); // Log the error
        res.status(500).json({ message: 'Internal server error', error: error.message || error });
    }
    
}
//reset-password
export async function ResetPassword (req, res){
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.SECRET1);

        const user = await User.findOne({
            _id: decoded.userId,
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        
        const saltRounds = 10;
        user.password = await bcrypt.hash(newPassword, saltRounds);
        
        // Update password
        user.password = newPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    }catch (error) {
            console.error('Error in ForgotPassword:', error); // Log the error
            res.status(500).json({ message: 'Internal server error', error: error.message || error });
        }
}

