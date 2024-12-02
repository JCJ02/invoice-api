import { z } from "zod";

const createClientSchema = z.object({
    firstname: z.string().min(1, "Firstname Is Required!")
        .max(255, "Firstname Must Not Exceed To 255 Characters"),
    lastname: z.string().min(1, "Lastname Is Required!")
        .max(255, "Lastname Must Not Exceed To 255 Characters"),
    email: z.string().refine(value => value === "" || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value), {
        message: "Must Be A Valid E-mail!",
      }).optional().nullable(),
    companyName: z.string().min(1, "Company Name Is Required!")
        .max(255, "Company Name Must Not Exceed To 255 Characters"),
    phoneNumber: z.string().optional().nullable(),
    businessPhone: z.string().optional().nullable(),
    mobilePhone: z.string().optional().nullable(),
    address: z.string().optional().nullable()
});

const updateClientSchema = z.object({
    firstname: z.string({
        required_error: "Firstname Is Required!",
        invalid_type_error: "Firstname Must Be String!"
    }),
    lastname: z.string({
        required_error: "Lastname Is Required!",
        invalid_type_error: "Lastname Must Be String!"
    }),
    email: z.string().email("Must Be A Valid E-mail!").optional().nullable(),
    companyName: z.string({
        required_error: "Company Name Is Required!",
        invalid_type_error: "Company Name Must Be String!"
    }).min(3, "Company Name Must Be At Least 3 Characters Long!")
        .max(255, "Company Name Must Not Exceed To 255 Characters"),
    phoneNumber: z.string().optional().nullable(),
    businessPhone: z.string().optional().nullable(),
    mobilePhone: z.string().optional().nullable(),
    address: z.string().optional().nullable()
});

export {
    createClientSchema,
    updateClientSchema,
}