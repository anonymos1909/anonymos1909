const models = {
   users: Object.freeze({
         afk: -1,
         afkReason: '',
         afkObj: {},
         banned: false,
         ban_temporary: 0,
         ban_times: 0,
         premium: false,
         example: [],
         expired: 0,
         lastseen: 0,
         hit: 0,
         warning: 0,
         device: 1,
         opsi_device: false,
         // balance 
         total_pembelian: 0,
         total_pengeluaran: 0,
         deposit: 0,
         // deposit
         jumlah: 0,
         status_deposit: false,
         // bind
         bind_status: false,
         bind_username: '',
         bind_code: '',
         bind_password: '',
         bind_email: '',
         // login
         login_code: '',
         login_status: false,
         login_username: '',
         // role
         user_diamond: false,
         user_silver: true, 
         user_gold: false
   }),
   groups: Object.freeze({
      activity: 0,
      antidelete: true,
      antilink: false,
      antivirtex: false,
      filter: false,
      left: false,
      localonly: false,
      mute: false,
      viewonce: true,
      autosticker: true,
      member: {},
      text_left: '',
      text_welcome: '',
      welcome: true,
      expired: 0,
      stay: false
   }),
   chats: Object.freeze({
      chat: 0,
      lastchat: 0,
      lastseen: 0
   }),
   setting: Object.freeze({
         autodownload: true,
         autoread: true,
         antispam: true,
         debug: false,
         error: [],
         hidden: [],
         pluginDisable: [],
         receiver: [],
         groupmode: false,
         sk_pack: 'Sticker by Tecee',
         sk_author: '© Tecee Store',
         self: false,
         noprefix: true,
         multiprefix: true,
         prefix: ['.', '#', '!', '/'],
         toxic: ["ajg", "ajig", "anjas", "anjg", "anjim", "anjing", "anjrot", "anying", "asw", "autis", "babi", "bacod", "bacot", "bagong", "bajingan", "bangsad", "bangsat", "bastard", "bego", "bgsd", "biadab", "biadap", "bitch", "bngst", "bodoh", "bokep", "cocote", "coli", "colmek", "comli", "dajjal", "dancok", "dongo", "fuck", "gelay", "goblog", "goblok", "guoblog", "guoblok", "hairul", "henceut", "idiot", "itil", "jamet", "jancok", "jembut", "jingan", "kafir", "kanjut", "kanyut", "keparat", "kntl", "kontol", "lana", "loli", "lont", "lonte", "mancing", "meki", "memek", "ngentod", "ngentot", "ngewe", "ngocok", "ngtd", "njeng", "njing", "njinx", "oppai", "pantek", "pantek", "peler", "pepek", "pilat", "pler", "pornhub", "pucek", "puki", "pukimak", "redhub", "sange", "setan", "silit", "telaso", "tempek", "tete", "titit", "toket", "tolol", "tomlol", "tytyd", "wildan", "xnxx"],
         online: true,
         onlyprefix: '+',
         owners: ['6285172321231', '625157574907'],
         lastReset: new Date * 1,
         msg: global.msg,
         payment: global.payment,
         style: 1,
         cover: global.cover,
         link: global.link, 
         qris: global.qris,
         qrisImage: global.qrisImage
   })
}

module.exports = { models }
