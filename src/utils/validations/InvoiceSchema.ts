import { z } from "zod";

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
    createInvoicesSchema,
    createInvoicesArraySchema,
    updateInvoiceSchema
}