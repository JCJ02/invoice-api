import express from "express";
import authMiddleware from "../middleware/AuthMiddleware";
import ClientController from "../controllers/ClientController";

const clientRoute = express.Router();
const clientController = new ClientController();

clientRoute.post("/", authMiddleware, clientController.create);
clientRoute.post("/create-invoices/:id", authMiddleware, clientController.createMany);
clientRoute.put("/:id", authMiddleware, clientController.update);
clientRoute.delete("/:id", authMiddleware, clientController.delete);
clientRoute.get("/", authMiddleware, clientController.list);
clientRoute.put("/update-invoice/:id", clientController.updateInvoice);
clientRoute.delete("/delete-invoice/:id", clientController.deleteInvoice);
clientRoute.get("/invoice-list", authMiddleware, clientController.invoiceList);
clientRoute.get("/:id", clientController.get);
clientRoute.get("/retrive/:id", clientController.getInvoice);

export default clientRoute;