import { Router } from 'express';
import * as controller from '../controllers/transactionController';

const router = Router();

router.post('/', controller.create);
router.get('/', controller.listByMonth);
router.delete('/:id', controller.remove);

export default router;
