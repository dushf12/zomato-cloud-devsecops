import express from 'express';
import { getProducts, newProduct, getProductDetails, updateProduct, deleteProduct } from '../controllers/productControllers.js';
import { isAuthenticatedUser, authorizedRoles } from '../middleware/auth.js';
const router = express.Router();

router
    .route("/products")
    .get(getProducts);
router
    .route("/admin/products")
    .post(isAuthenticatedUser, authorizedRoles("admin"), newProduct);
router
    .route("/products/:id")
    .get(getProductDetails);
router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, authorizedRoles("admin"),   updateProduct);
router
    .route("/admin/product/:id")
    .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);
export default router;