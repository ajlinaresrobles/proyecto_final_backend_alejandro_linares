import { Router } from "express";
import { ProductManager } from "../dao/managers/ProductManager.js";


const productManager = new ProductManager("products.json");

const router = Router();


router.get("/", async(req,res)=>{
    try {
        const products = await productManager.getProducts();

        res.render("home", {products: products});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }   
});

router.get("/realtimeproducts", async(req, res)=>{
    try {
        const products = await productManager.getProducts();

        res.render("realTimeProducts", {products: products});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }   
});





export {router as viewsRouter};



