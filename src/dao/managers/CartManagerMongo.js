import { cartsModel } from "../models/carts.model.js"

export class CartsMongo{

    constructor(){

        this.model = cartsModel;
    }

    async addCart(){
        try {
            const cart = {
                products:[]
            }
            const data = await this.model.create(cart);
            return data
        } catch (error) {
            throw new Error(`Error al crear el carrito ${error.message}`);
        }
    }

    async getCartById(id){
        try {
            const data = await this.model.findById(id).lean();
            if (!data) {
                throw new Error(`cart with id: ${id} does not exist`);
            }
            return data
        } catch (error) {
            throw new Error(`Error al obtener carrito ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId){
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(element=>element.id===productId);
            if(productIndex>=0){
                cart.products[productIndex].quantity = cart.products[productIndex].quantity+1;
            } else {
                cart.products.push({
                    _id: productId,
                    quantity: 1
                });
            };
            const data = await this.model.findByIdAndUpdate(cartId, cart,{new:true});
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    };
     

    async deleteProduct(cartId,productId){
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(element=>element.id==productId);
            if(productIndex>=0){
                const newProducts = cart.products.filter(element=>element.id!=productId);
                cart.products = [...newProducts];
                const data = await this.model.findByIdAndUpdate(cartId, cart,{new:true});
                return data;
            } else {
                throw new Error(`This product does not exist in this cart`);
            };
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    };

    async updateCart(id, cart){
        try {
            await this.model.findByIdAndUpdate(id,cart);
            return "cart updated";
        } catch (error) {
            throw new Error(error.message)
        }
    };

    async updateQuantityInCart(cartId, productId, quantity){
        try {
            const cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(element=>element.id==productId);
            if(productIndex>=0){
                cart.products[productIndex].quantity = quantity;
            } else {
                throw new Error("This product does not exist in this cart");
            };
            const data = await this.model.findByIdAndUpdate(cartId, cart,{new:true});
            const response = JSON.parse(JSON.stringify(data));
            return response;
        } catch (error) {
            throw new Error(error.message)
        }
    };


}