import { Router } from 'express';
import {
  UploadPayment,
  createPayment,
    createBooking,
  getAllData,
  getBookingById,
  CancelBooking,
  getTomorrowBookings,
} from '../controllers/bookingController';
import { verifyToken } from '../middleware/auth';
import { multerUpload } from '../middleware/multer';

const bookingRouter = Router();

// GET
bookingRouter.get('/tomorrow-checkin', getTomorrowBookings)
bookingRouter.get('/', getAllData);
bookingRouter.get('/:id', verifyToken, getBookingById)

// PATCH
bookingRouter.patch('/:id', verifyToken, createPayment)
bookingRouter.patch('/:id/cancel', verifyToken, CancelBooking)
bookingRouter.patch('/upload-payment/:id', verifyToken, multerUpload().single("bukti_pembayaran"), UploadPayment)

// POST
bookingRouter.post('/', verifyToken, createBooking);

export { bookingRouter };
