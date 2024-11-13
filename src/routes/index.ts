import express from "express";
import adminRoute from "./AdminRoute";
import clientRoute from "./ClientRoute";

const routes = express.Router();

routes.use("/admin", adminRoute);
routes.use("/client", clientRoute);

export default routes;