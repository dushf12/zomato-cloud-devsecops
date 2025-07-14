import catchAsyncErrors from "../middleware/catchAsynccErrors.js";
import { Order } from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/product.js";

// Helper function to update product stock
const updateStock = async (productId, quantity) => {
    const product = await Product.findById(productId);
    if (product) {
        product.stock = product.stock - quantity;
        await product.save({ validateBeforeSave: false });
    }
};

// Create New Order => /api/v1/order/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        paymentInfo,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user: req.user._id,
        paymentInfo,
        paidAt: Date.now()
    });

    if (!order) {
        return next(new ErrorHandler("Order not created", 400));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get Single Order => /api/v1/order/:id
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    res.status(200).json({  
        success: true,
        order
    });
});

// Get current user Orders => /api/v1/orders/me
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    });
});

// Get All Orders - Admin => /api/v1/admin/orders
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
        success: true,
        orders
    });
});

// Update / Process Order - Admin => /api/v1/admin/order/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    for (const item of order.orderItems) {
        await updateStock(item.product, item.quantity);
    }

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
        success: true,
        order
    });
});

// Delete Order - Admin => /api/v1/admin/order/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});
