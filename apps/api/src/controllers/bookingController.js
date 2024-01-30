import Property from '../models/property';
import Room from '../models/room';
import Transaction from '../models/transaction';
import User from '../models/user';
import fs from 'fs';
import transporter from '../middleware/transporter';
import handlebars from 'handlebars';

export const getAllData = async (req, res) => {
  try {
    const result = await Transaction.findAll();
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'gagal mendapatkan data' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const result = await Transaction.findOne({
      where: { id: req.params.id, UserId: req.user.id }, // Menambahkan kriteria pencarian berdasarkan ID Property
      include: [
        {
          model: Room,
          include: [
            {
              model: Property,
            },
          ],
        },
      ],
    });
    res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { checkIn, checkOut, total_price, total_night, RoomId } = req.body;

    const booking = await Transaction.create({
      checkIn,
      checkOut,
      total_price,
      total_night,
      UserId: req.user.id,
      RoomId,
    });
    res.status(200).send({ id: booking.id, message: 'Booking success' });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Error creating booking' });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { payment_method } = req.body;

    // Ensure that the transaction with the given ID exists and belongs to the corresponding user
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });

    if (!transaction) {
      return res.status(404).send({ message: 'Transaction not found' });
    }

    // Determine whether the status should be updated based on the payment_method value
    let updatedStatus = transaction.status;

    if (payment_method === 'otomatis') {
      updatedStatus = 'pembayaran berhasil';
    } else if (payment_method === 'bank transfer') {
      updatedStatus = 'menunggu pembayaran';
    }

    // Update the transaction with payment information and status
    await transaction.update({
      payment_method,
      status: updatedStatus,
    });

    // Set a timer for 1 hour to check and update the status if needed
    setTimeout(
      async () => {
        const updatedTransaction = await Transaction.findOne({
          where: { id: transaction.id, status: 'menunggu pembayaran' },
        });

        if (updatedTransaction) {
          // Update status to 'transaksi dibatalkan' if it's still 'menunggu pembayaran'
          await Transaction.update(
            { status: 'transaksi dibatalkan' },
            { where: { id: transaction.id } },
          );
          console.log(
            `Payment for Transaction ID ${transaction.id} canceled after 1 hour.`,
          );
        }
      },
      60 * 60 * 1000,
    ); // 1 hour in milliseconds

    res.status(200).send({ message: 'Payment success' });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: 'Error processing payment' });
  }
};

export const UploadPayment = async (req, res) => {
  try {
    const payment = await Transaction.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    await payment.update({
      status: req.body.status || 'menunggu konfirmasi',
      bukti_pembayaran: req.file?.path,
    });
    res.status(200).send('success upload payment');
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Error upload payment' });
  }
};

//cancel sisi user
export const CancelBooking = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    await transaction.update({
      status: 'transaksi dibatalkan',
    });
    res.status(200).send('success cancel booking');
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'Error cancel booking' });
  }
};

export const getTomorrowBookings = async (req, res) => {
  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    const result = await Transaction.findAndCountAll({
      where: {
        checkIn: formattedDate,
        isReminder: false
      },
    });
    res.status(200).send({result});
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: 'data error' });
  }
};


export const sendBookingReminder = async (req, res) => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Format tanggal sesuai kebutuhan database Anda
    const formattedDate = tomorrow.toISOString().split('T')[0];

    const bookings = await Transaction.findAll({
      where: {
        checkIn: formattedDate,
        isReminder: false // Hanya pilih bookings yang belum dikirim pengingatnya
      },
      include: [{
        model: User,
      }]
    });

    for (const booking of bookings) {
      // Ubah path file reminderTemplate.html sesuai dengan struktur proyek Anda
      const data = fs.readFileSync('./web/emailReminder.html', 'utf-8');
      const templateCompile = handlebars.compile(data);
      const resultHTML = templateCompile({
        name: booking.User.name,
        checkInDate: formattedDate,
        // Tambahkan detail lain jika diperlukan
      });

      // Konfigurasi email yang akan dikirim
      await transporter.sendMail({
        from: 'masn40208@gmail.com',
        to: booking.User.email,
        subject: 'Pengingat Check-In Hotel',
        html: resultHTML,
      });

      // Update status isReminder menjadi true
      await booking.update({ isReminder: true });
    }
    console.log('Reminders sent successfully');
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
};