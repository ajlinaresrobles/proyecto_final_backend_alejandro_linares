import chai from "chai";
import supertest from "supertest";
import { app } from "../src/app.js";
import { userModel } from "../src/dao/models/users.model.js";


const expect = chai.expect;

const requester = supertest(app);


describe("testing para autenticación", ()=>{

    before(async function () {
        this.userMock = {
            first_name: "ana",
            last_name: "lopez",
            email: "analopez@coder.com",
            age: 40,
            password: "adminCod3r1234"
        };
        this.cookie;
        await userModel.deleteMany({});
    });

    it("el endpoint post api/sessions/signup debe permitir registrar un usuario", async function () {
        const response = await requester.post("/api/sessions/signup").send(this.userMock);
        expect(response.statusCode).to.be.equal(200);
    });

    it("el endpoint post api/sessions/login permite loguear un usuario", async function () {
        const response = await requester.post("/api/sessions/login").send({email:this.userMock.email, password:this.userMock.password});
        console.log(response);
        // const cookieHeader = response.header['set-cookie'][0];
        // const cookie ={
        //     name: cookieHeader.split("=")[0],
        //     value: cookieHeader.split("=")[1]
        // }
        // this.cookie = cookie;
        // expect(cookie.name).to.be.equal("connect.sid");
    });

    // it("el endpoint get api/sessions/current debe responder la información del usuario", async function () {
    //     const response = await requester.get("/api/sessions/current").set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);
    //     console.log(response.body);
    // });

    it("el endpoint post api/products debe permitir crear un producto", async function () {
                const productMock = {
                    title: "silla gamer",
                    description: "silla gamer blanca",
                    category: "silla",
                    price: 58990,
                    thumbnail: "https://sodimac.scene7.com/is/image/SodimacCL/5967791_01?wid=1500&hei=1500&qlt=70",
                    code: "aaz569",
                    status: "true",
                    stock: 36
                };
                await requester.post("/api/sessions/login").send({email: this.userMock.email, password: this.userMock.password});
                const response = await requester.post("/api/products").send(productMock);
                console.log(response.data);
            }); 

});

