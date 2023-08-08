import mongoose from "mongoose";

const usersCollection = "users";

const usersSchema = new mongoose.Schema({

    first_name:{type:String, required: true},
    last_name:{type: String},
    email:{type:String, required: true, unique: true},
    age: {type: Number},
    password: {type:String, required:true},
    cart:{type: mongoose.Schema.Types.ObjectId, ref: "carts"},
    role:{type:String, enum:["user", "admin", "premium"], default: "user", required:true}
});

export const userModel = mongoose.model(usersCollection, usersSchema);