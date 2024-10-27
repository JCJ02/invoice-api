import AdminRepo from "../repo/AdminRepo";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token";

class AdminService {

    private adminRepo;

    constructor() {

        this.adminRepo = new AdminRepo();

    }

    // CREATE ADMIN METHOD
    async createAdmin() {

    }

    // SHOW METHOD
    async show(id: number) {

        return await this.adminRepo.show(id);

    }

    // AUTHENTICATE OR LOG IN ADMIN METHOD
    async authenticate(data: { email: string, password: string }) {

        const admin = await this.adminRepo.authenticate(data);
        // console.log(`Admin: ${admin}`);
        if (!admin) {
            return null;
        }

        const isPasswordValid = bcrypt.compareSync(data.password, admin.account[0].password);
        // console.log(`Is Password Valid? ${isPasswordValid}`);
        if (!isPasswordValid) {
            return null;
        }

        const token = generateToken({
            id: admin.id,
            role: admin.role
        });
        // console.log(`Admin ID: ${admin.id}, Admin Role: ${admin.role}`);

        return token;

    }

}

export default AdminService;