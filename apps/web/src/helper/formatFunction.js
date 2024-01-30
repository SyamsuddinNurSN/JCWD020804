
// Fungsi untuk memformat tanggal
const formatDate = (date) => {
    // Tentukan zona waktu Indonesia (Waktu Indonesia Barat)
    const options = {
      timeZone: 'Asia/Jakarta',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      // hour: 'numeric',
      // minute: 'numeric',
      // second: 'numeric',
    };

    // Ganti objek Date dengan waktu Indonesia
    const localizedDate = date
      ? new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
      : new Date();

    // Kembalikan tanggal yang diformat
    return localizedDate.toLocaleDateString('en-US', options);
  };


function formatMataUang(amount, currency, locale = 'id-ID') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency }).format(amount);
}

// // Contoh Penggunaan
// const hariIni = new Date();
// console.log('Tanggal Sekarang:', formatTanggal(hariIni, 'dd-mm-yyyy'));

// const jumlahUang = 1234567.89;
// console.log('Format Mata Uang:', formatMataUang(jumlahUang, 'IDR'));

// Ekspor fungsi jika menggunakan modul
export { formatDate, formatMataUang };
