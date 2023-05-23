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
            throw new Error(`Error al crear el producto ${error.message}`);
        }
    }

    async getCartById(id){
        try {
            const data = await this.model.findById(id);
            if (!data) {
                throw new Error(`product with id: ${id} does not exist`);
            }
            return data
        } catch (error) {
            throw new Error(`Error al obtener producto ${error.message}`);
        }
    }

    async addProductToCart(cartId, productId){
        
    }
     

    async deleteProducts(id){

    }


}