import express from "express";
import AdminController from "../controllers/AdminController";
import authMiddleware from "../middlewares/AuthMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", adminController.test);
adminRoute.get("/dashboard", authMiddleware, adminController.dashboard);
adminRoute.post("/", adminController.create);
adminRoute.post("/authenticate", adminController.authenticate);

export default adminRoute;