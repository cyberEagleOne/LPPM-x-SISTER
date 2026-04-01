import { Router } from 'express';
import { SdmController } from '../controllers/sdmController';

const router = Router();
router.get('/', SdmController.getSemuaSdm);

export default router;