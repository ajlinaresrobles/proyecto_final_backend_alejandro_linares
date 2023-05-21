import mongoose from "mongoose";

export const connectDB = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://ajlinaresrobles:Ale120384.@cluster0.wqwvedx.mongodb.net/ProyectoFinal?retryWrites=true&w=majority");
        console.log("base de datos conectada");
    } catch (error) {
        console.log(`hubo un error al conectar la basa de datos ${error.message}`);
    }
}

