import axios from "axios";
import userModel from "../models/userModel.js";
import FormData from 'form-data';

export const generateImage = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.userId; // ✅ get from middleware

        if (!prompt || !userId) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.creditBalance <= 0) {
            return res.status(402).json({ success: false, message: "No Credit Balance", creditBalance: user.creditBalance });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);

        const { data } = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    'x-api-key': process.env.CLIPDROP_API,
                    ...formData.getHeaders(),
                },
                responseType: 'arraybuffer'
            }
        );

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            { creditBalance: user.creditBalance - 1 },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Image Generated",
            creditBalance: updatedUser.creditBalance,
            resultImage
        });

    } catch (error) {
        console.error("generateImage error:", error.message);
        return res.status(500).json({ success: false, message: "Generate image error!" });
    }
};
