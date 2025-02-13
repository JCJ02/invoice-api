import { Request } from "express";
import ClientRepository from "../repositories/ClientRepository";
import { clientType, invoiceType } from "../types/ClientTypes";

class ClientService {

    private clientRepository;

    constructor() {

        this.clientRepository = new ClientRepository();

    }

    // CREATE CLIENT METHOD
    async create(data: clientType) {

        const clientData = {
            ...data
        }

        const createClient = await this.clientRepository.create(clientData);

        return createClient;

    }

    // SHOW METHOD
    async show(id: number) {

        const isClientExist = await this.clientRepository.show(id);

        if (!isClientExist) {
            return null;
        } else {
            return isClientExist;
        }

    }

    // RETRIEVE INVOICE ID METHOD 
    async retrieve(id: number) {

        const isInvoiceExist = await this.clientRepository.retrieve(id);

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

        const searchResults = await this.clientRepository.list(query, skip, limit);

        return searchResults;

    }

    // UPDATE CLIENT METHOD
    async update(id: number, data: clientType) {

        const client = await this.clientRepository.show(id);

        if (!client) {
            return null;
        } else {

            const clientData = {
                ...data
            }

            const updateClient = await this.clientRepository.update(client.id, clientData);

            return updateClient;

        }

    }

    // DELETE CLIENT METHOD
    async delete(id: number) {

        const client = await this.clientRepository.show(id);

        if (!client) {
            return null;
        } else {

            const deleteClient = await this.clientRepository.delete(client.id);

            return deleteClient;
        }

    }

    // GET CLIENT METHOD
    async get(id: number) {

        const client = await this.clientRepository.get(id);

        if (!client) {
            return null;
        } else {
            return client;
        }

    }

    // CREATE INVOICES METHOD
    async createMany(id: number, data: any[]) {

        const clientId = await this.clientRepository.show(id);

        if (!clientId) {
            return null;
        }

        // STEP 1: GET ALL LINE TOTAL OF SELECTED CLIENT IF THERE IS
        // const clientInvoices = await this.clientRepository.getAllLineTotal(id);
        // const existingTotalOutstanding = clientInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);
        const clientInvoices = await this.clientRepository.getAllLineTotal(id, false);
        const existingTotalOutstanding = clientInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);

        const lastInvoiceNumber = await this.clientRepository.validateInvoiceNumber();
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

        // STEP 2: CALCULATE LINE TOTAL FOR EACH INVOICE AND TOTAL OUTSTANDING
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
        await this.clientRepository.updateManyTotalOutstanding(id, totalOutstanding);

        // STEP 5: SAVE THE INVOICES WITH THE CALCULATED LINE TOTAL AND TOTAL OUTSTANDING
        if (createInvoices && createInvoices.length > 0) {
            return await this.clientRepository.createMany(clientId.id, createInvoices.map((invoice: any) => ({
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

    // DRAFT MANY INVOICES METHOD
    async draftMany(id: number, data: any[]) {

        const clientId = await this.clientRepository.show(id);

        if (!clientId) {
            return null;
        }

        // STEP 1: GET ALL LINE TOTAL OF SELECTED CLIENT IF THERE IS
        // const clientInvoices = await this.clientRepository.getAllLineTotal(id);
        // const existingTotalOutstanding = clientInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);
        const clientInvoices = await this.clientRepository.getAllLineTotal(id, true);
        const existingTotalOutstanding = clientInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);

        const lastInvoiceNumber = await this.clientRepository.validateInvoiceNumber();
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

        // STEP 2: CALCULATE LINE TOTAL FOR EACH INVOICE AND TOTAL OUTSTANDING
        const draftInvoices = data.map((invoice: any) => {
            // CALCULATE LINE TOTAL = RATE * QUANTITY
            const lineTotal = Number(invoice.rate || 0) * Number(invoice.quantity || 0);
            return {
                ...invoice,
                lineTotal: lineTotal,
            };
        });

        // STEP 3: CALCULATE TOTAL OUTSTANDING BASED ON EXISTING INVOICES AND NEW INVOICES (SUM OF ALL LINE TOTAL VALUES)
        const newTotalOutstanding = draftInvoices.reduce((sum: number, invoice: any) => {
            return sum + Number(invoice.lineTotal || 0);
        }, 0);
        
        const totalOutstanding = existingTotalOutstanding + newTotalOutstanding;

        // STEP 4: UPDATE ALL THE TOTAL OUTSTANDING
        await this.clientRepository.updateManyDraftTotalOutstanding(id, totalOutstanding);

        // STEP 5: SAVE THE INVOICES WITH THE CALCULATED LINE TOTAL AND TOTAL OUTSTANDING
        if (draftInvoices && draftInvoices.length > 0) {
            return await this.clientRepository.draftMany(clientId.id, draftInvoices.map((invoice: any) => ({
                ...invoice,
                invoiceNumber: baseInvoiceNumber,
                totalOutstanding: totalOutstanding,
            })));
        }

        return {
            clientId,
            totalOutstanding,
            invoices: draftInvoices
        }
    }

    // UPDATE INVOICE METHOD
    async updateInvoice(id: number, data: invoiceType) {

        const invoice = await this.clientRepository.retrieve(id);

        if (!invoice) {
            return null;
        }

        const clientId = invoice.clientId;

        if(!clientId) {
            return null;
        }

        const existingInvoices = await this.clientRepository.getAllLineTotal(clientId);
        const existingTotalOutstanding = existingInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);

        const newLineTotal = (data.rate || 0) * (data.quantity || 0);
        const newTotalOutstanding = existingTotalOutstanding - Number(invoice.lineTotal || 0) + newLineTotal;

        const invoiceData = {
            ...data,
            lineTotal: newLineTotal,
            totalOutstanding: newTotalOutstanding
        }

        const editedInvoice = await this.clientRepository.updateInvoice(invoice.id, invoiceData);
        const updatedInvoices = await this.clientRepository.updateManyTotalOutstanding(clientId, newTotalOutstanding);

        return {
            editedInvoice,
            updatedInvoices
        }

    }

    // UPDATE DRAFT INVOICE METHOD
    async updateDraftInvoice(id: number, data: invoiceType) {

        const invoice = await this.clientRepository.retrieve(id);

        if (!invoice) {
            return null;
        }

        const clientId = invoice.clientId;

        if(!clientId) {
            return null;
        }

        const existingInvoices = await this.clientRepository.getAllLineTotal(clientId);
        const existingTotalOutstanding = existingInvoices.reduce((sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0), 0);

        const newLineTotal = (data.rate || 0) * (data.quantity || 0);
        const newTotalOutstanding = existingTotalOutstanding - Number(invoice.lineTotal || 0) + newLineTotal;

        const invoiceData = {
            ...data,
            lineTotal: newLineTotal,
            totalOutstanding: newTotalOutstanding
        }

        const editedDraftInvoice = await this.clientRepository.updateDraftInvoice(invoice.id, invoiceData);
        const updatedDraftInvoices = await this.clientRepository.updateManyDraftTotalOutstanding(clientId, newTotalOutstanding);

        return {
            editedDraftInvoice,
            updatedDraftInvoices
        }

    }

    // DELETE INVOICE METHOD
    async deleteInvoice(id: number, data: invoiceType) {

        const invoice = await this.clientRepository.retrieve(id);

        if (!invoice) {
            return null;
        }

        const clientId = invoice.clientId;

        if (!clientId) {
            return null;
        }

        const deletedInvoice = await this.clientRepository.deleteInvoice(invoice.id, data);

        // RECALCULATE THE TOTAL OUTSTANDING AFTER DELETION
        const remainingInvoices = await this.clientRepository.getAllLineTotal(clientId);
        const updatedTotalOutstanding = remainingInvoices.reduce(
            (sum: number, invoice: any) => sum + Number(invoice.lineTotal || 0),
            0
        );

        // UPDATE TOTAL OUTSTANDING FOR ALL REMAINING INVOICES
        const updatedInvoices = await this.clientRepository.updateManyTotalOutstanding(clientId, updatedTotalOutstanding);

        return {
            deletedInvoice,
            updatedInvoices,
        };

    }

    // GET INVOICE METHOD 
    async getInvoice(id: number) {

        const invoice = await this.clientRepository.retrieve(id);

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

        const searchResults = await this.clientRepository.invoiceList(query, skip, limit);

        return searchResults;

    }

    // SUM TOTAL OUTSTANDING FUNCTION
    async sumTotalOutstanding(): Promise<number> {
        const totalOutstanding = await this.clientRepository.sumTotalOutstanding();
        return totalOutstanding;
    }

    // SUM DRAFT TOTAL OUTSTANDING FUNCTION
    async sumDraftTotalOutstanding(): Promise<number> {
        const draftTotalOutstanding = await this.clientRepository.sumDraftTotalOutstanding();
        return draftTotalOutstanding;
    }

    // SUM DUE DATE TOTAL OUTSTANDING FUNCTION
    async sumDueDateTotalOutstanding(): Promise<number> {
        const dueDateTotalOutstanding = await this.clientRepository.sumDueDateTotalOutstanding();
        return dueDateTotalOutstanding;
    }

}

export default ClientService;