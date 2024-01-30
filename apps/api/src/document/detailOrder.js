import PDFDocument from 'pdfkit';
import fs from 'fs';

export const createPDF = (filename, transaction) => {
  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filename));

  // Header
  doc.fontSize(25).fillColor('blue').text('Konfirmasi Booking', 100, 50);

  // Subheader
  doc.fontSize(18).fillColor('black').text('Detail Pemesanan:', 100, 100);

  // Detail Pemesanan
  const detailsStartY = 130;
  doc.fontSize(12).fillColor('#333');
  doc.text(`Nama: ${transaction.User.name}`, 100, detailsStartY);
  doc.text(`Check-In: ${transaction.checkIn}`, 100, detailsStartY + 20);
  doc.text(`Hotel: ${transaction.Room.Property.name}`, 100, detailsStartY + 40);
  doc.text(`Kamar Hotel: ${transaction.Room.name}`, 100, detailsStartY + 60);

  // Garis pembatas
  doc
    .moveTo(50, 250)
    .lineTo(550, 250)
    .strokeColor('#666')
    .lineWidth(1)
    .stroke();

  // Footer
  doc
    .fontSize(10)
    .fillColor('grey')
    .text('Terima kasih telah melakukan pemesanan dengan kami.', 100, 270);

  // Tambahkan lebih banyak konten sesuai kebutuhan

  doc.end();
};
