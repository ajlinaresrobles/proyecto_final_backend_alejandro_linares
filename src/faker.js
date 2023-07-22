import { Faker, faker, es_MX } from "@faker-js/faker";

const customFaker = new Faker({
    locale: [es_MX]
});

const {database, commerce, string, image} = customFaker;

const generateProduct = ()=>{
    return {
        id: database.mongodbObjectId(),
        title: commerce.productName(),
        price: commerce.price({ min: 30000, max: 100000, dec: 0, symbol: '$' }),
        code: string.alphanumeric(),
        thumbnail: image.urlPicsumPhotos(),
        stock: parseInt(string.numeric(2))
    }
};

export const generate100Products = ()=>{
    let products = [];
    for (let i = 0; i < 100; i++) {
        const newProduct = generateProduct();
        products.push(newProduct);
    };
    return products;
};