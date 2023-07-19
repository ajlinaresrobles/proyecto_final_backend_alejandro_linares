import { Router } from "express";
import { CartManager } from "../dao/managers/CartManager.js";
import { ProductManager } from "../dao/managers/ProductManager.js";
import { ProductsMongo } from "../dao/managers/ProductManagerMongo.js";
import { CartsMongo } from "../dao/managers/CartManagerMongo.js";
import { addCartControl, getCartByIdControl, addProductToCartControl, deleteProductControl, updateCartControl, updateQuantityInCartControl, deleteCartControl, purchaseControl } from "../controllers/carts.controller.js";
import { checkUserAuthenticated, checkRoles } from "../middlewares/auth.js";

// const cartManager = new CartManager("carts.json");
// const productManager = new ProductManager("products.json");

const cartManager = new CartsMongo();
const productManager = new ProductsMongo();
const router = Router();

router.post("/", addCartControl);

router.get("/:cid", getCartByIdControl);

router.post("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user"]), addProductToCartControl);

router.delete("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user"]), deleteProductControl);

router.put("/:cid", checkUserAuthenticated, checkRoles(["user"]), updateCartControl);

router.put("/:cid/product/:pid", checkUserAuthenticated, checkRoles(["user"]), updateQuantityInCartControl);

router.delete("/:cid", checkUserAuthenticated, checkRoles(["user"]), deleteCartControl);




router.get("/:cid/purchase", purchaseControl);


export {router as cartRouter};

