import express from "express";
import sequelize from "./config/database";
import studentRoutes from "./routes/studentRoutes";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import { authenticate } from "./middleware/authMiddleware";
import statusMonitor from "express-status-monitor";
import swaggerUi from "swagger-ui-express";
import { Logger } from "./Logger";
const swaggerDocument = require("./config/swagger_output.json");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const logger = new Logger();

app.use(statusMonitor());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", authenticate, studentRoutes);

app.get("/", (_, res) => {
    res.send("Student Management API is running.");
});

async function startServer() {
    try {
        await sequelize.authenticate();
        logger.log("Database connected...");

        app.listen(PORT, () => {
            logger.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Unable to connect to the database:", error);
    }
}

if (require.main === module) {
    startServer();
}

export default app;
