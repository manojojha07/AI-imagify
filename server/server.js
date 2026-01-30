import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();
import dbConnection from './src/configs/db.config.js';
import userRoutes from './src/routes/userRoute.js';
import imageRouter from './src/routes/imagrRoute.js';

const app = express();

app.use(express.json());
app.use(cors());

app.get("/" ,(req, res) => {
    res.send("Api Working Finally");
});

app.use('/api/auth', userRoutes);
app.use('/api/image', imageRouter);

const PORT = process.env.PORT || 4000;
// db config and connected database
dbConnection();
app.listen(PORT, () => {
    console.log(`🚀 ! http://localhost:${PORT} `);
});