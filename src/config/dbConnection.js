import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async ()=>{
    try {
        await mongoose.connect(config.mongo.mongoUrl);
        console.log("base de datos conectada");
    } catch (error) {
        console.log(`hubo un error al conectar la basa de datos ${error.message}`);
    }
}

