import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function registerUser(req,res){
    const {username, email, password} = req.body
    try {
        const existUser = await UserModel.findOne({username})
        if(existUser){
            return res.status(400).json({message:"User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await UserModel.create({username,email,password:hashedPassword})
        res.status(201).json({message: "User registered successfully", user: newUser})
    } catch (error) {
        
        res.status(500).json({error: error})
    }
}

export async function loginUser(req, res) {
    const {email, password} = req.body
    try {
        const existingUser = await UserModel.findOne({email})
        if(!existingUser){
            return res.status(400).json({message: "User not registered"});
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Inavalid credentials"});
        }
        else{
            
        const jwt_token = jwt.sign({
            user:{
                username:existingUser.username,
                email:existingUser.email,
                id:existingUser._id
            },
        },process.env.SECRET_KEY,{expiresIn:"1d"})
            res.status(200).json({jwt_token})
            
            }
    } catch (e) {
        res.status(500).json({error: e})
    }
}