import passport from "passport";
import localStrategy from "passport-local";
import { userModel } from "../dao/models/users.model.js";
import { createHash, validPassword } from "../utils.js";


export const initPassport = ()=>{
                // estrategia registro

    passport.use("signupStrategy", new localStrategy(
        {
            passReqToCallback: true,
            usernameField: "email"
        },
        async(req, username, password, done)=>{
             try {
                const userRegisterForm = req.body;

                const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

	            if( !validEmail.test(userRegisterForm.email) ){
		        return done(null, false);
                }else{

                const user = await userModel.findOne({email:username});

                if (!user) {

                    if (userRegisterForm.email.endsWith("@coder.com") && userRegisterForm.password.startsWith("adminCod3r")) {
                        userRegisterForm.role = "admin";
                        userRegisterForm.password = createHash(userRegisterForm.password);
                        const userCreated = await userModel.create(userRegisterForm);
                        console.log(userCreated);
                        return done(null, userCreated);
                    }else{
                        userRegisterForm.password = createHash(userRegisterForm.password);
                        const userCreated = await userModel.create(userRegisterForm);
        
                    console.log(userCreated);
                        
                    return done(null, userCreated);
                        }
                }else{
                    return done(null, false);
                }
            }
             } catch (error) {
                return done(error);
             }
        }
    ));

                // estrategia login
    passport.use("loginStrategy", new localStrategy(
        {
            usernameField: "email"
        },
        async(username, password,done)=>{
            try {
                const userDB = await userModel.findOne({email:username});
    
                if (userDB) {
                    
                    if (validPassword(password, userDB)) {
                        return done(null, JSON.parse(JSON.stringify(userDB)));
                    } else{
                        return done(null,false);
                    }
    
                } else {
                    return done(null, false);
                }
    
    
            } catch (error) {
                return done(error);
            }
    
        }
    ));

                // serialización y deserialización

    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });
            
    passport.deserializeUser(async(id, done)=>{
        const userDB = await userModel.findById(id);
        done(null, userDB);
    });

}


