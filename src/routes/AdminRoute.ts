import express from "express";
import AdminController from "../controllers/AdminController";
import authMiddleware from "../middleware/AuthMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", adminController.test);
adminRoute.get("/", authMiddleware, adminController.dashboard);
adminRoute.post("/", authMiddleware, adminController.create);
adminRoute.post("/authenticate", adminController.authenticate);

export default adminRoute;