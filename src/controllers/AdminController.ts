import { Request, Response } from "express";
import AdminService from "../services/AdminService";
import AppResponse from "../utils/AppResponse";
import TestService from "../services/TestService";
import { authMiddlewareRequest } from "../types/AuthMiddlewareType";
import { authAdminSchema } from "../utils/validations/AdminSchema";

class AdminController {

    private adminService;
    private testService;

    constructor() {

        this.adminService = new AdminService();
        this.testService = new TestService();

        this.test = this.test.bind(this);
        this.dashboard = this.dashboard.bind(this);
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

    async dashboard(req: authMiddlewareRequest, res: Response) {

        try {

            const admin = req.user;

            if (!admin) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Admin Not Found!",
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

    // CREATE ADMIN METHOD
    async create(req: Request, res: Response) {

        try {
            
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
                        message: "Invalid Log In Credentials!",
                        code: 401
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: result,
                        message: "Log In Successfully!",
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