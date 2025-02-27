const fs = require('fs');
const path = require('path'); 

module.exports = async (client, Func) => {
  try {

    // Nama file yang ingin Anda proses
    const files = ['deposit.json'];

    // Simulasi fungsi client.reply
    function clientReply(number, message) {
        // console.log(`Sending message to ${number}: ${message}`);
    }

    // Fungsi untuk menghapus data yang sudah lebih dari 5 menit
    function cleanOldData(filename, callback) {
        const filePath = path.join('media', 'json', filename);

        // Baca file JSON
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file ${filePath}:`, err);
                callback(false); // Tetap lanjutkan looping jika terjadi kesalahan
                return;
            }

            try {
                const jsonData = data.trim() ? JSON.parse(data) : {}; // Parse JSON, atau gunakan objek kosong jika file kosong
                const currentTime = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik
                const updatedData = {};
                let hasData = false;

                // Periksa setiap entri
                for (const key in jsonData) {
                    if (jsonData.hasOwnProperty(key)) {
                        const entry = jsonData[key];
                        if (currentTime - entry.created_at <= 300) {
                            // Hanya tambahkan data yang berumur <= 5 menit
                            updatedData[key] = entry;
                            hasData = true; // Terdapat data yang valid
                        } else {
                            // Kirim pesan jika data dihapus
                            const amount = entry.incoming || 'N/A';
                            const uniqueCode = entry.uniqueCode || 'N/A';

                            const users = global.db.users.find(v => v.jid === key + '@s.whatsapp.net')
                            users.status_deposit = false

                            client.reply(key + `@c.us`, `Data Qris Kamu Sudah Expired

*○ Amount :* ${amount}
*○ UniqueCode :* ${uniqueCode}

*❒ Note*
> Jika melakukan pembayaran pada QRIS *[ ${uniqueCode} ]*, pengisian tidak akan diproses.

${global.footer}`, null);
                        }
                    }
                }

                // Tulis kembali data yang sudah diperbarui ke file JSON
                fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error(`Error writing to file ${filePath}:`, writeErr);
                    } else {
                        // console.log(`File ${filePath} has been updated.`);
                    }
                    callback(hasData);
                });
            } catch (parseErr) {
                console.error(`Error parsing JSON data from file ${filePath}:`, parseErr);
                callback(false);
            }
        });
    }

    // Fungsi untuk looping cek file
    function startChecking() {
        const checkFiles = () => {
            // console.log('Checking files...');
            let totalHasData = false;

            // Proses setiap file dalam daftar
            let pending = files.length;
            files.forEach((filename) => {
                cleanOldData(filename, (hasData) => {
                    totalHasData = totalHasData || hasData; // Jika ada file yang memiliki data
                    pending--;

                    // Jika semua file selesai diperiksa
                    if (pending === 0) {
                        const delay = totalHasData ? 5000 : 7000; // Jeda 5 detik jika ada data, 7 detik jika kosong
                        // console.log(`Next check in ${delay / 1000} seconds...\n`);
                        setTimeout(checkFiles, delay);
                    }
                });
            });
        };

        // Mulai pengecekan
        checkFiles();
    }

    // Mulai proses pengecekan file
    startChecking();
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
};