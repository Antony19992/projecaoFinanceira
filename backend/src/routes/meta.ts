import { Router } from 'express';
import { getMeta } from '../controllers/metaController';

const router = Router();

router.get('/', getMeta);

export default router;
