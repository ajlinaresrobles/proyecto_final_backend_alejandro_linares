import { Router } from "express";
import { ProductManager } from "../dao/managers/ProductManager.js";
import { ProductsMongo } from "../dao/managers/ProductManagerMongo.js";
import { getProductByIdControl } from "../controllers/products.controller.js";
import { getProductsControl } from "../controllers/products.controller.js";
import { addProductControl } from "../controllers/products.controller.js";
import { updateProductControl } from "../controllers/products.controller.js";
import { deleteProductControl } from "../controllers/products.controller.js";

// const productManager = new ProductManager("products.json");




const router = Router();

router.get("/:pid", getProductByIdControl);
router.get("/", getProductsControl);
router.post("/", addProductControl);
router.put("/:pid", updateProductControl);
router.delete("/:pid", deleteProductControl);

// router.get("/", async(req, res)=>{
//         try {
//             const limit = parseInt(req.query.limit);
//             const products = await productManager.getProducts();
//         if (!limit) {
//             return res.json({status: "success", products: products});
//         }

//         if (limit <= (products.length)) {
//             const limitedProducts = products.slice(0,limit);
//             res.json({status: "success", products: limitedProducts});
//         } else{  
//             res.status(400).json({status: "error", message:"limit is bigger than number of products", products: products});
//             }
            
//         } catch (error) {
//             res.status(500).json({status: "error", message: error.message});
//         }        
// });



export {router as productRouter};

