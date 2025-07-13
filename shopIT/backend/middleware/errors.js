export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error",
    };
    
    // Handle invalid Mongoose Object ID Error
    if(err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err?.path}: ${err?.value}`;
        error = new ErrorHandler(message, 400);
    }

    // Handle Mongoose Validation Error
    if(err.name === "ValidationError") {
        const message = Object.values(err.errors).map((error) => error.message).join(", ");
        error = new ErrorHandler(message, 400);
    }

    // Handle Mongoose Duplicate Key Error
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler(message, 400);
    }

    if (process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack,
            
        });
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
};