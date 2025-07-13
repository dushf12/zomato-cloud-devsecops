import express from "express";
import { registerUser, loginUser, forgotPassword } from "../controllers/authControllers.js";
import { logoutUser } from "../controllers/authControllers.js";
import { resetPassword } from "../controllers/authControllers.js";
import { getUserProfile } from "../controllers/authControllers.js";
import { updatePassword } from "../controllers/authControllers.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
import { updateProfile } from "../controllers/authControllers.js";
import { authorizedRoles } from "../middleware/auth.js";
import { getAllUsers } from "../controllers/authControllers.js";
import { getSingleUser } from "../controllers/authControllers.js";
import { updateUser } from "../controllers/authControllers.js";
import { deleteUser } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/me", isAuthenticatedUser, getUserProfile);
router.put("/password/update", isAuthenticatedUser, updatePassword);
router.put("/me/update", isAuthenticatedUser, updateProfile);
router.get("/admin/users", isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);
router.get("/admin/user/:id", isAuthenticatedUser, authorizedRoles("admin"), getSingleUser);
router.put("/admin/user/:id", isAuthenticatedUser, authorizedRoles("admin"), updateUser);
router.delete("/admin/user/:id", isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

export default router;