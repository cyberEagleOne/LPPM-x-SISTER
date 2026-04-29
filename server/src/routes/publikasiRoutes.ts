import { Router } from "express";
import { PublikasiController } from "../controllers/publikasiController";

const router = Router();

// ROUTE LOKAL
router.get('/publikasi', PublikasiController.getListPublikasi);
router.post('/publikasi', PublikasiController.createPublikasi);
router.put('/publikasi/:id', PublikasiController.updatePublikasi);
router.delete('/publikasi/:id', PublikasiController.deletePublikasi);

//ROUTE SISTER
router.get('/publikasi/sister', PublikasiController.getSisterPublikasi);

export default router;