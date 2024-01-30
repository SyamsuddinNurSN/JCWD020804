import { Router } from 'express';
import {
  getAllProperty,
  getPropertyById,
  getReviewProperty,
} from '../controllers/propertyController';
import { verifyToken } from '../middleware/auth';

const propertyRouter = Router();

// GET
propertyRouter.get('/', getAllProperty);
propertyRouter.get('/ratings', verifyToken, getReviewProperty);
propertyRouter.get('/:id', getPropertyById);

export { propertyRouter };
