import fs from "fs";
import path from "path";
import { __dirname } from "../../utils.js";

class CartManager{
    constructor(pathName){

        this.path = path.join(__dirname, `/dao/files/${pathName}`);
    }

    fileExists(){
        return fs.existsSync(this.path);
    }

    generateId(carts){
        let newid;
                if (!carts.length) {
                    newid = 1;
                }
                else{
                    newid = carts[carts.length-1].id + 1;
                }
            return newid;
       
    }
    async addCart(){
        try {

            const cart = {
                products:[]
            }
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(content);
                const cartId = this.generateId(carts);               
                cart.id = cartId;
                carts.push(cart);
                
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
                return cart;
            } else{
                const cartId = this.generateId([]);
                cart.id = cartId;
                await fs.promises.writeFile(this.path, JSON.stringify([cart], null, 2));
                
                return cart;
            }
        } catch (error) {
            throw new error(error.message);
        }
    };


    async getCartById(id){
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(content);
                const cart = carts.find((element)=>element.id === parseInt(id));
                if (cart) {
                    return cart;
                } else {
                    return null;
                };
            } else{
                throw new Error("There is no file");
            }
        } catch (error) {
            throw new error(error.message);
        }
    };

    async addProductToCart(cartId, productId){
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const carts = JSON.parse(content);
                const cartIndex = carts.findIndex(element=>element.id === parseInt(cartId));
                if (cartIndex >=0) {
                    const productIndex = carts[cartIndex].products.findIndex(element=>element.product === parseInt(productId));
                    if (productIndex>=0) {
                        carts[cartIndex].products[productIndex]={
                            product: carts[cartIndex].products[productIndex].product,
                            quantity: carts[cartIndex].products[productIndex].quantity + 1
                    }
                        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));  
                    } else {
                        const newCartProduct = {
                            product: parseInt(productId),
                            quantity: 1
                        }
                        carts[cartIndex].products.push(newCartProduct);
                        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2)); 
                    }
                    return "added product"
                } else {
                    throw new error (`This cart does not exist`);
                }
                // const content = await fs.promises.readFile(this.path, "utf-8");
                // const products = JSON.parse(content);
                // const productIndex = products.findIndex((element)=>element.id === id);
                // if (productIndex >=0) {
                //     products[productIndex]={
                //         ...products[productIndex],
                //         ...product
                //     }
                //     await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                //     return productIndex;  
                // } else {
                //     return null;
                // };
            } else{
                throw new Error("There is no file");
            }
        } catch (error) {
            throw new error(error.message);
        }
    };

    async deleteProducts(id){
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const products = JSON.parse(content);
                const product = products.find((element)=>element.id === parseInt(id));
                if (product) {
                    const filteredProducts = products.filter((element)=>element.id !== parseInt(id));
                    await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));
                    return filteredProducts
                } else {
                    return null;
                };
                
            } else{
                throw new Error("There is no file");
            }
        } catch (error) {
            throw new error(error.message);
        }
    };
}


export {CartManager};