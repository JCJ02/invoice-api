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
    async deleteInvoice(id: number) {

        const removeInvoice = await prisma.invoices.update({
            where: {
                id: id,
                deletedAt: null
            },
            data: {
                deletedAt: new Date()
            }
        });

        return removeInvoice;

    }

    // INVOICE LIST w/ SEARCH AND PAGINATION
    async invoiceList(query: string, skip: number, limit: number) {

        // const parsedDate = !isNaN(Date.parse(query)) ? new Date(query) : undefined;
        // const parsedNumber = !isNaN(Number(query)) ? Number(query) : undefined;
        
        const clients = await prisma.client.findMany({
            skip: skip,
            take: limit,
            where: {
                deletedAt: null,
                OR: [   
                   {
                        companyName: {
                            contains: query,
                            mode: "insensitive"
                        }
                   },
                   {
                        invoices: {
                            some: {
                                invoiceNumber: {
                                    contains: query,
                                    mode: "insensitive"
                                },
                                // description: {
                                //     contains: query,
                                //     mode: "insensitive"
                                // },
                                // issuedDate: isNaN(Date.parse(query)) ? undefined : {
                                //     equals: new Date(query)
                                // },
                                // dueDate: isNaN(Date.parse(query)) ? undefined : {
                                //     equals: new Date(query)
                                // },
                                // totalOutstanding: isNaN(Number(query)) ? undefined : {
                                //     equals: Number(query)
                                // }
                                // description: {
                                //     contains: query,
                                //     mode: "insensitive"
                                // },
                                // ...(parsedDate && {
                                //     issuedDate: {
                                //         gte: new Date(parsedDate.setHours(0, 0, 0)),
                                //         lt: new Date(parsedDate.setHours(23, 59, 59))
                                //     },
                                //     dueDate: {
                                //         gte: new Date(parsedDate.setHours(0, 0, 0)),
                                //         lt: new Date(parsedDate.setHours(23, 59, 59))
                                //     }
                                // }),
                                // ...(parsedNumber && {
                                //     totalOutstanding: {
                                //         equals: parsedNumber
                                //     }
                                // })
                            },
                        }
                   }
                ]
            },
            include: {
                invoices: {
                    where: {
                        deletedAt: null
                    },
                    select: {
                        invoiceNumber: true,
                        description: true,
                        issuedDate: true,
                        dueDate: true,
                        totalOutstanding: true
                    }
                }
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
                        companyName: {
                            contains: query,
                            mode: "insensitive"
                        }
                    },
                    {
                        invoices: {
                            some: {
                                invoiceNumber: {
                                    contains: query,
                                    mode: "insensitive"
                                },
                                // description: {
                                //     contains: query,
                                //     mode: "insensitive"
                                // },
                                // issuedDate: isNaN(Date.parse(query)) ? undefined : {
                                //     equals: new Date(query)
                                // },
                                // dueDate: isNaN(Date.parse(query)) ? undefined : {
                                //     equals: new Date(query)
                                // },
                                // totalOutstanding: isNaN(Number(query)) ? undefined : {
                                //     equals: Number(query)
                                // }
                                // description: {
                                //     contains: query,
                                //     mode: "insensitive"
                                // },
                                // ...(parsedDate && {
                                //     issuedDate: {
                                //         gte: new Date(parsedDate.setHours(0, 0, 0)),
                                //         lt: new Date(parsedDate.setHours(23, 59, 59))
                                //     },
                                //     dueDate: {
                                //         gte: new Date(parsedDate.setHours(0, 0, 0)),
                                //         lt: new Date(parsedDate.setHours(23, 59, 59))
                                //     }
                                // }),
                                // ...(parsedNumber && {
                                //     totalOutstanding: {
                                //         equals: parsedNumber
                                //     }
                                // })
                            }
                        }
                   }
                ]
            },
        });

        return {
            clients,
            totalClients,
        };

    }

}

export default ClientRepo;