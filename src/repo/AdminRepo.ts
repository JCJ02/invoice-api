import { adminAccountType } from "../types/AdminType";
import prisma from "../utils/client";

class AdminRepo {

    // CREATE ADMIN METHOD
    async create(data: adminAccountType, prismaTransaction: any) {

        const newAdmin = prismaTransaction.admin.create({
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                account: {
                    create: {
                        password: data.password
                    }
                }
            }
        });

        return newAdmin;

    }

    // SHOW METHOD
    async show(id: number) {

        const admin = prisma.admin.findFirst({
            where: {
                id: id,
                deletedAt: null
            }
        });

        return admin;

    }

    // VALIDATE EMAIL ADDRESS METHOD
    async validateEmail(email: string) {

        const isEmailExist = prisma.admin.findFirst({
            where: {
                email: email
            }
        });

        return isEmailExist;

    }

    // AUTHENTICATE OR LOG IN ADMIN METHOD
    async authenticate(data: { email: string }) {

        const admin = await prisma.admin.findFirst({
            where: {
                email: data.email,
                deletedAt: null
            },
            include: {
                account: true
            }
        });
        // console.log(`Admin Data: ${JSON.stringify(admin, null, 2)}`);
        return admin;

    }

}

export default AdminRepo;