import { Request, Response } from "express";
import ClientService from "../services/ClientService";
import AppResponse from "../utils/appResponse";
import { createClientSchema, updateClientSchema } from "../utils/validations/ClientSchema";
import { createInvoicesArraySchema, updateInvoicesArraySchema, updateInvoiceSchema } from "../utils/validations/InvoiceSchema";

class ClientController {

    private clientService;

    constructor() {

        this.clientService = new ClientService();

        this.create = this.create.bind(this);
        this.createMany = this.createMany.bind(this);
        this.draftMany = this.draftMany.bind(this);
        this.updateMany = this.updateMany.bind(this);
        this.generateRecurringInvoices = this.generateRecurringInvoices.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.list = this.list.bind(this);
        this.updateInvoice = this.updateInvoice.bind(this);
        this.updateDrafttInvoice = this.updateDrafttInvoice.bind(this);
        this.deleteInvoice = this.deleteInvoice.bind(this);
        this.get = this.get.bind(this);
        this.getInvoice = this.getInvoice.bind(this);
        this.invoiceList = this.invoiceList.bind(this);
        this.sumTotalOutstanding = this.sumTotalOutstanding.bind(this);
        this.sumDraftTotalOutstanding = this.sumDraftTotalOutstanding.bind(this);
        this.sumDueDateTotalOutstanding = this.sumDueDateTotalOutstanding.bind(this);

    }

    // CREATE CLIENT METHOD
    async create(req: Request, res: Response) {

        try {

            const validateClientData = createClientSchema.safeParse(req.body);

            if (validateClientData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateClientData.error.errors[0].message,
                    code: 403
                });
            } else {

                const isClientDataValid = await this.clientService.create(validateClientData.data);

                if (!isClientDataValid) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Invalid Credentials!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: isClientDataValid,
                        message: "Successfully Created!",
                        code: 201
                    });
                }

            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // CLIENT and INVOICE LIST w/ SEARCH AND PAGINATION
    async list(req: Request, res: Response) {

        try {

            const searchResults = await this.clientService.list(req);

            return AppResponse.sendSuccessful({
                res,
                data: searchResults,
                message: "Result!",
                code: 200
            });

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // UPDATE CLIENT METHOD
    async update(req: Request, res: Response) {

        try {

            const clientId = Number(req.params.id);

            const validateClientData = updateClientSchema.safeParse(req.body);

            if (validateClientData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateClientData.error.errors[0].message,
                    code: 403
                });
            } else {

                const isClientUpdated = await this.clientService.update(clientId, validateClientData.data);

                if (!isClientUpdated) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Update!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: isClientUpdated,
                        message: "Successfully Updated!",
                        code: 201
                    });
                }

            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // DELETE CLIENT METHOD
    async delete(req: Request, res: Response) {

        try {

            const clientId = Number(req.params.id);

            const isClientDeleted = await this.clientService.delete(clientId);

            if (!isClientDeleted) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Failed To Delete!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: null,
                    message: "Successfully Deleted!",
                    code: 200
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // GET CLIENT METHOD
    async get(req: Request, res: Response) {

        try {

            const clientId = Number(req.params.id);
            const invoiceNumber = req.query.invoiceNumber as string;

            const isClientExist = await this.clientService.get(clientId, invoiceNumber);

            if (!isClientExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Failed to Retrieve!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: {
                        client: isClientExist
                    },
                    message: "Successfully Retrived!",
                    code: 200
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // CREATE INVOICES METHOD
    async createMany(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            const validation = createInvoicesArraySchema.safeParse(req.body.invoices);

            if (validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 403
                });
            } else {

                const areInvoicesValid = await this.clientService.createMany(id, validation.data);

                if (!areInvoicesValid) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed to Create!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: {
                            invoices: areInvoicesValid
                        },
                        message: "Successfully Created!",
                        code: 201
                    });
                }

            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    // DRAFT MANY INVOICES METHOD
    async draftMany(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);

            const validation = createInvoicesArraySchema.safeParse(req.body.invoices);

            if (validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 403
                });
            } else {

                const areInvoicesValid = await this.clientService.draftMany(id, validation.data);

                if (!areInvoicesValid) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed to Draft!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: {
                            invoices: areInvoicesValid
                        },
                        message: "Successfully Drafted!",
                        code: 201
                    });
                }

            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    // UPDATE MANY INVOICES FUNCTION
    async updateMany(req: Request, res: Response) {
        try {

            const id = Number(req.params.id);
            const invoiceNumber = req.query.invoiceNumber as string;
            const validation = updateInvoicesArraySchema.safeParse(req.body.invoices);

            if (validation.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validation.error.errors[0].message,
                    code: 403
                });
            } else {

                const areInvoicesValid = await this.clientService.updateMany(id, invoiceNumber, validation.data);

                if (!areInvoicesValid) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed to Update Many Invoices!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: {
                            invoices: areInvoicesValid
                        },
                        message: "Successfully Updated!",
                        code: 201
                    });
                }

            }
            
        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    // GENERATE RECURRING INVOICE/s FUNCTION
    async generateRecurringInvoices(req: Request, res: Response) {
        try {
            const invoice = await this.clientService.generateRecurringInvoices();
            return AppResponse.sendSuccessful({
                res,
                data: invoice,
                message: "Successfully Generated!",
                code: 201
            });
        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    // UPDATE INVOICE METHOD
    async updateInvoice(req: Request, res: Response) {

        try {

            const invoiceId = Number(req.params.id);

            const validateInvoiceData = updateInvoiceSchema.safeParse(req.body);

            if (validateInvoiceData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateInvoiceData.error.errors[0].message,
                    code: 403
                });
            } else {

                const isInvoiceUpdated = await this.clientService.updateInvoice(invoiceId, validateInvoiceData.data);

                if (!isInvoiceUpdated) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Update!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: isInvoiceUpdated,
                        message: "Successfully Updated!",
                        code: 201
                    });
                }

            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // UPDATE INVOICE METHOD
    async updateDrafttInvoice(req: Request, res: Response) {

        try {

            const invoiceId = Number(req.params.id);

            const validateInvoiceData = updateInvoiceSchema.safeParse(req.body);

            if (validateInvoiceData.error) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: validateInvoiceData.error.errors[0].message,
                    code: 403
                });
            } else {

                const isDraftInvoiceUpdated = await this.clientService.updateDraftInvoice(invoiceId, validateInvoiceData.data);

                if (!isDraftInvoiceUpdated) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Failed To Update!",
                        code: 403
                    });
                } else {
                    return AppResponse.sendSuccessful({
                        res,
                        data: isDraftInvoiceUpdated,
                        message: "Successfully Updated!",
                        code: 201
                    });
                }

            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // DELETE INVOICE METHOD
    async deleteInvoice(req: Request, res: Response) {

        try {

            const invoiceId = Number(req.params.id);
            const invoiceData = req.body;

            const isInvoiceDeleted = await this.clientService.deleteInvoice(invoiceId, invoiceData);

            if (!isInvoiceDeleted) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Failed To Delete!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: null,
                    message: "Successfully Deleted!",
                    code: 200
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // GET INVOICE METHOD
    async getInvoice(req: Request, res: Response) {

        try {

            const invoiceId = Number(req.params.id);

            const isInvoiceExist = await this.clientService.getInvoice(invoiceId);

            if (!isInvoiceExist) {
                return AppResponse.sendErrors({
                    res,
                    data: null,
                    message: "Failed To Retrieve!",
                    code: 403
                });
            } else {
                return AppResponse.sendSuccessful({
                    res,
                    data: {
                        invoice: isInvoiceExist
                    },
                    message: "Successfully Retrieved!",
                    code: 200
                });
            }

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // INVOICES LIST w/ SEARCH AND PAGINATION
    async invoiceList(req: Request, res: Response) {

        try {

            const searchResults = await this.clientService.invoiceList(req);

            return AppResponse.sendSuccessful({
                res,
                data: searchResults,
                message: "Result!",
                code: 200
            });

        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }

    }

    // SUM TOTAL OUTSTANDING FUNCTION
    async sumTotalOutstanding(req: Request, res: Response) {
        try {
            const totalOutstanding = await this.clientService.sumTotalOutstanding();
            return AppResponse.sendSuccessful({
                res,
                data: {
                    sum: totalOutstanding
                },
                message: "Result!",
                code: 200
            });
        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    // SUM TOTAL OUTSTANDING FUNCTION
    async sumDraftTotalOutstanding(req: Request, res: Response) {
        try {
            const draftTotalOutstanding = await this.clientService.sumDraftTotalOutstanding();
            return AppResponse.sendSuccessful({
                res,
                data: {
                    sum: draftTotalOutstanding
                },
                message: "Result!",
                code: 200
            });
        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

    // SUM DUE DATE TOTAL OUTSTANDING FUNCTION
    async sumDueDateTotalOutstanding(req: Request, res: Response) {
        try {
            const dueDateTotalOutstanding = await this.clientService.sumDueDateTotalOutstanding();
            return AppResponse.sendSuccessful({
                res,
                data: {
                    sum: dueDateTotalOutstanding
                },
                message: "Result!",
                code: 200
            });
        } catch (error: any) {
            return AppResponse.sendErrors({
                res,
                data: null,
                message: error.message,
                code: 500
            });
        }
    }

}

export default ClientController;