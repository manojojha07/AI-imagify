import express from 'express'
import { loginUser, paymentRazorpay , registerUser, userCredits } from '../controllers/userController.js';
import authProtect from '../midlweres/authMidlewere.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/credits', authProtect , userCredits);


// crete acount then mearge this function 
// userRoutes.post('/pay-razor', authProtect , paymentRazorpay);


export default userRoutes;