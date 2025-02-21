import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import swagger from "./utils/swagger";
// import cron from "node-cron";
// import ClientService from "./services/ClientService";

// const clientService = new ClientService();
import "../src/jobs/RecurringInvoicesScheduler";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use("/api", routes);
swagger(app);

// SWAGGER API ENDPOINT FOR API DOCUMENTATION
app.get("/", (req, res) => {
    return res.redirect("/docs");
});

// cron.schedule("0 0 * * *", async () => {
//     console.log("Running daily invoice generation...");
//     await clientService.generateRecurringInvoices();
// });

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
});