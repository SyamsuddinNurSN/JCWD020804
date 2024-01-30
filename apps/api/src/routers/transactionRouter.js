import { Router } from 'express';

import { verifyToken } from '../middleware/auth';
import {
  approveTransactionById,
  cancelTransactionById,
  getTransactionByTenant,
  getTransactionByUser,
  ratingUser,
  rejectTransactionById,
} from '../controllers/transactionController';

const transactionRouter = Router();

// GET
transactionRouter.get('/tenant', verifyToken, getTransactionByTenant);
transactionRouter.get('/user', verifyToken, getTransactionByUser);

// PATCH
transactionRouter.patch(
  '/tenant/:id/approve',
  verifyToken,
  approveTransactionById,
);
transactionRouter.patch(
  '/tenant/:id/reject',
  verifyToken,
  rejectTransactionById,
);
transactionRouter.patch(
  '/tenant/:id/cancel',
  verifyToken,
  cancelTransactionById,
);
// POST
transactionRouter.post('/ratings', verifyToken, ratingUser);

export { transactionRouter };
