import { Router } from "express";
import { ProductManager } from "../dao/managers/ProductManager.js";
import { ProductsMongo } from "../dao/managers/ProductManagerMongo.js";

// const productManager = new ProductManager("products.json");

const productManager = new ProductsMongo();


const router = Router();

router.get("/:pid",async(req, res)=>{
    try {
        const productId = req.params.pid
        const gotProduct = await productManager.getProductById(productId);
        res.json({status: "success", product: gotProduct});
    } catch (error) {
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
});

router.get("/", async(req, res)=>{
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
})

// router.get("/", async(req, res)=>{
//         try {
//             const limit = parseInt(req.query.limit);
//             const products = await productManager.getProducts();
//         if (!limit) {
//             return res.json({status: "success", products: products});
//         }

//         if (limit <= (products.length)) {
//             const limitedProducts = products.slice(0,limit);
//             res.json({status: "success", products: limitedProducts});
//         } else{  
//             res.status(400).json({status: "error", message:"limit is bigger than number of products", products: products});
//             }
            
//         } catch (error) {
//             res.status(500).json({status: "error", message: error.message});
//         }        
// });

router.post("/", async (req, res)=>{
    try {
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            return res.status(400).json({status: "error", message: "every key should be filled"})
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
});


router.put("/:pid", async(req, res)=>{
    try {
        const productId = req.params.pid;
        const {title, description, code, price, status, stock, category} = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category ) {
            return res.status(400).json({status: "error", message: "every key should be filled"})
        }
        
        const newData = req.body;   
        const updatedProduct = await productManager.updateProducts(productId, newData);
        res.json({status: "success", message: "product updated", product: updatedProduct});
        

    } catch (error) {
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
})


router.delete("/:pid",async(req, res)=>{
    try {
        const productId = req.params.pid
        const productList = await productManager.deleteProducts(productId);
        res.json({status: "success", message: "product deleted", product: productList});

    } catch (error) {
        res.status(400).json({status: "error", message: "there is not product with this id"});
    }
});

export {router as productRouter};

