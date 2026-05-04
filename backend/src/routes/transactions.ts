import { Router } from 'express';
import * as controller from '../controllers/transactionController';
import { exportTransactions, importTransactionsHandler } from '../controllers/exportImportController';

const router = Router();

router.post('/', controller.create);
router.get('/', controller.listByMonth);
router.delete('/:id', controller.remove);
router.get('/export', exportTransactions);
router.post('/import', importTransactionsHandler);

export default router;
