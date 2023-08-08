import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({

    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    code: {type: String, required: true, unique: true},
    status: {type: Boolean, default: true},
    thumbnail: {type: String, required: true},
    category: {type: String, required: true},
    stock: {type: String, required: true},
    owner:{type: mongoose.Schema.Types.ObjectId, ref:"users"}
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model(productsCollection, productsSchema);
