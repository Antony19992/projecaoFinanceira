import { Router } from 'express';
import * as controller from '../controllers/limitController';

const router = Router();

router.post('/', controller.upsert);
router.get('/', controller.listByMonth);
router.delete('/:id', controller.remove);

export default router;
