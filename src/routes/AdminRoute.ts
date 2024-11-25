import express from "express";
import AdminController from "../controllers/AdminController";
import authMiddleware from "../middleware/AuthMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", adminController.test);
adminRoute.get("/dashboard", authMiddleware, adminController.dashboard);
adminRoute.post("/", authMiddleware, adminController.create);
adminRoute.post("/authenticate", adminController.authenticate);

/**
 * @swagger
 * /api/admin/authenticate:
 *   post:
 *     summary: Admin - Authentication
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin's Email Address
 *                 example: "barandino.kimberly.03222002@gmail.com"
 *               password:
 *                 type: string
 *                 description: Admin's Password
 *                 example: "2*])cAyG68"
 *     responses:
 *       200:
 *         description: Logged In Successfully!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT token for authentication
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     admin:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 35
 *                         firstname:
 *                           type: string
 *                           example: "Kimberly"
 *                         lastname:
 *                           type: string
 *                           example: "Barandino"
 *                         email:
 *                           type: string
 *                           example: "barandino.kimberly.03222002@gmail.com"
 *                         role:
 *                           type: string
 *                           example: "Admin"
 *                 message:
 *                   type: string
 *                   example: "Logged In Successfully!"
 *                 code:
 *                   type: integer
 *                   example: 200
 *       400:
 *         description: Invalid login credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid Credentials!"
 *                 code:
 *                   type: integer
 *                   example: 400
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */


export default adminRoute;