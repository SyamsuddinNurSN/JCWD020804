import { Router } from 'express';
import {
  becomeTenant,
  createUser,
  keepLogin,
  login,
  userRegisterWithGoogle,
  resetPassword,
  updateUserPassword,
  editProfile,
  verify,
} from '../controllers/user.controller';
import { verifyToken } from '../middleware/auth';
const { multerUpload } = require('../middleware/multer');
const userRouter = Router();

// GET
// sampleRouter.get('/', async (req, res) => {
//   const result = await getSampleData();
//   res.json(result);
// });

// POST
userRouter.post('/register', createUser);

userRouter.post('/login', async (req, res) => {
  const result = await login(req);
  res.status(!result.code ? 200 : result.code).send(result);
  console.log('result', result);
});

userRouter.patch('/verify/:id', verify);

userRouter.patch('/update-password', updateUserPassword);

userRouter.patch('/reset-password', resetPassword);

userRouter.get('/keep-login', verifyToken, keepLogin);

userRouter.patch(
  '/edit-profile/:id',
  verifyToken,
  multerUpload().single('picture'),
  editProfile,
);

userRouter.patch(
  '/become-tenant/:id',
  verifyToken,
  multerUpload().single('foto_ktp'),
  becomeTenant,
);

userRouter.post('/register-google', userRegisterWithGoogle);

export { userRouter };
