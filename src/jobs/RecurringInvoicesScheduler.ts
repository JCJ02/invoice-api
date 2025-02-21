import cron from 'node-cron';
import ClientService from '../services/ClientService';

//INITIALIZE DEPENDECIES APPROPRIATELY
const clientService = new ClientService();

// RUN EVERY DUE DATE OF THE INVOICE/s
cron.schedule("0 0 * * *", async () => {
    console.log("Running Daily Invoice Generation...");
    await clientService.generateRecurringInvoices();
});