import { Router } from 'express';
import * as controller from '../controllers/recurringController';

const router = Router();

router.post('/', controller.create);
router.get('/', controller.list);
router.patch('/:id/toggle', controller.toggle);
router.delete('/:id', controller.remove);

export default router;
