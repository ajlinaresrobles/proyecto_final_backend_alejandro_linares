import express from "express";
import { productRouter } from "./routes/products.route.js";
import { cartRouter } from "./routes/carts.route.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { viewsRouter } from "./routes/views.routes.js";
import { __dirname } from "./utils.js";
import path from "path";
import { ProductManager } from "./dao/managers/ProductManager.js";
import { connectDB } from "./config/dbConnection.js";

const app = express();

const port = 8080;

const httpServer = app.listen(port, ()=> console.log(`server listening on port ${port}`));

const socketServer = new Server (httpServer);

const productManager = new ProductManager("products.json")

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "/views"));


app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

connectDB();

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use(viewsRouter);


socketServer.on("connection", async(socket)=>{
    try {
        console.log(`nuevo socket cliente conectado ${socket.id}`)
    const totalProducts = await productManager.getProducts();
    socketServer.emit("totalProductsMessage", totalProducts);

    socket.on("newProduct", async(data)=>{
        try {
            console.log("newProduct", data);
            const addedProduct = await productManager.addProduct(data);
            
            socketServer.emit("newProductMessage", addedProduct);
        } catch (error) {
            throw new error (error.message);
        }
       
    });
    } catch (error) {
        throw new error (error.message);
    }

    socket.on("deleteOrder", async(data)=>{
        try {
            await productManager.deleteProducts(data);
        } catch (error) {
            throw new error (error.message); 
        }
        
    })
});



