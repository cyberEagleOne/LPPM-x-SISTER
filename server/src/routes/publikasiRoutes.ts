import { Router } from "express";
import { PublikasiController } from "../controllers/publikasiController";

const router = Router();

router.get('/publikasi', PublikasiController.getListPublikasi);
router.post('/publikasi', PublikasiController.createPublikasi);
router.put('/publikasi/:id', PublikasiController.updatePublikasi);
router.delete('/publikasi/:id', PublikasiController.deletePublikasi);

export default router;