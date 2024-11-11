import AdminRepo from "../repo/AdminRepo";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token";
import { adminType } from "../types/AdminType";
import prisma from "../utils/client";
import { sendAccountDetails } from "../utils/SendAdminDetails";
import { generatePassword } from "../utils/generatePassword";

class AdminService {

    private adminRepo;

    constructor() {

        this.adminRepo = new AdminRepo();

    }

    // CREATE ADMIN METHOD
    async create(data: adminType) {

        const isEmailExist = await this.adminRepo.validateEmail(data.email);

        if (isEmailExist) {
            return null;
        } else {

            const generatedPassword = await generatePassword(10);
            const hashPassword = bcrypt.hashSync(generatedPassword, 10);

            const adminData = {
                ...data,
                password: hashPassword
            }

            const create = await prisma.$transaction(async (prismaTrasaction) => {

                const newAdmin = await this.adminRepo.create(adminData, prismaTrasaction);

                try {

                    await sendAccountDetails({
                        firstname: data.firstname,
                        lastname: data.lastname,
                        email: data.email,
                        password: generatedPassword,
                        to: data.email,
                        subject: "Your Admin Account Details",
                    });

                } catch (error: any) {
                    console.error("Failed To Send Email, Rolling Back Transaction: ", error);
                    throw new Error("Email Sending Failed; Rolling Back Transaction");
                }

                return newAdmin;

            });

            return create;

        }

    }

    // SHOW METHOD
    async show(id: number) {

        const isIdExist = await this.adminRepo.show(id);

        if (!isIdExist) {
            return null;
        } else {
            return isIdExist;
        }

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