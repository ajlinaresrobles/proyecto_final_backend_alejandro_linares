import express from "express";
import { productRouter } from "./routes/products.route.js";
import { cartRouter } from "./routes/carts.route.js";


const app = express();

const port = 8080;

app.listen(port, ()=> console.log(`server listening on port ${port}`));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);


