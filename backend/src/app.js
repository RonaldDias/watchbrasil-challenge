import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import taskSubRoutes from "./routes/taskSubRoutes.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks/:taskId", taskSubRoutes);

export default app;
