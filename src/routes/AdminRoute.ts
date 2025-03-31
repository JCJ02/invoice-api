import express from "express";
import AdminController from "../controllers/AdminController";
import authMiddleware from "../middlewares/AuthMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", adminController.test);
adminRoute.get("/access-token", authMiddleware, adminController.accessToken);
adminRoute.get("/refresh-token", adminController.refreshToken);

/**
 * @swagger
 * /api/admin:
 *   post:
 *     summary: Create a New Admin Account
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "John Carlo"
 *               lastname:
 *                 type: string
 *                 example: "Jacobe"
 *               email:
 *                 type: string
 *                 example: "john.carlo.jacobe02@gmail.com"
 *     responses:
 *       201:
 *         description: Successfully Created Admin Account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 41
 *                     firstname:
 *                       type: string
 *                       example: "John Carlo"
 *                     lastname:
 *                       type: string
 *                       example: "Jacobe"
 *                     email:
 *                       type: string
 *                       example: "jacobe.johncarlo.02022003@gmail.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-31T07:56:15.117Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-31T07:56:15.117Z"
 *                     deletedAt:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     role:
 *                       type: string
 *                       example: "Admin"
 *                 message:
 *                   type: string
 *                   example: "Successfully Created!"
 *                 code:
 *                   type: integer
 *                   example: 201
 *       403:
 *         description: Email Already Exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "E-mail Already Exist!"
 *                 code:
 *                   type: integer
 *                   example: 403
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "An Unexpected Error Occurred."
 *                 code:
 *                   type: integer
 *                   example: 500
 */

adminRoute.post("/", adminController.create);


/**
 * @swagger
 * /api/admin/authenticate:
 *   post:
 *     summary: Admin - Authentication
 *     tags: [Admin - Authentication]
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
 *                     accessToken:
 *                       type: string
 *                       description: JWT token for authentication
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     refreshToken:
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

adminRoute.post("/authenticate", adminController.authenticate);


export default adminRoute;