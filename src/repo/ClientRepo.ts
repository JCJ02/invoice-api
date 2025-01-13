import { clientType, invoiceType } from "../types/ClientTypes";
import prisma from "../utils/client";

class ClientRepo {

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
                    address: data.address
                }
            });
        });

        return newClient;

    }

    // SHOW METHOD
    async show(id: number) {

        const client = await prisma.client.findFirst({
            where: {
                id: id,
                deletedAt: null
            }
        });

        return client;

    }

    // RETRIEVE INVOICE ID METHOD 
    async retrieve(id: number) {

        const invoice = await prisma.invoices.findFirst({
            where: {
                id: id,
                deletedAt: null
            },
            select: {
                id: true,
                clientId: true
            }
        });

        return invoice;

    }

    // VALIDATE INVOICE NUMBER METHOD
    async validateInvoiceNumber() {

        const isInvoiceNumberExist = await prisma.invoices.findFirst({
            where: {
                deletedAt: null
            },
            orderBy: {
                invoiceNumber: 'desc'
            }
        });

        return isInvoiceNumberExist;

    }

    async getAllLineTotal(clientId: number) {
        const invoices = await prisma.invoices.findMany({
            where: {
                clientId: clientId,
                deletedAt: null
            },
            select: {
                lineTotal: true
            }
        });
    
        return invoices;
    }

    // CREATE INVOICES METHOD
    async createMany(id: number, data: any[]) {

        const invoiceData = data.map((invoice) => ({
            ...invoice,
            clientId: id
        }));

        const createManyInvoices = await prisma.invoices.createMany({
            data: invoiceData,
            skipDuplicates: true,
        });

        return createManyInvoices;

    }

    // UPDATE MANY INVOICES METHOD
    async updateMany(clientId: number, totalOutstanding: number) {
        const invoices = await prisma.invoices.updateMany({
            where: {
                clientId: clientId,
                deletedAt: null
            },
            data: {
                totalOutstanding: totalOutstanding
            }
        });

        return invoices;
    }

    // UPDATE CLIENT METHOD
    async update(id: number, data: clientType) {

        const updateClient = await prisma.client.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                firstname: data.firstname,
                lastname: data.lastname,
                companyName: data.companyName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                businessPhone: data.businessPhone,
                mobilePhone: data.mobilePhone,
                address: data.address
            }
        });

        return updateClient;

    }

    // DELETE CLIENT METHOD
    async delete(id: number) {

        const deleteClient = await prisma.client.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date(),
                invoices: {
                    updateMany: {
                        where: {
                            clientId: id,
                            deletedAt: null
                        },
                        data: {
                            deletedAt: new Date()
                        }
                    }
                }
            }
        });

        return deleteClient;

    }

    // CLIENT LIST w/ SEARCH AND PAGINATION
    async list(query: string, skip: number, limit: number) {

        const clients = await prisma.client.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: null,
                OR: [
                    {
                        firstname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        companyName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        phoneNumber: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        businessPhone: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        mobilePhone: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        address: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalClients = await prisma.client.count({
            where: {
                deletedAt: null,
                OR: [
                    {
                        firstname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        lastname: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        companyName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        phoneNumber: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        businessPhone: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        mobilePhone: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        address: {
                            contains: query,
                            mode: "insensitive"
                        }
                    }
                ]
            }
        });

        return {
            clients,
            totalClients,
        };

    }

    // UPDATE INVOICE METHOD
    async updateInvoice(id: number, data: invoiceType) {

        const editInvoice = await prisma.invoices.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                description: data.description,
                rate: data.rate,
                quantity: data.quantity,
                lineTotal: data.lineTotal,
                dueDate: data.dueDate,
                totalOutstanding: data.totalOutstanding
            }
        });

        return editInvoice;

    }

    // DELETE INVOICE METHOD
    async deleteInvoice(id: number, data: invoiceType) {

        const removeInvoice = await prisma.invoices.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date(),
                totalOutstanding: data.totalOutstanding
            }
        });

        return removeInvoice;

    }

    // INVOICE LIST w/ SEARCH AND PAGINATION
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

        const clients = await prisma.client.findMany({
            skip,
            take: limit,
            where: {
                deletedAt: null,
                invoices: {
                    some: {
                        deletedAt: null,
                        OR: [
                            { invoiceNumber: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } },
                            ...invoiceFilters
                        ]
                    }
                },
                OR: [
                    {
                        deletedAt: null,
                        companyName: { contains: query, mode: "insensitive" }
                    },
                    {
                        invoices: {
                            some: {
                                deletedAt: null,
                                OR: [
                                    { invoiceNumber: { contains: query, mode: "insensitive" } },
                                    { description: { contains: query, mode: "insensitive" } },
                                    ...invoiceFilters
                                ]
                            }
                        }
                    }
                ]
            },
            include: {
                invoices: {
                    where: { 
                        deletedAt: null,
                        OR: [
                            { invoiceNumber: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } },
                            ...invoiceFilters
                        ]
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const totalClients = await prisma.client.count({
            where: {
                deletedAt: null,
                invoices: {
                    some: {
                        deletedAt: null,
                        OR: [
                            { invoiceNumber: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } },
                            ...invoiceFilters
                        ]
                    }
                }
            }
        });

        return { clients, totalClients };
    }


}

export default ClientRepo;