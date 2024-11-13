import express from "express";
import authMiddleware from "../middleware/AuthMiddleware";
import ClientController from "../controllers/ClientController";

const clientRoute = express.Router();
const clientController = new ClientController();

// CLIENT ROUTES
clientRoute.post("/", authMiddleware, clientController.create);
clientRoute.put("/:id", authMiddleware, clientController.update);
clientRoute.delete("/:id", authMiddleware, clientController.delete);
clientRoute.get("/", authMiddleware, clientController.list);
clientRoute.get("/:id", authMiddleware, clientController.get);

// INVOICES ROUTES
clientRoute.post("/create-invoices/:id", authMiddleware, clientController.createMany);
clientRoute.put("/update-invoice/:id", authMiddleware, clientController.updateInvoice);
clientRoute.delete("/delete-invoice/:id", authMiddleware, clientController.deleteInvoice);
clientRoute.get("/retrive/invoices-list", authMiddleware, clientController.invoiceList);
clientRoute.get("/retrive/:id", authMiddleware, clientController.getInvoice);

export default clientRoute;