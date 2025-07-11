import catchAsyncErrors from "../middleware/catchAsynccErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplate.js";
import crypto from "crypto";


export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
    });

    sendToken(user, 200, res);
});

// Login User => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Find user in database 
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    // Create token
    sendToken(user, 200, res);
});

// Logout User => /api/v1/logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
});

// Forgot Password => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    // Find user in database
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;
    const html = getResetPasswordTemplate(user.name, resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message,
            html
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        });

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password => /api/v1/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = req.params.token;

    // Hash the token
    const resetPasswordTokenHash = crypto.createHash("sha256").update(resetPasswordToken).digest("hex");


    // Find user with matching token
    const user = await User.findOne({
        resetPasswordToken: resetPasswordTokenHash,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Password reset token is invalid or has expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

