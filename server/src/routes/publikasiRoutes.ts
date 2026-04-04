import { Router } from "express";
import { PublikasiController } from "../controllers/publikasiController";

const router = Router();

router.get('/publikasi', PublikasiController.getListPublikasi)

export default router;