import { Router } from "express";
import { create, list, update, remove } from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.use(authMiddleware);

router.post("/", create);
router.get("/", list);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;