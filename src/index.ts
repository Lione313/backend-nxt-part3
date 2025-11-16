import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/authRoutes";
import casosRoutes from "./routes/casosRoutes";

dotenv.config();

export const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(bodyParser.json()); 

app.use("/auth", authRoutes);
app.use("/casos", casosRoutes); 


if (process.env.NODE_ENV !== "test") {
    AppDataSource.initialize()
        .then(() => {
            console.log("Base de datos conectada");
            app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
        })
        .catch((err) => {
            console.error("Error conectando a la base de datos:", err);
        });
}

