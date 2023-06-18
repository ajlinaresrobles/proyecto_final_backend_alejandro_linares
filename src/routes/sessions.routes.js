import { Router } from "express";
import passport from "passport";


const router = Router();


router.post("/signup", passport.authenticate("signupStrategy", {failureRedirect: "/api/sessions/failed-signup"}), (req, res)=>{
    res.send(`<div> usuario registrado exitosamente, <a href= "/login">Ir al login</a></div>`)
});

router.get("/failed-signup", (req, res)=>{
    res.send(`<div> error al registrarse, <a href= "/signup">intente de nuevo</a></div>`)
});


router.post("/login", passport.authenticate("loginStrategy", {failureRedirect: "/api/sessions/failed-login"}), (req, res)=>{
    res.redirect("/products?page=1");
});

router.get("/failed-login", (req, res)=>{
    res.send(`<div> error al iniciar sesión, <a href= "/login">intente de nuevo</a></div>`);
});



router.get("/logout",(req, res)=>{

    req.logOut(error=>{

            if (error) {
                return res.send(`No se pudo cerrar sesión  <a href= "/products?page=1">Ir al perfil</a>`);
            } else {
                req.session.destroy(error=>{
                    if (error) {
                        return res.send(`No se pudo cerrar sesión  <a href= "/products?page=1">Ir al perfil</a>`)};
                        res.redirect("/");
                });
            }
    })   
});

router.get("/current", (req, res)=>{
    res.render("current", {user: JSON.parse(JSON.stringify(req.user))});
});


export {router as sessionsRouter}

