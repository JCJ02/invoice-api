import { clientType, invoiceType } from "../types/ClientTypes";
import prisma from "../utils/prismaClient";

class ClientRepository {
    // CREATE CLIENT METHOD
    async create(data: clientType) {
        const newClient = await prisma.$transaction(async (prisma) => {
            return await prisma.client.create({
                data: {
                firstname: data.firstname,
                lastname: data.lastname,
                companyName: data.companyName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                businessPhone: data.businessPhone,
                mobilePhone: data.mobilePhone,
                address: data.address,
                },
            });
        });

        return newClient;
    }

    // SHOW METHOD
    async show(id: number) {
        const client = await prisma.client.findFirst({
            where: {
                id: id,
                deletedAt: null,
            },
        });

        return client;
    }

    // GET CLIENT BY ID METHOD
    async get(id: number, invoiceNumber: string) {
        const client = await prisma.client.findFirst({
            where: {
                id: id,
                deletedAt: null,
            },
            select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
                companyName: true,
                phoneNumber: true,
                businessPhone: true,
                mobilePhone: true,
                address: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                invoices: {
                    where: {
                        invoiceNumber: invoiceNumber,
                        deletedAt: null,
                        isDraft: false,
                    },
                },
            },
        });

        return client;
    }

    // RETRIEVE INVOICE ID METHOD
    async retrieve(id: number) {
        const invoice = await prisma.invoices.findFirst({
            where: {
                id: id,
                deletedAt: null,
            },
            select: {
                id: true,
                invoiceNumber: true,
                clientId: true,
                description: true,
                rate: true,
                quantity: true,
                lineTotal: true,
                issuedDate: true,
                dueDate: true,
                totalOutstanding: true,
                notes: true,
                terms: true,
                isDraft: true,
                isRecurring: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
        });

        return invoice;
    }

    // VALIDATE INVOICE NUMBER METHOD
    async validateInvoiceNumber() {
        const isInvoiceNumberExist = await prisma.invoices.findFirst({
            where: {
                deletedAt: null,
            },
            orderBy: {
                invoiceNumber: "desc",
            },
        });

        return isInvoiceNumberExist;
    }

    // GET ALL LINE TOTAL
    async getAllLineTotal(clientId: number, invoiceNumber: string, isDraft?: boolean) {
        const invoices = await prisma.invoices.findMany({
            where: {
                clientId: clientId,
                invoiceNumber: invoiceNumber,
                deletedAt: null,
                ...(typeof isDraft === "boolean" && { isDraft }),
            },
            select: {
                invoiceNumber: true,
                lineTotal: true,
                isDraft: true,
            },
        });

        return invoices;
    }

    // CLIENT and INVOICE LIST w/ SEARCH AND PAGINATION
    async list(query: string, skip: number, limit: number) {
        const parsedDate = !isNaN(Date.parse(query)) ? new Date(query) : undefined;
        const parsedNumber = !isNaN(Number(query)) ? Number(query) : undefined;

        const invoiceFilters = [];

        if (parsedDate) {
            invoiceFilters.push({ issuedDate: { equals: parsedDate } });
            invoiceFilters.push({ dueDate: { equals: parsedDate } });
            invoiceFilters.push({ createdAt: { equals: parsedDate } });
            invoiceFilters.push({ updatedAt: { equals: parsedDate } });
        }

        if (parsedNumber !== undefined) {
            invoiceFilters.push({ id: { equals: parsedNumber } });
            invoiceFilters.push({ clientId: { equals: parsedNumber } });
            invoiceFilters.push({ rate: { equals: parsedNumber } });
            invoiceFilters.push({ quantity: { equals: parsedNumber } });
            invoiceFilters.push({ lineTotal: { equals: parsedNumber } });
            invoiceFilters.push({ totalOutstanding: { equals: parsedNumber } });
        }

        const clients = await prisma.client.findMany({
        skip: skip,
        take: limit,
        where: {
            deletedAt: null,
            OR: [
            {
                invoices: {
                some: {
                    AND: [
                    { deletedAt: null },
                    {
                        OR: [
                        {
                            invoiceNumber: { contains: query, mode: "insensitive" },
                        },
                        { description: { contains: query, mode: "insensitive" } },
                        ...invoiceFilters,
                        ],
                    },
                    ],
                },
                },
            },
            {
                invoices: {
                none: {
                    deletedAt: null,
                },
                },
            },
            ],
        },
        include: {
            invoices: {
            where: {
                deletedAt: null,
                OR: [
                { invoiceNumber: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                ...invoiceFilters,
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        });

        const totalClients = await prisma.client.count({
        where: {
            deletedAt: null,
            invoices: {
            some: {
                AND: [
                { deletedAt: null },
                {
                    OR: [
                    { invoiceNumber: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    ...invoiceFilters,
                    ],
                },
                ],
            },
            },
        },
        });

        return { clients, totalClients };
    }

    // UPDATE CLIENT METHOD
    async update(id: number, data: clientType) {
        const updateClient = await prisma.client.update({
        where: {
            id: id,
            deletedAt: null,
        },
        data: {
            firstname: data.firstname,
            lastname: data.lastname,
            companyName: data.companyName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            businessPhone: data.businessPhone,
            mobilePhone: data.mobilePhone,
            address: data.address,
        },
        });

        return updateClient;
    }

    // DELETE CLIENT METHOD
    async delete(id: number) {
        const deleteClient = await prisma.client.update({
        where: {
            id: id,
            deletedAt: null,
        },
        data: {
            deletedAt: new Date(),
            invoices: {
            updateMany: {
                where: {
                clientId: id,
                deletedAt: null,
                },
                data: {
                deletedAt: new Date(),
                },
            },
            },
        },
        });

        return deleteClient;
    }

    // CREATE INVOICES METHOD
    async createMany(clientId: number, data: any[]) {
        const invoiceData = data.map((invoice) => ({
            ...invoice,
            clientId: clientId,
        }));

        const createManyInvoices = await prisma.invoices.createMany({
            data: invoiceData,
            skipDuplicates: true,
        });

        return createManyInvoices;
    }

    // DRAFT MANY INVOICES METHOD
    async draftMany(clientId: number, data: any[]) {
        const invoiceData = data.map((invoice) => ({
            ...invoice,
            clientId: clientId,
            isDraft: true,
        }));

        const createManyInvoices = await prisma.invoices.createMany({
            data: invoiceData,
            skipDuplicates: true,
        });

        return createManyInvoices;
    }

    // UPDATE MANY INOICES METHOD
    // async updateMany(clientId: number, invoiceNumber: string, data: any[]) {
    //     const updatedInvoices = await Promise.all(
    //         data.map((invoice) =>
    //             prisma.invoices.updateMany({
    //                 where: {
    //                     invoiceNumber: invoiceNumber,
    //                     clientId: clientId,
    //                     deletedAt: null
    //                 },
    //                 data: {
    //                     description: invoice.description,
    //                     rate: invoice.rate,
    //                     quantity: invoice.quantity,
    //                     lineTotal: invoice.lineTotal,
    //                     dueDate: invoice.dueDate,
    //                     totalOutstanding: invoice.totalOutstanding,
    //                     notes: invoice.notes,
    //                     terms: invoice.terms,
    //                     isRecurring: invoice.isRecurring
    //                 },
    //             })
    //         )
    //     );
    
    //     return updatedInvoices;
    // } 

    // UPDATE MANY INOICES METHOD
    async updateMany(clientId: number, invoiceNumber: string, data: any[]) {
        // FIRST VERIFY ALL INVOICES BELONG TO THIS CLIENT AND INVOICE NUMBER
        const existingInvoices = await prisma.invoices.findMany({
            where: {
                clientId: clientId,
                invoiceNumber: invoiceNumber,
                deletedAt: null,
                id: {
                    in: data.map(invoice => invoice.id)
                }
            }
        });
    
        if (existingInvoices.length !== data.length) {
            throw new Error('Some Invoices not found or don\'t belong to this Client');
        }
    
        // THEN UPDATE EACH INVOICE INDIVIDUALLY
        const updatedInvoices = await Promise.all(
            data.map(invoice => 
                prisma.invoices.update({
                    where: { id: invoice.id },
                    data: {
                        description: invoice.description,
                        rate: invoice.rate,
                        quantity: invoice.quantity,
                        lineTotal: invoice.lineTotal,
                        dueDate: invoice.dueDate,
                        totalOutstanding: invoice.totalOutstanding,
                        notes: invoice.notes,
                        terms: invoice.terms,
                        isRecurring: invoice.isRecurring
                    }
                })
            )
        );
    
        return updatedInvoices;
    }

    // FIND OVER DUE DATE RECURRING INVOICES FUNCTION
    async findOverdueRecurringInvoices() {
        const now = new Date();
        // console.log("Checking for Overdue Invoice/s at:", now);
        const overdueInvoices = await prisma.invoices.findMany({
            where: {
                isRecurring: true,
                dueDate: { lte: now, not: null },
                deletedAt: null,
            },
        });
        // console.log(`Found ${overdueInvoices.length} Overdue Invoice/s.`);
        return overdueInvoices;
    }

    // UPDATE MANY TOTAL OUTSTANDING METHOD
    async updateManyTotalOutstanding(clientId: number, invoiceNumber: string, totalOutstanding: number) {
        const invoices = await prisma.invoices.updateMany({
            where: {
                clientId: clientId,
                invoiceNumber: invoiceNumber,
                deletedAt: null,
                isDraft: false,
            },
            data: {
                totalOutstanding: totalOutstanding,
            },
        });

        return invoices;
    }

    // UPDATE MANY DRAFT TOTAL OUTSTANDING METHOD
    async updateManyDraftTotalOutstanding(
        clientId: number,
        totalOutstanding: number
    ) {
        const invoices = await prisma.invoices.updateMany({
            where: {
                clientId: clientId,
                deletedAt: null,
                isDraft: true,
            },
            data: {
                totalOutstanding: totalOutstanding,
            },
        });

        return invoices;
    }

    // UPDATE INVOICE METHOD
    async updateInvoice(id: number, data: invoiceType) {
        const editInvoice = await prisma.invoices.update({
            where: {
                id: id,
                deletedAt: null,
            },
            data: {
                description: data.description,
                rate: data.rate,
                quantity: data.quantity,
                lineTotal: data.lineTotal,
                dueDate: data.dueDate,
                totalOutstanding: data.totalOutstanding,
                notes: data.notes,
                terms: data.terms,
                isDraft: false,
                isRecurring: data.isRecurring
            },
        });

        return editInvoice;
    }

    // UPDATE DRAFT INVOICE METHOD
    async updateDraftInvoice(id: number, data: invoiceType) {
        const editDraftInvoice = await prisma.invoices.update({
            where: {
                id: id,
                deletedAt: null,
                isDraft: true,
            },
            data: {
                description: data.description,
                rate: data.rate,
                quantity: data.quantity,
                lineTotal: data.lineTotal,
                dueDate: data.dueDate,
                totalOutstanding: data.totalOutstanding,
                notes: data.notes,
                terms: data.terms,
                isDraft: true,
            },
        });

        return editDraftInvoice;
    }

    // DELETE INVOICE METHOD
    async deleteInvoice(id: number, data: invoiceType) {
        const removeInvoice = await prisma.invoices.update({
            where: {
                id: id,
                deletedAt: null,
            },
            data: {
                deletedAt: new Date(),
                totalOutstanding: data.totalOutstanding,
            },
        });

        return removeInvoice;
    }

    // INVOICES LIST w/ SEARCH AND PAGINATION
    async invoiceList(query: string, skip: number, limit: number) {
        const parsedDate = !isNaN(Date.parse(query)) ? new Date(query) : undefined;
        const parsedNumber = !isNaN(Number(query)) ? Number(query) : undefined;

        const invoiceFilters = [];

        if (parsedDate) {
            invoiceFilters.push({ issuedDate: { equals: parsedDate } });
            invoiceFilters.push({ dueDate: { equals: parsedDate } });
        }

        if (parsedNumber !== undefined) {
            invoiceFilters.push({ totalOutstanding: { equals: parsedNumber } });
        }

        const invoices = await prisma.invoices.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: null,
                OR: [
                { invoiceNumber: { contains: query, mode: "insensitive" } },
                { description: { contains: query, mode: "insensitive" } },
                ...invoiceFilters,
                ],
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const totalInvoices = await prisma.invoices.count({
            where: {
                deletedAt: null,
                OR: [
                    { invoiceNumber: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    ...invoiceFilters,
                ],
            },
        });

        return {
            invoices,
            totalInvoices,
        };
    }

    // SUM TOTAL OUTSTANDING FUNCTION
    async sumTotalOutstanding(): Promise<number> {
        const result = await prisma.invoices.aggregate({
            _sum: {
                lineTotal: true,
            },
            where: {
                deletedAt: null,
                isDraft: false,
            },
        });

        return result._sum.lineTotal?.toNumber() || 0;
    }

    // SUM TOTAL OUTSTANDING FUNCTION
    async sumDraftTotalOutstanding(): Promise<number> {
        const result = await prisma.invoices.aggregate({
            _sum: {
                lineTotal: true,
            },
            where: {
                deletedAt: null,
                isDraft: true,
            },
        });

        return result._sum.lineTotal?.toNumber() || 0;
    }

    // SUM DUE DATE TOTAL OUTSTANDING FUNCTION
    async sumDueDateTotalOutstanding(): Promise<number> {
        const result = await prisma.invoices.aggregate({
            _sum: {
                lineTotal: true,
            },
            where: {
                deletedAt: null,
                isDraft: false,
                dueDate: {
                lte: new Date(),
                },
            },
        });

        return result._sum.lineTotal?.toNumber() || 0;
    }
}

export default ClientRepository;
