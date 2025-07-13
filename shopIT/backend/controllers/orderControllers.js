import catchAsyncErrors from "../middleware/catchAsynccErrors.js";
import { Order } from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

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