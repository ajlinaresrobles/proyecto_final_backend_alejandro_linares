
import fs from "fs";
import path from "path";
import { __dirname } from "../utils.js";
import { error } from "console";

class ProductManager{
    constructor(pathName){

        this.path = path.join(__dirname, `/files/${pathName}`);
    }

    fileExists(){
        return fs.existsSync(this.path);
    }

    generateId(products){
        let newid;
                if (!products.length) {
                    newid = 1;
                }
                else{
                    newid = products[products.length-1].id + 1;
                }
            return newid;
       
    }
    async addProduct(product){
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const products = JSON.parse(content);
                const productId = this.generateId(products);               
                product.id = productId;
                products.push(product);
                // console.log("product: ", product);
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                return product;
            } else{
                const productId = this.generateId([]);
                product.id = productId;
                await fs.promises.writeFile(this.path, JSON.stringify([product], null, 2));
                // console.log("product: ", product);
                return product;
            }
        } catch (error) {
            throw new error(error.message);
        }
    };

    async getProducts(){
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const products = JSON.parse(content);
                const arrayProducts = Object.values(products);
                return arrayProducts;
            } else{
                throw new Error("There is no file");
            }
        } catch (error) {
            throw new error(error.message);
        }

    };

    async getProductById(id){
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const products = JSON.parse(content);
                const product = products.find((element)=>element.id === parseInt(id));
                if (product) {
                    return product;
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

    async updateProducts(id, product){
        try {
            if (this.fileExists()) {
                const content = await fs.promises.readFile(this.path, "utf-8");
                const products = JSON.parse(content);
                const productIndex = products.findIndex((element)=>element.id === parseInt(id));
                if (productIndex >=0) {
                    products[productIndex]={
                        ...products[productIndex],
                        ...product
                    }
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
                    return product;  
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
                    throw new error("this id does not exist");
                };
                
            } else{
                throw new Error("There is no file");
            }
        } catch (error) {
            throw new error(error.message);
        }
    };
}


export {ProductManager};

// const manager = new ProductManager("./products.json");

// const principalFunction = async()=>{
// try {
//     // const productAdded = await manager.addProduct({title:"silla", description:"silla terraza", price: 79990, thumbnail:"https://sodimac.scene7.com/is/image/SodimacCL/5967791_01?wid=1500&hei=1500&qlt=70", code:"aaa987", stock: 40});
//     // console.log("productAdded ", productAdded);
//     // const product1 = await manager.getProductById(2);
//     // // console.log("product ", product1);
//     // const resultado = await manager.updateProducts(1, {price:26990});
//     // const showProducts = await manager.getProducts();
//     // console.log("showProducts: " , showProducts);
//     // const deleteProduct = await manager.deleteProducts(4);
//     // console.log("deleteProduct ", deleteProduct);
// } catch (error) {
//     console.log(error.message);
// }
// }


// principalFunction();

