import dotenv from "dotenv";
import express from 'express';
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middleware/errors.js";
import cookieParser from "cookie-parser";

const app = express();


// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
});

dotenv.config({path : "backend/config/config.env"});

//Creating database connection
connectDatabase();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


console.log('hello');


//Import all routes
import productRoutes from "./routes/product.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
app.use("/api/v1", authRoutes)
app.use("/api/v1", productRoutes)
app.use("/api/v1", orderRoutes)

// Using error middleware
app.use(errorMiddleware);

// Error handling middleware for JSON parsing (must come after routes)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid JSON format' 
        });
    }
    next();
});



const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
} );



//Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});