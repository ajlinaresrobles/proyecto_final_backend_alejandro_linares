import { CartsMongo } from "../dao/managers/CartManagerMongo.js";
import { ProductsMongo } from "../dao/managers/ProductManagerMongo.js";
import { TicketMongo } from "../dao/managers/ticketManagerMongo.js";
import {v4 as uuidv4} from "uuid";



const cartManager = new CartsMongo();
const productManager = new ProductsMongo();
const ticketManager = new TicketMongo();
let myuuid = uuidv4();


export const addCartControl = async(req, res)=>{
    try {
        const cartAdded = await cartManager.addCart();
        res.json({status: "success", cart: cartAdded});
        console.log(cartAdded);
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }

};

export const getCartByIdControl = async(req, res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json({status: "success", cart: cart});
            console.log(cart);
        } else{
                  res.status(400).json({status: "error", message: "this cart does not exist"});
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }

};


export const addProductToCartControl = async(req, res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            const product = await productManager.getProductById(productId);
            if (product) {
                const result = await cartManager.addProductToCart(cartId, productId);
                res.json({status: "success", message: result});
                console.log(result);
            } else {
                res.status(400).json({status: "error", message: "cannot add this product"});
            }
            
        } else{
            res.status(400).json({status: "error", message: "this cart does not exist"});
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
};


export const deleteProductControl = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            const product = await productManager.getProductById(productId);
            if (product) {
                const result = await cartManager.deleteProduct(cartId, productId);
                res.json({status: "success", result: result, message: "product deleted"});
            } else {
                res.status(400).json({status: "error", message: "cannot delete this product"});
            }
            
        } else{
            res.status(400).json({status: "error", message: "this cart does not exist"});
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
};


export const updateCartControl = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const products = req.body.products;
        const cart = await cartManager.getCartById(cartId);
        cart.products = [...products];
        const response = await cartManager.updateCart(cartId, cart);
        res.json({status:"success", result:response, message:"cart updated"});
        console.log(response);
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
};


export const updateQuantityInCartControl = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        await cartManager.getCartById(cartId);
        await productManager.getProductById(productId);
        const response = await cartManager.updateQuantityInCart(cartId, productId, quantity);
        res.json({status:"success", result: response, message:"product updated"});
        console.log(response);
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
};


export const deleteCartControl = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        cart.products=[];
        const response = await cartManager.updateCart(cartId, cart);
        res.json({status:"success", result: response, message:"productos eliminados"});
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
};

export const purchaseControl = async(req,res)=>{
    try {
        const cartId = req.params.cid;
        let approvedProductPurchase = [];
        let rejectedProductPurchase = [];
        let totalAmount = 0
        let cart = await cartManager.getCartById(cartId);
        if (!cart){
            res.status(400).json({status: "error", message: "this cart does not exist"});
        }   
        if(cart.products.length == 0){
            res.status(400).json({status: "error", message: "this cart does not have products"});  
        }else{
            console.log(cart);
       for (let i = 0; i < cart.products.length; i++) {
       
        let productIdCart = cart.products[i]._id;
       
        let productDB = await productManager.getProductById(productIdCart);
        let dif = parseInt(productDB.stock) - cart.products[i].quantity;
        
            if (dif >= 0) {
                
                approvedProductPurchase.push(cart.products[i]);
                totalAmount += cart.products[i].quantity * productDB.price;
                productDB.stock = dif;
                await productManager.updateProducts(cart.products[i]._id, productDB);
                await cartManager.deleteProduct(cartId, cart.products[i]._id);

             }else{
               
                rejectedProductPurchase.push(cart.products[i]);
             };
       };
       console.log("aprobados: ", approvedProductPurchase);

       console.log("rechazados: ", rejectedProductPurchase);

       if (approvedProductPurchase.length > 0 & rejectedProductPurchase.length == 0) {
        const ticket = {
            code: myuuid,
            purchase_daytime: Date(),
            amount: totalAmount,
            purchaser: JSON.parse(JSON.stringify(req.user.email))
        };

        const response = await ticketManager.createTicket(ticket);
        res.json({status:"success", result:response});
        console.log(response);
       };

       if (rejectedProductPurchase.length > 0 & approvedProductPurchase.length == 0) {
        res.json({status:"success",  message: "stock insuficiente de estos productos, no se puede realizar la compra", data: rejectedProductPurchase});
        console.log("stock insuficiente de estos productos, no se puede realizar la compra ", rejectedProductPurchase);
       };


        if (approvedProductPurchase.length > 0 & rejectedProductPurchase.length > 0) {
            const ticket = {
                code: myuuid,
                purchase_daytime: Date(),
                amount: totalAmount,
                purchaser: JSON.parse(JSON.stringify(req.user.email))
            };
            
            const response = await ticketManager.createTicket(ticket);
            res.json({status: "success", result: response, message: "los siguientes productos no se pudieron comprar por falta de stock", data: rejectedProductPurchase});
            console.log(result, " los siguientes productos no se pudieron comprar por falta de stock: ", rejectedProductPurchase);
        };

    };
    } catch (error) {
        res.status(400).json({status:"error", error:error.message});
    }
};