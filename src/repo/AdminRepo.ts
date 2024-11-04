import prisma from "../utils/client";

class AdminRepo {
    // CREATE ADMIN METHOD
    async create() {

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