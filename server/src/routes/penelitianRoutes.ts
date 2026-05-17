import { Router } from "express";
import { PenelitianController } from "../controllers/penelitianController";

const router = Router();

router.get("/penelitian", PenelitianController.getListPenelitian);
router.post("/penelitian", PenelitianController.createPenelitian);
router.put("/penelitian/:id", PenelitianController.updatePenelitian);
router.delete("/penelitian/:id", PenelitianController.deletePenelitian);

export default router;
