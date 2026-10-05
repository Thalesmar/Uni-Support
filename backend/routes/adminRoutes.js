import express from "express";
import { authorization, requireRole } from "../middleware/authorization.js";
import {
  getAllUsers,
  updateUserRole,
  getAdminStats,
} from "../utils/adminControllers.js";

const adminRoutes = express.Router();

// Apply authentication and admin role check to ALL routes in this router
adminRoutes.use(authorization, requireRole("admin"));


// Admin Endpoints
adminRoutes.get("/stats", getAdminStats);
adminRoutes.get("/users", getAllUsers);
adminRoutes.patch("/users/:id/role", updateUserRole);


export default adminRoutes;