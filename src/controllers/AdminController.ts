import { Request, Response } from "express";
import AdminService from "../services/AdminService";
import AppResponse from "../utils/appResponse";
import TestService from "../services/TestService";
import { authMiddlewareRequest } from "../types/AuthMiddlewareType";
import { authAdminSchema, createAdminSchema } from "../utils/validations/AdminSchema";
import { generateToken, verifyRefreshToken } from "../utils/token";
import { JwtPayload } from "jsonwebtoken";

class AdminController {

    private adminService;
    private testService;

    constructor() {

        this.adminService = new AdminService();
        this.testService = new TestService();

        this.test = this.test.bind(this);
        this.accessToken = this.accessToken.bind(this);
        this.create = this.create.bind(this);
        this.authenticate = this.authenticate.bind(this);

    }

    // TEST API
    async test(req: Request, res: Response) {
        try {

            const data = await this.testService.index(req.body);

            if (!data) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "API Testing Failed!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: data,
                    message: "API Testing Successfully!",
                    code: 200
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    // VERIFY ACCESS TOKEN FUNCTION
    async accessToken(req: authMiddlewareRequest, res: Response) {

        try {

            const admin = req.user;

            if (!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin not Found!",
                    code: 403
                });
            } else {
                return AppResponse.sendErrors({
                    res,
                    data: {
                        id: admin.id,
                        firstname: admin.firstname,
                        lastname: admin.lastname,
                        email: admin.email,
                        role: admin.role
                    },
                    message: "Admin Found!",
                    code: 200
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }
    
    // CREATE REFRESH TOKEN FUNCTION
    async refreshToken(req: Request, res: Response) {
        try {
            // 1. EXTRACT REFRESH TOKEN
            const authHeader = req.headers.authorization;
            
            if (!authHeader?.startsWith('Bearer ')) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Authorization Header with Bearer Token Required",
                    code: 401
                });
            }

            const refreshToken = authHeader.split(' ')[1].trim();
            
            // 2. VERIFY REFRESH TOKEN
            const decoded = verifyRefreshToken(refreshToken);

            // 3. FETCH ADMIN FROM DATABASE USING ID FROM REFRESH TOKEN
            const adminService = new AdminService();
            const admin = await adminService.show(decoded.id);
            
            if (!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin not Found",
                    code: 404
                });
            }

            // 4. GENERATE NEW ACCESS TOKEN
            const newAccessToken = generateToken({
                id: admin.id,
                firstname: admin.firstname,
                lastname: admin.lastname,
                email: admin.email,
                role: admin.role
            });

            // 5. RETURN SUCCESS RESPONSE
            return AppResponse.sendSuccessful({
                res,
                data: { accessToken: newAccessToken },
                message: "Access Token Refreshed",
                code: 200
            });

        } catch (error: any) {
            // HANDLE SPECIFIC JWT ERRORS
            const message = error.message === "Invalid Token" ? "Invalid Refresh Token" 
                        : error.message === "Token Expired" ? "Refresh Token Expired"
                        : "Token Refresh Failed";
            
            const code = error.message === "Invalid Token" ? 401 
                    : error.message === "Token Expired" ? 401 
                    : 500;

            return AppResponse.sendErrors({
                res,
                data: null,
                message,
                code
            });
        }
    }

    // CREATE ADMIN ACCOUNT FUNCTION
    async create(req: Request, res: Response) {

        try {

            const validation = createAdminSchema.safeParse(req.body);

            if (validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 500
                });
            } else {

                const createAdmin = await this.adminService.create(validation.data);

                if (!createAdmin) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "E-mail Already Exist!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: createAdmin,
                        message: "Successfully Created!",
                        code: 201
                    });
                }

            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // AUTHENTICATE OR LOG IN ADMIN METHOD
    async authenticate(req: Request, res: Response) {

        try {

            const validateAdminCredential = authAdminSchema.safeParse(req.body);

            if (validateAdminCredential.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateAdminCredential.error.errors[0].message,
                    code: 400
                });
            } else {

                const result = await this.adminService.authenticate(validateAdminCredential.data);
                // console.log(`Authentication Result: ${result}`);
                if (!result) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Invalid Login Credentials!",
                        code: 401
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: result,
                        message: "Logged In Successfully!",
                        code: 200
                    });
                }

            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }


}

export default AdminController;