import Transaction from '../models/transaction';
import User from '../models/user';
import fs from 'fs';
import transporter from '../middleware/transporter';
import handlebars from 'handlebars';
import moment from 'moment-timezone';
import { Op } from 'sequelize';
import Room from '../models/room';
import Property from '../models/property';

// Fungsi untuk mengirim email pengingat
const sendReminderEmail = async (booking, subject, templatePath) => {
  const data = fs.readFileSync(templatePath, 'utf-8');
  const templateCompile = handlebars.compile(data);
  const resultHTML = templateCompile({
    name: booking.User.name,
    checkInDate: booking.checkIn,
    hotel: booking.Room.Property.name,
    room: booking.Room.name,
    // Tambahkan detail lain jika diperlukan
  });

  await transporter.sendMail({
    from: 'masn40208@gmail.com',
    to: booking.User.email,
    subject: subject,
    html: resultHTML,
  });
};

// Fungsi untuk mengirim pengingat H-1 hari
export const sendDailyReminder = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];

    const bookings = await Transaction.findAll({
      where: {
        checkIn: formattedDate,
        isReminder: false,
      },
      include: [
        { model: User },
        {
          model: Room,
          include: [{ model: Property }],
        },
      ],
    });

    for (const booking of bookings) {
      await sendReminderEmail(
        booking,
        'Pengingat Check-In Hotel',
        './web/emailDailyReminder.html',
      );
      await booking.update({ isReminder: true });
    }
    console.log('Daily reminders sent successfully');
  } catch (error) {
    console.error('Error sending daily reminders:', error);
  }
};

export const sendSameDayReminder = async () => {
  try {
    const now = moment().tz('Asia/Jakarta');
    const today = now.format('YYYY-MM-DD');

    const bookings = await Transaction.findAll({
      where: {
        checkIn: today,
        isReminder: false,
      },
      include: [
        { model: User },
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

    for (const booking of bookings) {
      await sendReminderEmail(
        booking,
        'Pengingat Check-In Hotel Hari Ini',
        './web/emailSameDayReminder.html',
      );
      await booking.update({ isReminder: true });
    }
    console.log('Same day reminders sent successfully');
  } catch (error) {
    console.error('Error sending same day reminders:', error);
  }
};
