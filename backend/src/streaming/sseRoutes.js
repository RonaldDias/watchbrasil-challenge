import { Router } from "express";
import { addClient } from "./sseManager.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
    addClient(req.userId, res);
});

export default router;