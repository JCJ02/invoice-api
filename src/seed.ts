import prisma from "./utils/client";
import bcrypt from "bcryptjs";

async function create() {

    const hashPassword = bcrypt.hashSync("@jacobe123", 10);

    await prisma.$transaction(async (prisma) => {
        await prisma.admin.create({
            data: {
                firstname: "John Carlo",
                lastname: "Jacobe",
                email: "jacobe.johncarlo.02022003@gmail.com",
                account: {
                    create: {
                        password: hashPassword
                    }
                }
            }
        })
    });

    console.log("Successfully Registered!");

}

create()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(`Error In Admin User Creation: ${error}`);
        await prisma.$disconnect();
        process.exit(1);
    });
