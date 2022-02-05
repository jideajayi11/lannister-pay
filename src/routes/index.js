import { Router } from 'express';
import { createFees, computeFees } from '../controllers';

const router = Router();

router.post('/fees', createFees);
router.post('/compute-transaction-fee', computeFees);

export default router;
