import cron from 'node-cron';
import ClientService from '../services/ClientService';

//INITIALIZE DEPENDECIES APPROPRIATELY
const clientService = new ClientService();
// RUNS EVERY 10 SECONDS = "*/10 * * * * *"
// RUNS AT 12:00 AM (MIDNIGHT) UTC EVERY DAY.
cron.schedule("0 0 * * *", async () => {
    console.log("Running Daily Invoice Generation...");
    await clientService.generateRecurringInvoices();
});