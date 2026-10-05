import {
  register,
  login,
  getProfile,
  logout,
  updateUser
} from "../utils/authControllers.js";
import { authentication } from "../middleware/authentication.js";
import express from "express";

const authRoutes = express.Router();


authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
// authorization runs first: no valid cookie => 401, never reaches getProfile.
authRoutes.get("/profile", authentication, getProfile);
authRoutes.patch("/update", authentication, updateUser);

export default authRoutes;
