import { productsModel } from "../models/products.model.js";

export class ProductsMongo{

    constructor(){
        this.model = productsModel;
    }

        async getPaginate(query={}, options={}){

            try {
                const result = await this.model.paginate(query, options);
                return result;
            } catch (error) {
                throw new Error(`Error al obtener productos ${error.message}`);  
            }
        }

        async getProducts(){
            try {
                const data = await this.model.find();
                
                return data
            } catch (error) {
                throw new Error(`Error al obtener productos ${error.message}`);
            }

        }

        async getProductById(id){
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

        async addProduct(product){
            try {
                const data = await this.model.create(product);
                return data
            } catch (error) {
                throw new Error(`Error al crear el producto ${error.message}`);
            }
        }

        
        async updateProducts(id, product){
            try {
                const data = await this.model.findByIdAndUpdate(id, product, {new:true});
                if (!data) {
                    throw new Error(`product with id: ${id} does not exist`);
                }
                return data
            } catch (error) {
                throw new Error(`Error al actualizar el producto ${error.message}`);
            }

        }


        async deleteProducts(id){
            try {
                const data = await this.model.findByIdAndDelete(id);
              
                return {message: `producto con el id ${id} fué eliminado`};
            } catch (error) {
                throw new Error(`Error al eliminar el producto ${error.message}`);
            }

        }

}