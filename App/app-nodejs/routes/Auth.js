import express from "express";
import UserController from "../app/controllers/AuthController.js";
import authMiddleware from "../app/middleware/authMiddleware.js";
const routerAuth = express.Router();
routerAuth.post("/login", UserController.login);
routerAuth.post("/register", UserController.register);
routerAuth.post("/refresh", UserController.refreshToken);
routerAuth.get("/profile", authMiddleware.isAuth, UserController.profile);
routerAuth.get("/me", authMiddleware.authApp, UserController.me);
export default routerAuth;