import { Router } from 'express';
import transactionRoutes from './transactions';
import limitRoutes from './limits';
import dashboardRoutes from './dashboard';
import recurringRoutes from './recurring';

const router = Router();

router.use('/transactions', transactionRoutes);
router.use('/limits', limitRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/recurring', recurringRoutes);

export default router;
