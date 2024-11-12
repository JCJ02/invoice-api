import { z } from "zod";

const createClientSchema = z.object({
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

const createInvoicesSchema = z.object({
    description: z.string({
        invalid_type_error: "Description Must Be String!"
    }).min(3, "Description Must Be At Least 3 Characters Long!")
        .max(255, "Description Must Not Exceed To 255 Characters Long!"),
    rate: z.number().refine((value) => {
        return Math.round(value * 100) === value * 100;
    }, { message: "Rate Must Be DECIMAL and Have No More Than 2 Decimal Places!" }),
    quantity: z.number().refine((value) => {
        return Math.round(value * 100) === value * 100;
    }, { message: "Quantity Must Be DECIMAL and Have No More Than 2 Decimal Places!" }),
    dueDate: z.coerce.date(),
});

const createInvoicesArraySchema = z.array(createInvoicesSchema);

const updateInvoiceSchema = z.object({
    description: z.string({
        invalid_type_error: "Description Must Be String!"
    }).min(3, "Description Must Be At Least 3 Characters Long!")
        .max(255, "Description Must Not Exceed To 255 Characters Long!"),
    rate: z.number().refine((value) => {
        return Math.round(value * 100) === value * 100;
    }, { message: "Rate Must Be DECIMAL and Have No More Than 2 Decimal Places!" }),
    quantity: z.number().refine((value) => {
        return Math.round(value * 100) === value * 100;
    }, { message: "Quantity Must Be DECIMAL and Have No More Than 2 Decimal Places!" }),
    dueDate: z.coerce.date()
});

export {
    createClientSchema,
    createInvoicesSchema,
    createInvoicesArraySchema,
    updateClientSchema,
    updateInvoiceSchema
}