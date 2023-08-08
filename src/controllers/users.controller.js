import { Usermongo } from "../dao/managers/users.mongo.js";


const userManager = new Usermongo();


export const modifyRole = async(req, res)=>{
    try {
        res.send("role modificado");
    } catch (error) {
        res.send(error.message);
    }
};