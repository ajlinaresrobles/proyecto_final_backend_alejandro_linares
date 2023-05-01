console.log("realTimeProducts js");

const socketClient = io();

const title = document.getElementById("title");
const description = document.getElementById("description");
const category = document.getElementById("category");
const price = document.getElementById("price");
const thumbnail = document.getElementById("thumbnail");
const code = document.getElementById("code");
const status =document.getElementById("status");
const stock = document.getElementById("stock");
const addProduct = document.getElementById("addProduct");
const getProducts = document.getElementById("getProducts");
const deleteProduct = document.getElementById("deleteProduct");
const idProduct = document.getElementById("idProduct");


addProduct.addEventListener("click", (e)=>{
    const newProduct = {
            title: title.value,
            description: description.value,
            category: category.value,
            price: price.value,
            thumbnail: thumbnail.value,
            code: code.value,
            status: status.value,
            stock: stock.value
    } 
    socketClient.emit("newProduct", newProduct)
}); 

deleteProduct.addEventListener("click", (e)=>{
    socketClient.emit("deleteOrder", idProduct.value);
});


socketClient.on("totalProductsMessage", (data)=>{
    console.log(data);
    
    getProducts.innerHTML = "";
    data.forEach(element => {
        const parrafo = document.createElement("p");
        parrafo.innerHTML = `${JSON.stringify(element)}`;
        getProducts.appendChild((parrafo));
    });
})
