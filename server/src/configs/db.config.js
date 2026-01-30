import mongoose from "mongoose"


const dbConnection = async() => {
    try {
        mongoose.connection.on("connected", () => {
         console.log(" 🔥 Connected To Database ! ");
        });
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
    console.error("Can't connect to database:", error);  
    }
}

export default dbConnection;
