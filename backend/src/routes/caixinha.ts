import { Router } from 'express';
import { getCaixinhas, postCaixinha, putCaixinha, deleteCaixinha, postCheckIn, postExtra, deleteExtra } from '../controllers/caixinhaController';

const router = Router();

router.get('/', getCaixinhas);
router.post('/', postCaixinha);
router.put('/:id', putCaixinha);
router.delete('/:id', deleteCaixinha);
router.post('/:id/checkin', postCheckIn);
router.post('/:id/extra', postExtra);
router.delete('/:id/extra/:extraId', deleteExtra);

export default router;
