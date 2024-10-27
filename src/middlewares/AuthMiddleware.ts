import { NextFunction, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import AppResponse from "../utils/AppResponse";
import AdminService from "../services/AdminService";
import { authMiddlewareRequest } from "../types/AuthMiddlewareType";
import { verifyToken } from "../utils/token";

const authMiddleware = async (req: authMiddlewareRequest, res: Response, next: NextFunction) => {

    try {

        const adminService = new AdminService();

        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: "No Token Provided!",
                code: 403
            });
        }

        const verifiedToken = verifyToken(token) as any;

        if (verifiedToken.role === "Admin") {

            const admin = await adminService.show(verifiedToken.id);

            if (!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 403
                });
            } else {

                req.user = admin;

                next();
            }

        } else {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: "Unauthorized!",
                code: 403
            });
        }

    } catch (error: any) {

        if (error instanceof JsonWebTokenError) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: "Invalid Token",
                code: 401
            });
        } else {
            console.error(error);
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

}

export default authMiddleware;