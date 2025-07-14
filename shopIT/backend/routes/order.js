import express from "express";
import { isAuthenticatedUser, authorizedRoles } from "../middleware/auth.js";
import { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } from "../controllers/orderControllers.js";


const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
router.route("/admin/orders").get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizedRoles("admin"), updateOrder);
router.route("/admin/order/:id").delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

export default router;