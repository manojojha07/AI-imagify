import express from 'express'
import authProtect from '../midlweres/authMidlewere.js';
import { generateImage } from '../controllers/imageConroller.js';

const imageRouter = express.Router();

imageRouter.post('/generate-image', authProtect , generateImage);

export default imageRouter;