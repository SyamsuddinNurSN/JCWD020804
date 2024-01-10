import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { userRouter } from './routers/user.router';
import { propertyRouter } from './routers/propertyRouter';
import { transactionRouter } from './routers/transaction.router';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello, Purwadhika Student !`);
});

router.use('/sample', sampleRouter);
router.use('/user', userRouter);
router.use('/property', propertyRouter)
router.use('/transaction', transactionRouter)
// add another router here ...

export default router;
