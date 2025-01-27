import { Request } from "express";
import ClientRepo from "../repo/ClientRepo";
import { clientType, invoiceType } from "../types/ClientTypes";

class ClientService {

    private clientRepo;

    constructor() {

        this.clientRepo = new ClientRepo();

    }

    // CREATE CLIENT METHOD
    async create(data: clientType) {

        const clientData = {
            ...data
        }

        const createClient = await this.clientRepo.create(clientData);

        return createClient;

    }

    // SHOW METHOD
    async show(id: number) {

        const isClientExist = await this.clientRepo.show(id);

        if (!isClientExist) {
            return null;
        } else {
            return isClientExist;
        }

    }

    // RETRIEVE INVOICE ID METHOD 
    async retrieve(id: number) {

        const isInvoiceExist = await this.clientRepo.retrieve(id);

        if (!isInvoiceExist) {
            return null;
        } else {
            return isInvoiceExist;
        }

    }

    // CLIENT and INVOICE LIST w/ SEARCH AND PAGINATION
    async list(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchResults = await this.clientRepo.list(query, skip, limit);

        return searchResults;

    }

    // UPDATE CLIENT METHOD
    async update(id: number, data: clientType) {

        const client = await this.clientRepo.show(id);

        if (!client) {
            return null;
        } else {

            const clientData = {
                ...data
            }

            const updateClient = await this.clientRepo.update(client.id, clientData);

            return updateClient;

        }

    }

    // DELETE CLIENT METHOD
    async delete(id: number) {

        const client = await this.clientRepo.show(id);

        if (!client) {
            return null;
        } else {

            const deleteClient = await this.clientRepo.delete(client.id);

            return deleteClient;
        }

    }

    // GET CLIENT METHOD
    async get(id: number) {

        const client = await this.clientRepo.get(id);

        if (!client) {
            return null;
        } else {
            return client;
        }

    }

    // CREATE INVOICES METHOD
    async createMany(id: number, data: any[]) {

        const clientId = await this.clientRepo.show(id);

        if (!clientId) {
            return null;
        }

        // STEP 1: GET ALL LINE TOTAL OF SELECTED CLIENT IF THERE IS
        const clientInvoices = await this.clientRepo.getAllLineTotal(id);
        const existingTotalOutstanding = clientInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);

        const lastInvoiceNumber = await this.clientRepo.validateInvoiceNumber();
        // console.log(`Last Invoice Number: ${lastInvoiceNumber}`);
        let baseInvoiceNumber: string;
        const currentYear = new Date().getFullYear().toString().slice(-2);

        if(clientInvoices.length > 0) {
            const lastClientInvoice = clientInvoices[clientInvoices.length - 1];
            baseInvoiceNumber = lastClientInvoice.invoiceNumber;
        } else {
            if (lastInvoiceNumber) {
                const lastNumber = parseInt(lastInvoiceNumber.invoiceNumber.split("-")[2], 10) + 1;
                baseInvoiceNumber = `LWS-${currentYear}-${lastNumber.toString().padStart(4, "0")}`;
            } else {
                baseInvoiceNumber = `LWS-${currentYear}-0001`;
            }
        }

        // STEP 2: CALCULATE LINE TOTAL FOR EACH INVOICR AND TOTAL OUTSTANDING
        const createInvoices = data.map((invoice: any) => {
            // CALCULATE LINE TOTAL = RATE * QUANTITY
            const lineTotal = Number(invoice.rate || 0) * Number(invoice.quantity || 0);
            return {
                ...invoice,
                lineTotal: lineTotal,
            };
        });

        // STEP 3: CALCULATE TOTAL OUTSTANDING BASED ON EXISTING INVOICES AND NEW INVOICES (SUM OF ALL LINE TOTAL VALUES)
        const newTotalOutstanding = createInvoices.reduce((sum: number, invoice: any) => {
            return sum + Number(invoice.lineTotal || 0);
        }, 0);
        
        const totalOutstanding = existingTotalOutstanding + newTotalOutstanding;

        // STEP 4: UPDATE ALL THE TOTAL OUTSTANDING
        await this.clientRepo.updateMany(id, totalOutstanding);

        // STEP 5: SAVE THE INVOICES WITH THE CALCULATED LINE TOTAL AND TOTAL OUTSTANDING
        if (createInvoices && createInvoices.length > 0) {
            return await this.clientRepo.createMany(clientId.id, createInvoices.map((invoice: any) => ({
                ...invoice,
                invoiceNumber: baseInvoiceNumber,
                totalOutstanding: totalOutstanding,
            })));
        }

        return {
            clientId,
            totalOutstanding,
            invoices: createInvoices
        }
    }

    // CREATE INVOICES METHOD
    // async createMany(id: number, data: any[]) {
    //     const clientId = await this.clientRepo.show(id);

    //     if (!clientId) {
    //         return null;
    //     }

    //     // STEP 1: CHECK IF CLIENT HAS EXISTING INVOICES
    //     const clientInvoices = await this.clientRepo.getAllLineTotal(id); // FETCH ALL INVOICES FOR THE CLIENT
    //     const existingTotalOutstanding = clientInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);

    //     // DETERMINE THE BASE INVOICE NUMBER
    //     let baseInvoiceNumber: string;
    //     const currentYear = new Date().getFullYear().toString().slice(-2);

    //     if (clientInvoices.length > 0) {
    //         // CLIENT HAS EXISTING INVOICES: USE THE LATEST INVOICE NUMBER
    //         const lastClientInvoice = clientInvoices[clientInvoices.length - 1];
    //         baseInvoiceNumber = lastClientInvoice.invoiceNumber || '';
    //     } else {
    //         // NO INVOICES FOR THE CLIENT, CHECK GLOBAL LAST INVOICE
    //         const globalLastInvoice = await this.clientRepo.validateInvoiceNumber();
    //         if (globalLastInvoice) {
    //             const lastGlobalInvoiceNumber = parseInt(globalLastInvoice.invoiceNumber.split("-")[2], 10) + 1;
    //             baseInvoiceNumber = `LWS-${currentYear}-${lastGlobalInvoiceNumber.toString().padStart(4, "0")}`;
    //         } else {
    //             // NO INVOICE AT ALL: START FROM LWS<CURRENT YEAR>-0001
    //             baseInvoiceNumber = `LWS-${currentYear}-0001`;
    //         }
    //     }

    //     // STEP 2: CALCULATE LINE TOTAL FOR EACH INVOICE
    //     const createInvoices = data.map((invoice: any, index: number) => {
    //         const lineTotal = Number(invoice.rate || 0) * Number(invoice.quantity || 0);
    //         const invoiceNumber = `${baseInvoiceNumber.split("-")[0]}-${baseInvoiceNumber.split("-")[1]}-${(parseInt(baseInvoiceNumber.split("-")[2], 10) + index).toString().padStart(4, "0")}`;

    //         return {
    //             ...invoice,
    //             lineTotal,
    //             invoiceNumber,
    //         };
    //     });

    //     // STEP 3: CALCULATE TOTAL OUTSTANDING
    //     const newTotalOutstanding = createInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);
    //     const totalOutstanding = existingTotalOutstanding + newTotalOutstanding;

    //     // STEP 4: UPDATE CLIENT'S TOTAL OUTSTANDING
    //     await this.clientRepo.updateMany(id, totalOutstanding);

    //     // STEP 5: SAVE THE INVOICES
    //     if (createInvoices.length > 0) {
    //         return await this.clientRepo.createMany(clientId.id, createInvoices.map((invoice: any) => ({
    //             ...invoice,
    //             totalOutstanding,
    //         })));
    //     }

    //     return {
    //         clientId,
    //         totalOutstanding,
    //         invoices: createInvoices,
    //     };
    // }



    // UPDATE INVOICE METHOD
    async updateInvoice(id: number, data: invoiceType) {

        const invoice = await this.clientRepo.retrieve(id);

        if (!invoice) {
            return null;
        }

        const clientId = invoice.clientId;

        if(!clientId) {
            return null;
        }

        const existingInvoices = await this.clientRepo.getAllLineTotal(clientId);
        const existingTotalOutstanding = existingInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);

        const lineTotal = (data.rate || 0) * (data.quantity || 0);
        const newTotalOutstanding = existingTotalOutstanding;

        const invoiceData = {
            ...data,
            lineTotal: lineTotal,
            totalOutstanding: newTotalOutstanding
        }

        const editedInvoice = await this.clientRepo.updateInvoice(invoice.id, invoiceData);
        const updatedInvoices = await this.clientRepo.updateMany(clientId, newTotalOutstanding);

        return {
            editedInvoice,
            updatedInvoices
        }

    }

    // DELETE INVOICE METHOD
    async deleteInvoice(id: number, data: invoiceType) {

        const invoice = await this.clientRepo.retrieve(id);

        if (!invoice) {
            return null;
        }

        const clientId = invoice.clientId;

        if (!clientId) {
            return null;
        }

        const deletedInvoice = await this.clientRepo.deleteInvoice(invoice.id, data);

        // RECALCULATE THE TOTAL OUTSTANDING AFTER DELETION
        const remainingInvoices = await this.clientRepo.getAllLineTotal(clientId);
        const updatedTotalOutstanding = remainingInvoices.reduce(
            (sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0),
            0
        );

        // UPDATE TOTAL OUTSTANDING FOR ALL REMAINING INVOICES
        const updatedInvoices = await this.clientRepo.updateMany(clientId, updatedTotalOutstanding);

        return {
            deletedInvoice,
            updatedInvoices,
        };

    }

    // GET INVOICE METHOD 
    async getInvoice(id: number) {

        const invoice = await this.clientRepo.retrieve(id);

        if (!invoice) {
            return null;
        } else {
            return invoice;
        }

    }


    // INVOICES LIST w/ SEARCH AND PAGINATION
    async invoiceList(req: Request) {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const query = req.query.query as string || "";

        const skip = (page - 1) * limit;

        const searchResults = await this.clientRepo.invoiceList(query, skip, limit);

        return searchResults;

    }

}

export default ClientService;