import { ProductsMongo } from "../dao/managers/ProductManagerMongo.js";
import { CustomError } from "../services/errors/customError.service.js";
import { generateProductErrorParams } from "../services/errors/productErrorParams.service.js";
import { EError } from "../enums/Eerror.js";

const productManager = new ProductsMongo();


export const getProductByIdControl = async(req, res)=>{
    try {
        const productId = req.params.pid
        const gotProduct = await productManager.getProductById(productId);
        res.json({status: "success", product: gotProduct});
        console.log(gotProduct);
    } catch (error) {
       
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
};

export const getProductsControl = async(req, res)=>{
    try {
        const {limit=10,page=1,sort,category, stock} = req.query;
        if (!["asc", "desc"].includes(sort)) {
            res.status(400).json({status: "error", message: "solo puede ser asc o desc"});
        };
        const sortValue = sort === "asc" ? 1 : -1;
        const stockValue = stock === 0 ? undefined : parseInt(stock);
        // console.log("limit: ", limit, "page: ", page, "sort: ", sortValue, "category: ", category, "stock: ", stock);    
        let query = {};
        if (category && stock){
            query = {category: category, stock: stockValue}
        }else{
                if (category || stockValue) {
                    if (category) {
                        query={category: category}
                    }else{
                        query={stock: stockValue}
                    }
                }
            }
            const baseUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
           const result= await productManager.getPaginate(query, {page, limit, sort:{price:sortValue}, lean: true});
          
           const response = {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}` : null,
                nextLink: result.hasNextPage ? `${baseUrl}?page=${result.nextPage}` : null
           };
           res.json(response);
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
};

export const addProductControl = async (req, res)=>{
    try {
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            CustomError.createError({
                name: "error al crear el producto",
                cause: generateProductErrorParams(),
                message: "error en la creación del producto",
                errorCode: EError.INVALID_JSON
            })
            // return res.status(400).json({status: "error", message: "every key should be filled"})
        }
    
        const newProduct = req.body;
        const products = await productManager.getProducts();
        const matchCode = products.some(element=>element.code === code);

        if (matchCode) {
            return res.status(400).json({status: "error", message: "there is another product using this code"});
        } else {
                
        const productAdded = await productManager.addProduct(newProduct);
        res.json({status: "success", product: productAdded});
        console.log(productAdded);
        }
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
};

export const updateProductControl = async(req, res)=>{
    try {
        const productId = req.params.pid;
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            return res.status(400).json({status: "error", message: "every key should be filled"})
        }
        
        const newData = req.body;   
        const updatedProduct = await productManager.updateProducts(productId, newData);
        res.json({status: "success", message: "product updated", product: updatedProduct});
        console.log(updatedProduct);

    } catch (error) {
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
};

export const deleteProductControl = async(req, res)=>{
    try {
        const productId = req.params.pid
        const productList = await productManager.deleteProducts(productId);
        res.json({status: "success", message: "product deleted", product: productList});
        console.log(productList);
    } catch (error) {
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
}