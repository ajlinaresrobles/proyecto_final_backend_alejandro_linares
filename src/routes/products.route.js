import { Router } from "express";
import { ProductManager } from "../managers/ProductManager.js";

const productManager = new ProductManager("products.json");


const router = Router();

router.get("/:pid",async(req, res)=>{
    try {
        const productId = req.params.pid
        const gotProduct = await productManager.getProductById(productId);
        res.json({status: "success", product: gotProduct});
    } catch (error) {
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
});

router.get("/", async(req, res)=>{
        try {
            const limit = parseInt(req.query.limit);
            const products = await productManager.getProducts();
        if (!limit) {
            return res.json({status: "success", products: products});
        }

        if (limit <= (products.length)) {
            const limitedProducts = products.slice(0,limit);
            res.json({status: "success", products: limitedProducts});
        } else{  
            res.status(400).json({status: "error", message:"limit is bigger than number of products", products: products});
            }
            
        } catch (error) {
            res.status(500).json({status: "error", message: error.message});
        }        
});

router.post("/", async (req, res)=>{
    try {
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            return res.status(400).json({status: "error", message: "every key should be filled"})
        }
        const newProduct = req.body;
        const productAdded = await productManager.addProduct(newProduct);
        res.json({status: "success", product: productAdded});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});


router.put("/:pid", async(req, res)=>{
    try {
        const productId = req.params.pid;
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            return res.status(400).json({status: "error", message: "every key should be filled"})
        }
        
        const newData = req.body;   
        const updatedProduct = await productManager.updateProducts(productId, newData);
        res.json({status: "success", message: "product updated", product: updatedProduct});


    } catch (error) {
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
})


router.delete("/:pid",async(req, res)=>{
    try {
        const productId = req.params.pid
        const productList = await productManager.deleteProducts(productId);
        res.json({status: "success", message: "product deleted", product: productList});

    } catch (error) {
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
});

export {router as productRouter};

