import express from "express";
import AdminController from "../controllers/AdminController";
import authMiddleware from "../middleware/AuthMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", adminController.test);
adminRoute.get("/index", authMiddleware, adminController.index);
adminRoute.post("/create", adminController.createAdmin);
adminRoute.post("/authenticate", adminController.authenticate);

export default adminRoute;