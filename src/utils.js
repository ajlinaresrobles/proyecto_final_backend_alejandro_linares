import path from "path";

import { fileURLToPath } from "url";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "./config/config.js";
import multer from "multer";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createHash = (password)=>{
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

export const validPassword = (password, user)=>{
    return bcrypt.compareSync(password, user.password);
};


export const verifyEmailToken = (token)=>{
    try {
        const info = jwt.verify(token, config.server.secretToken);
        return info.email;
    } catch (error) {
        return null;
    }
};

                // para validar los campos del registro (multer)
const checkFields = (body)=>{
    const {first_name, email, password} = body;
    if (!first_name || !email || !password) {
        return false;
    } else{
        return true;
    }
};

                // para filtrar los datos antes de guardar la imagen del usuario (multer)
const multerProfileFilter = (req, file, callback)=>{
    const validFields = checkFields(req.body);
    if (!validFields) {
        callback(null, false);
    } else{
        callback(null, true);
    }

};

               // para validar los campos del producto (multer)
const checkProductFields = (body)=>{
    const {title, description, price, code, thumbnail, category, stock} = body;
    if (!title || !description || !price || !code || !thumbnail || !category || !stock) {
        return false;
    } else{
        return true;
    }
};

                // para filtrar los datos antes de guardar la imagen del producto (multer)
const multerProductFilter = (req, file, callback)=>{
    const validProductFields = checkProductFields(req.body);
    if (!validProductFields) {
        callback(null, false);
    } else{
        callback(null, true);
    }

};


                // Storage de multer (foto de perfil de usuarios)
const profileStorage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "/multer/users/images"))
    },
    filename: function (req, file, callback) {
        callback(null, `${req.body.email}-perfil-${file.originalname}`)
    }
});
                // Uploader de multer (foto de perfil de usuarios)
export const uploadProfile = multer({storage: profileStorage, fileFilter:multerProfileFilter});



                // Storage de multer (documentos de usuarios)              
const userDocsStorage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "/multer/users/documents"))
    },
    filename: function (req, file, callback) {
        callback(null, `${req.user.email}-documento-${file.originalname}`)
    }
});
                // Uploader de multer (documentos de usuarios)
export const uploadUserDoc = multer({storage: userDocsStorage});



                // Storage de multer (imágenes de productos) 
const ImgProductStorage = multer.diskStorage({

    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "/multer/products/images"))
    },
    filename: function (req, file, callback) {
        callback(null, `${req.body.code}-imagenProducto-${file.originalname}`)
    }
});
                // Uploader de multer (imágenes de productos)
export const uploadImgProduct = multer({storage: ImgProductStorage, fileFilter:multerProductFilter});

