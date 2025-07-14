import Product from "../models/product.js";
import catchAsyncErrors from "../middleware/catchAsynccErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import APIFilter from "../utils/apiFilters.js";


// Create new Product => /api/v1/products
export const getProducts = catchAsyncErrors(async(req , res ) => {

    const products = await Product.find();
    
    res.status(200).json({
        products,
        productsCount: products.length
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
export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        product,
    });
});

// Update product details => /api/v1/admin/product/:id
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
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
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req?.params?.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    await product.deleteOne();

    res.status(200).json({
        message: "Product deleted successfully",
    });


});

// Create new Review or Update the review => /api/v1/review
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const product = await Product.findById(productId);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if(isReviewed) {
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };
        product.reviews.push(review);
    }

    product.numOfReviews = product.reviews.length;

    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        product
    });
});

// Get product reviews => /api/v1/reviews
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        reviews: product.reviews
    });
});

// Delete review => /api/v1/delete-review
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if(!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(
        rev => rev._id.toString() !== req.query.id.toString()
    );

    const numOfReviews = reviews.length;

    let ratings = 0;
    reviews.forEach(rev => {
        ratings += rev.rating;
    });

    const avg = numOfReviews > 0 ? ratings / numOfReviews : 0;

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings: avg,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });
});