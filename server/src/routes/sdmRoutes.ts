// File: src/routes/sdmRoutes.ts
import { Router } from 'express';
import { SdmController } from '../controllers/sdmController';

const router = Router();

// Jika frontend memanggil URL ini dengan metode GET, arahkan ke SdmController
router.get('/', SdmController.getSemuaSdm);

export default router;