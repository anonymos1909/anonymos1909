const fs = require('fs');
const axios = require('axios');
const env = require('../config.json');

module.exports = async (client, Func) => {
  try {
    // Path ke file deposit JSON
    const depositFilePath = './media/json/deposit.json';

    // Fungsi untuk mengecek status pembayaran melalui API
    const checkPaymentStatus = async (phone, amount, incoming) => {
      try {
        const url = `https://gateway.okeconnect.com/api/mutasi/qris/${global.ord_id}/${global.ord_apikey}`;
        const response = await axios.get(url);

        if (response.data.status === 'success') {
          const payments = response.data.data;

          // Cari pembayaran dengan tipe 'CR', qris 'static', dan jumlah yang sesuai
          const successfulPayment = payments.find(
            (payment) =>
              payment.type === 'CR' &&
              payment.qris === 'static' &&
              payment.amount == amount
          );

          if (successfulPayment) {
            // console.log(`Pembayaran Berhasil untuk ${phone}`);
            const user = addDepositToUser(phone, amount, incoming); // Perbaikan: kirim incoming
            client
              .reply(
                phone + '@c.us',
                `*✅ PEMBAYARAN BERHASIL*

○ Status : Success ✅
○ Jumlah : Rp ${Func.formatNumber(incoming)}

> Kirim perintah *.saldo* untuk mengecek saldo

${global.footer}`,
                null
              )
              .then(() =>
                client.reply(
                  env.owner + '@c.us',
                  `*🔴 NOTIFICATION*

@${phone} Mengisi saldo deposit sebesar Rp ${Func.formatNumber(incoming)}
Status : Success ✅

${global.footer}`,
                  null
                )
              );

            // Hapus deposit yang telah diproses dari file deposit.json
            removeProcessedDeposit(phone);
          } else {
            // console.log(`Pembayaran Pending atau Tidak Sesuai untuk ${phone}`);
          }
        } else {
          // console.log(`Gagal mengecek status untuk ${phone}`);
        }
      } catch (error) {
        console.error(
          `Error saat mengecek status pembayaran untuk ${phone}: ${error.message}`
        );
      }
    };

    // Fungsi untuk menambah saldo deposit pengguna
    const addDepositToUser = (phone, amount, incoming) => {
      const user = global.db.users.find(
        (v) => v.jid === phone + '@s.whatsapp.net'
      );
      if (user) {
        user.deposit += incoming; // Tambahkan incoming ke saldo deposit
        user.status_deposit = false;
        user.jumlah = 0;
        console.log(
          `Saldo deposit ${phone} bertambah ${incoming}. Total deposit: ${user.deposit}`
        );
        return user; // Kembalikan objek user yang telah diperbarui
      } else {
        console.log(`Pengguna dengan nomor ${phone} tidak ditemukan.`);
        return null; // Return null jika pengguna tidak ditemukan
      }
    };

    // Fungsi untuk menghapus deposit yang sudah diproses dari file deposit.json
    const removeProcessedDeposit = (phone) => {
      fs.readFile(depositFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Gagal membaca file deposit: ${err.message}`);
          return;
        }

        const deposits = JSON.parse(data);
        delete deposits[phone]; // Hapus entri deposit untuk nomor ini

        // Tulis kembali file deposit.json yang diperbarui
        fs.writeFile(
          depositFilePath,
          JSON.stringify(deposits, null, 2),
          'utf8',
          (err) => {
            if (err) {
              console.error(`Gagal menulis ke file deposit: ${err.message}`);
            } else {
              console.log(
                `Deposit untuk ${phone} telah dihapus dari deposit.json.`
              );
            }
          }
        );
      });
    };

    // Fungsi untuk mengecek pembayaran secara berulang dengan delay
    const checkPaymentsLoop = () => {
      fs.readFile(depositFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Gagal membaca file deposit: ${err.message}`);
          return;
        }

        const deposits = JSON.parse(data);
        if (Object.keys(deposits).length === 0) {
          // console.log('Deposit.json kosong. Mengecek status pembayaran setiap 5 detik...');
          setTimeout(checkPaymentsLoop, 5000); // Coba lagi setelah 5 detik jika file kosong
          return;
        }

        const phoneNumbers = Object.keys(deposits);
        let index = 0;

        const processNextPayment = () => {
          if (index < phoneNumbers.length) {
            const phone = phoneNumbers[index];
            const amount = deposits[phone].amount;
            const incoming = deposits[phone].incoming;

            console.log(`Mengecek pembayaran untuk ${phone}...`);
            checkPaymentStatus(phone, amount, incoming);

            index++;
            setTimeout(processNextPayment, 10000); // Delay 10 detik sebelum memproses pembayaran berikutnya
          } else {
            console.log('Pengecekan pembayaran selesai. Mengecek kembali dalam 5 detik...');
            setTimeout(checkPaymentsLoop, 5000); // Coba lagi setelah 5 detik saat semua pembayaran telah dicek
          }
        };

        processNextPayment();
      });
    };

    // Mulai pengecekan pembayaran
    checkPaymentsLoop();
  } catch (e) {
    console.error(`Error: ${e.message}`);
  }
};

