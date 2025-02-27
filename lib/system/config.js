const { Function: Func, NeoxrApi } = new(require('@neoxr/wb'))
global.Api = new NeoxrApi('https://api.neoxr.my.id/api', process.env.API_KEY)

// Tampilan
global.header = 'Tecee-BOT'
global.footer = '> ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ʙᴏᴛ ᴡʜᴀᴛꜱᴀᴘᴘ ʙʏ ᴛᴇᴄᴇᴇ'
global.cover = 'https://i.ibb.co/qYZr1z89/b27493d40ec3.jpg'
global.link = 'https://chat.whatsapp.com/DKhXfIogeg8CF0HLeFJWcK'
global.msg = `Hi +tag 🪸
Selamat datang di Tecee Store, Layanan TopUp Termurah & Cepat`
global.qrisImage = 'https://i.ibb.co/qYZr1z89/b27493d40ec3.jpg'
global.payment = `❒ Payment

### 08xxx
- Dana
- GoPay
- Ovo

N O T E :
➥ Ketika Selesai Transfer, Harap Kirimkan Bukti Berupa Hasil Transfer (screenshot / id transaksi)`

// ===== INTEGRASI ===== (WAJIB)
// Orderkuota https://okeconnect.com
global.ord_web = 'https://h2h.okeconnect.com'
global.ord_id = 'OK2284962'
global.ord_apikey = '888574317395504222284962OKCT2225616AE8320CD35C3DD217D6D81175'
global.ord_harga_id = '905ccd028329b0a'
global.ord_pin = '5601'
global.ord_password = 'Lols0011'

// Laba (Keuntungan)
global.user_silver = 432
global.user_gold = 310
global.user_diamond = 50

// QRIS
global.qris = '00020101021126670016COM.NOBUBANK.WWW01189360050300000879140214550059446685230303UMI51440014ID.CO.QRIS.WWW0215ID20253782965650303UMI5204541153033605802ID5921TECEE STORE OK22849626006BEKASI61051711162070703A016304A53B'

// Status Pesan
global.status = Object.freeze({
   invalid: Func.Styles('Invalid url'),
   wrong: Func.Styles('Wrong format.'),
   fail: Func.Styles('Can\'t get metadata'),
   error: Func.Styles('Error occurred'),
   errorF: Func.Styles('Sorry this feature is in error.'),
   premium: Func.Styles('This feature only for premium user.'),
   auth: Func.Styles('You do not have permission to use this feature, ask the owner first.'),
   owner: Func.Styles('This command only for owner.'),
   group: Func.Styles('This command will only work in groups.'),
   botAdmin: Func.Styles('This command will work when I become an admin.'),
   admin: Func.Styles('This command only for group admin.'),
   private: Func.Styles('Use this command in private chat.'),
   gameSystem: Func.Styles('Game features have been disabled.'),
   gameInGroup: Func.Styles('Game features have not been activated for this group.'),
   gameLevel: Func.Styles('You cannot play the game because your level has reached the maximum limit.')
})
