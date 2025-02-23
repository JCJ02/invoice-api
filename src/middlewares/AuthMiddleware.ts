import { NextFunction, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import AppResponse from "../utils/appResponse";
import AdminService from "../services/AdminService";
import { authMiddlewareRequest } from "../types/AuthMiddlewareType";
import { verifyToken } from "../utils/token";

const authMiddleware = async (req: authMiddlewareRequest, res: Response, next: NextFunction) => {

    try {

        const adminService = new AdminService();

        const token = req.headers.authorization?.split(' ')[1];

        if (!token || token.trim() === "") {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: "No Token Provided!",
                code: 403
            });
        }

        const verifiedToken = verifyToken(token) as any;

        let user;

        if (verifiedToken.role === "Admin") {

            user = await adminService.show(verifiedToken.id);

            if (!user) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
                    code: 403
                });
            } 

        } else {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: "Unauthorized!",
                code: 403
            });
        }

        req.user = user;

        next();

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