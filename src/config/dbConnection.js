import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "../utils/logger.js";

export const connectDB = async ()=>{
    try {
        await mongoose.connect(config.mongo.mongoUrl);
        logger.info("base de datos conectada");
    } catch (error) {
        logger.fatal(`hubo un error al conectar la basa de datos ${error.message}`);
    }
}

