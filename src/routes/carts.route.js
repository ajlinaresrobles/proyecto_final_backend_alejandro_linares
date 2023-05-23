import { Router } from "express";
import { CartManager } from "../dao/managers/CartManager.js";
import { ProductManager } from "../dao/managers/ProductManager.js";
import { ProductsMongo } from "../dao/managers/ProductManagerMongo.js";
import { CartsMongo } from "../dao/managers/CartManagerMongo.js";

// const cartManager = new CartManager("carts.json");
// const productManager = new ProductManager("products.json");

const cartManager = new CartsMongo();
const productManager = new ProductsMongo();
const router = Router();

router.post("/", async(req, res)=>{
    try {
        const cartAdded = await cartManager.addCart();
        res.json({status: "success", cart: cartAdded});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }

});

router.get("/:cid", async(req, res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json({status: "success", cart: cart});
        } else{
            res.status(400).json({status: "error", message: "this cart does not exist"});
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }

});

router.post("/:cid/product/:pid", async(req, res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            const product = await productManager.getProductById(productId);
            if (product) {
                const result = await cartManager.addProductToCart(cartId, productId);
                res.json({status: "success", message: result});
            } else {
                res.status(400).json({status: "error", message: "cannot add this product"});
            }
            
        } else{
            res.status(400).json({status: "error", message: "this cart does not exist"});
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});



export {router as cartRouter};

