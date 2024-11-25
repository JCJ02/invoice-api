import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";
import swagger from "./utils/swagger";

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

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`SERVER IS RUNNING ON PORT ${port}`);
});