export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal Server Error",
    };

    if(err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err?.path}: ${err?.value}`;
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