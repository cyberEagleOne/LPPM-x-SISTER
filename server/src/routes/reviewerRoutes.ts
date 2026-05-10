import { Router } from "express";
import { ReviewerController } from "../controllers/reviewerController";

const router = Router();

// GET list of publications for review
router.get('/publikasi', ReviewerController.getListPublikasiReview);

// PUT update status and komentar
router.put('/publikasi/:id', ReviewerController.updatePublikasiReview);

export default router;
