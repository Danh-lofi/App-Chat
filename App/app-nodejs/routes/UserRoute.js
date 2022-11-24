import express from "express";
import UserController from "../app/controllers/UserController.js";
import authMiddleware from "../app/middleware/authMiddleware.js";

const routerUser = express.Router();

routerUser.post("/update", authMiddleware.isAuth, UserController.update);
routerUser.get("/getProfileUserFromId", UserController.getProfileUserFromId);

export default routerUser;
