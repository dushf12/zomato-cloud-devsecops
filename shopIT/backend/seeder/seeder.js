import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/shopit");
        
        await Product.deleteMany();
        console.log("Products are deleted");
        
        await Product.insertMany(products);
        console.log("Products seeded successfully");

        process.exit();
       
    
    } catch (error) {
        console.error( error.message );
        process.exit(1);
    }
};

seedProducts();