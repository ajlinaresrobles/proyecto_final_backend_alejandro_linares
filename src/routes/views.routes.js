import { Router } from "express";
import { ProductManager } from "../dao/managers/ProductManager.js";
import { ProductsMongo } from "../dao/managers/ProductManagerMongo.js";

// const productManager = new ProductManager("products.json");
const productManager = new ProductsMongo();

const router = Router();


router.get("/", async(req,res)=>{
    try {
        const products = await productManager.getProducts();

        res.render("home", {products: products});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }   
});

router.get("/realtimeproducts", async(req, res)=>{
    try {
        const products = await productManager.getProducts();

        res.render("realTimeProducts", {products: products});
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }   
});

router.get("/chat", async(req, res)=>{

    try {
        res.render("chat");
        
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }
});


router.get("/products", async(req, res)=>{

    try {
        const {limit=3,page=1,sort="asc",category, stock} = req.query;
        if (!["asc", "desc"].includes(sort)) {
            return res.status(400).json({status: "error", message: "solo puede ser asc o desc"});
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
                totalDocs: result.totalDocs,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}`: null,
                nextLink: result.hasNextPage ? `${baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`)}`: null,
           };
          
           res.render("products", response);
    } catch (error) {
        res.status(500).json({status: "error", message: error.message});
    }

});

export {router as viewsRouter};



