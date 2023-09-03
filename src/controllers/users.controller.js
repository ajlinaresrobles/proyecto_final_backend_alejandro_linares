import { Usermongo } from "../dao/managers/users.mongo.js";


const userManager = new Usermongo();


export const modifyRole = async(req, res)=>{
    try {
        const userId = req.params.uid;
        const user = await userManager.getUserById(userId);
        const userRole = user.role;
        if (userRole === "user") {
            user.role = "premium";
        } else if(userRole === "premium"){
            user.role = "user";
        } else {
            res.send("No es posible cambiar el rol del usuario")
        };
        const result = await userManager.updateUser(userId, user);
        res.send("Rol del usuario ha sido modificado");
    } catch (error) {
        res.send(error.message);
    }
};

export const uploadDocumentsControl = async(req, res)=>{
    try {
        
        const userId = req.params.uid;
        const user = await userManager.getUserById(userId);

        if (!user) {
            return res.json({status: "error", message: "El usuario no existe"});
        }
        console.log(req.files);
        const identificacion = req.files["identificacion"][0] || null;
        const domicilio = req.files["domicilio"][0] || null;
        const estadoDeCuenta = req.files["estadoDeCuenta"][0] || null;
        const docs = [];
        if (identificacion) {
            docs.push({name:"identificación", reference: identificacion.filename});
        }
        if (domicilio) {
            docs.push({name:"domicilio", reference: domicilio.filename});
        }
        if (estadoDeCuenta) {
            docs.push({name:"estadoDeCuenta", reference: estadoDeCuenta.filename});
        }
        console.log(docs);
        user.documents = docs;

        if (user.documents.length === 3) {
            user.status = "completo"
        } else {
            user.status = "incompleto"
        }
        await userManager.updateUser(user._id, user);
        res.json({status: "success", message: "solicitud procesada"});
       

    } catch (error) {
        res.send(error.message); 
    }
}