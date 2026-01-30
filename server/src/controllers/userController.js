import userModel from "../models/userModel.js";
import bcrypt  from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from '../models/transactionModel.js'
import dotenv from 'dotenv';
import Razorpay from "razorpay";
import Stripe from "stripe";

dotenv.config();

export const registerUser = async(req, res) => {
try {
       const { name , email , password} = req.body;

       if(!name || !email || !password){
   return res.status(400).json({success: false , message: "All fields required"})
       }
   
   const user = await userModel.findOne({email});

   if(user){
   return res.status(400).json({success: false , message: "User already exists!"})
   }
   
   const  saltRounds = await bcrypt.genSalt(10)
  const hashPasword = await bcrypt.hash(password, saltRounds);

    const newUser = await userModel.create({
        name,
        email,
        password :hashPasword
    });

    const token =jwt.sign({id: newUser._id}, process.env.JWT_SECRET, { expiresIn: '7d' });

   return res.status(201).json({success:true,
     token ,
      user: {name:newUser.name},
       message:"Registered Successfully !"
    })

} catch (error) {
  return  res.status(500)
      .json({ success: false, message: "Registration failed" });
    }
}


export const loginUser = async (req ,res)=> {
 try {
    const {email, password} = req.body;
     if( !email || !password){
   return res.json({success: false , message: "All fields required"})
       }

 const user = await userModel.findOne({email});
 if(!user){
    return res.json({success: false , message:"Invalid email or password"});
 }

 const isMatch = await bcrypt.compare(password, user.password);

if(isMatch){
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({
        success: true,
        token,
        user: { name: user.name },
        message: "Login successful!"
    });
}
 else{
        console.log("Password did not match");
    console.log("else error");
    
    return res.status(400).json({success: false , message:"Invalid email or password"});
 }
 } catch (error) {
     console.error("Login error:", error);
return res.status(500).json({success: false , message:"Login failed"});
 }};



 
export const userCredits = async (req, res) => {
  const userId = req.userId; // ✅ use userId from middleware
  // const {userId} = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }


    return res.status(200).json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};





export const paymentRazorpay = async (req, res) => {
  try {
    // FIX 1: correct extraction of userId
    const userId = req.userId;
    const { planId } = req.body;

    if (!userId || !planId) {
      return res.json({ success: false, message: "missing details" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let credits, plan, amount;

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;

      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;

      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;

      default:
        return res.json({ success: false, message: "Plan not found" });
    }

    const date = Date.now();

    const transactionData = {
      userId,
      plan,
      amount,
      credits,
      date
    };

    const newTransaction = await transactionModel.create(transactionData);

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY,
      receipt: newTransaction._id.toString(),
    };

    // FIX 3: use promise instead of callback
    const order = await razorpayInstance.orders.create(options);

    return res.json({ success: true, order });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
