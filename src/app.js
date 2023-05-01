import express from "express";
import { productRouter } from "./routes/products.route.js";
import { cartRouter } from "./routes/carts.route.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import { viewsRouter } from "./routes/views.routes.js";
import { __dirname } from "./utils.js";
import path from "path";


const app = express();

const port = 8080;

const httpServer = app.listen(port, ()=> console.log(`server listening on port ${port}`));

const socketServer = new Server (httpServer);

app.engine('.hbs', handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "/views"));


app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use(viewsRouter);


socketServer.on("connection", (socket)=>{
    console.log(`nuevo socket cliente conectado ${socket.id}`)
});



