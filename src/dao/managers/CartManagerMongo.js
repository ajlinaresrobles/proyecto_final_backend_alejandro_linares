import { cartsModel } from "../models/carts.model.js"

export class ProductMongo{

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
}