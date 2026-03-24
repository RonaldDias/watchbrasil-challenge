import { Router } from "express";
import { report } from "../controllers/reportController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();
router.use(authMiddleware);

router.get("/", report);

export default router;