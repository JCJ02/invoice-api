import { Request, Response } from "express";
import ClientService from "../services/ClientService";
import AppResponse from "../utils/AppResponse";
import { createClientSchema, updateClientSchema } from "../utils/validations/ClientSchema";
import { createInvoicesArraySchema, updateInvoiceSchema } from "../utils/validations/InvoiceSchema";

class ClientController {

    private clientService;

    constructor() {

        this.clientService = new ClientService();

        this.create = this.create.bind(this);
        this.createMany = this.createMany.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
        this.list = this.list.bind(this);
        this.updateInvoice = this.updateInvoice.bind(this);
        this.deleteInvoice = this.deleteInvoice.bind(this);
        this.get = this.get.bind(this);
        this.getInvoice = this.getInvoice.bind(this);
        this.invoiceList = this.invoiceList.bind(this);

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

            const isClientExist = await this.clientService.get(clientId);

            if (!isClientExist) {
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

                // const areInvoicesValid = await this.clientService.createMany(validation.data);

                const areInvoicesValid = await this.clientService.createMany(id, validation.data);

                if (!areInvoicesValid) {
                    return AppResponse.sendErrors({
                        res,
                        data: null,
                        message: "Invalid Inputs!",
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

}

export default ClientController;