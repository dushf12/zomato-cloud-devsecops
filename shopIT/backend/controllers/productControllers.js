import Product from "../models/product.js";
import catchAsyncErrors from "../middleware/catchAsynccErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilter from "../utils/apiFilters.js";

// Create new Product => /api/v1/products
export const getProducts = catchAsyncErrors(async(req , res ) => {

    const apiFilter = new APIFilter(Product.find(), req.query).search().filter();
    const products = await apiFilter.query;
    
    res.status(200).json({
        products,
    });
    
});

// Create new Product => /api/v1/admin/products
export const newProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.create(req.body);

    res.status(200).json({
        product,
    });


});

//Get single product details => /api/v1/product/:id
export const getProductDetails = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        product,
    });
});

// Update product details => /api/v1/admin/product/:id
export const updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req?.params?.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req?.body, { new: true });

    res.status(200).json({
        product,
    });


});  

// Delete product => /api/v1/admin/product/:id
export const deleteProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req?.params?.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await product.deleteOne();

    res.status(200).json({
        message: "Product deleted successfully",
    });


});