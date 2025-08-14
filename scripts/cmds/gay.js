const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

const VIP_FILE = path.join(__dirname, "vip.json"); // VIP system

module.exports = {
  config: {
    name: "gay",
    version: "1.1",
    author: "@tas33n + VIP Lock by Kakashi",
    countDown: 1,
    role: 0,
    shortDescription: "Find gay (VIP Only)",
    longDescription: "",
    category: "box chat",
    guide: "{pn} {{[on | off]}}",
    envConfig: { deltaNext: 5 },
  },

  langs: {
    en: {
      noTag: "You must tag the person you want to use this on",
      notVip: "❌ | You are not a VIP user. Type !vip to see how to get VIP access."
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    // === VIP check ===
    let vipDB = [];
    if (fs.existsSync(VIP_FILE)) {
      try {
        vipDB = JSON.parse(fs.readFileSync(VIP_FILE));
      } catch {
        vipDB = [];
      }
    }
    const senderID = event.senderID;
    const isVip = vipDB.some(user => user.uid === senderID && (user.expire === 0 || user.expire > Date.now()));
    if (!isVip) return message.reply(this.langs.en.notVip);
    // =================

    let mention = Object.keys(event.mentions);
    let uid;

    if(event.type == "message_reply") {
      uid = event.messageReply.senderID;
    } else {
      if (mention[0]) {
        uid = mention[0];
      } else {
        uid = event.senderID;
      }
    }

    let url = await usersData.getAvatarUrl(uid);
    let avt = await new DIG.Gay().getImage(url);

    const tmpDir = path.join(__dirname, "tmp");
    fs.ensureDirSync(tmpDir);
    const pathSave = path.join(tmpDir, "gay.png");
    fs.writeFileSync(pathSave, Buffer.from(avt));

    let body = "look.... i found a gay";
    if(!mention[0] && event.type !== "message_reply") body = "Baka you gay\nforgot to reply or mention someone";

    message.reply({
      body: body,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};// }
