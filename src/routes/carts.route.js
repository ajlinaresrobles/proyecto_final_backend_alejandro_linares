import { Router } from "express";
import { CartManager } from "../dao/managers/CartManager.js";
import { ProductManager } from "../dao/managers/ProductManager.js";
import { ProductsMongo } from "../dao/managers/ProductManagerMongo.js";
import { CartsMongo } from "../dao/managers/CartManagerMongo.js";
import { addCartControl, getCartByIdControl, addProductToCartControl, deleteProductControl, updateCartControl, updateQuantityInCartControl, deleteCartControl } from "../controllers/carts.controller.js";

// const cartManager = new CartManager("carts.json");
// const productManager = new ProductManager("products.json");

const cartManager = new CartsMongo();
const productManager = new ProductsMongo();
const router = Router();

router.post("/", addCartControl);

router.get("/:cid", getCartByIdControl);

router.post("/:cid/product/:pid", addProductToCartControl);

router.delete("/:cid/product/:pid", deleteProductControl);

router.put("/:cid", updateCartControl);

router.put("/:cid/product/:pid", updateQuantityInCartControl);

router.delete("/:cid", deleteCartControl);


export {router as cartRouter};

