import { Router } from 'express';
import { getCaixinhas, postCaixinha, putCaixinha, deleteCaixinha, postCheckIn } from '../controllers/caixinhaController';

const router = Router();

router.get('/', getCaixinhas);
router.post('/', postCaixinha);
router.put('/:id', putCaixinha);
router.delete('/:id', deleteCaixinha);
router.post('/:id/checkin', postCheckIn);

export default router;
