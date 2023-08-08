import { productsModel } from "../dao/models/products.model.js";
import mongoose from "mongoose";
import { config } from "../config/config.js";


await mongoose.connect(config.mongo.mongoUrl);


const updateProducts = async ()=>{
    try {
        // const products = await productsModel.find();
        // console.log(products);
        const adminId = "648edc89dd31dfb0a67f82d0";
        const result = await productsModel.updateMany({},{$set:{owner: adminId}});
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
};

updateProducts();