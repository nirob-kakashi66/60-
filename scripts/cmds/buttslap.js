const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

const VIP_FILE = path.join(__dirname, "vip.json"); // Same vip.json used in your vip command

module.exports = {
  config: {
    name: "buttslap",
    version: "2.0",
    author: "KSHITIZ + VIP Lock by Kakashi",
    countDown: 5,
    role: 0,
    shortDescription: "Buttslap image (VIP Only)",
    longDescription: "Only VIP users can use this command.",
    category: "meme",
    guide: {
      en: "{pn} @tag"
    }
  },

  langs: {
    en: {
      noTag: "⚠ You must tag the person you want to slap",
      notVip: "❌ | You are not a VIP user. Type !vip to see how to get VIP access."
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    // --- Load VIP list ---
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

    // --- Check VIP ---
    if (!isVip) {
      return message.reply(getLang("notVip"));
    }

    // --- Main Buttslap Logic ---
    const uid1 = senderID;
    const uid2 = Object.keys(event.mentions)[0];
    if (!uid2) return message.reply(getLang("noTag"));

    const avatarURL1 = await usersData.getAvatarUrl(uid1);
    const avatarURL2 = await usersData.getAvatarUrl(uid2);
    const img = await new DIG.Spank().getImage(avatarURL1, avatarURL2);

    const tmpDir = path.join(__dirname, "tmp");
    fs.ensureDirSync(tmpDir);

    const pathSave = path.join(tmpDir, `${uid1}_${uid2}_spank.png`);
    fs.writeFileSync(pathSave, Buffer.from(img));

    const content = args.join(" ").replace(Object.keys(event.mentions)[0], "").trim();

    message.reply({
      body: `${content || "hehe boii"}`,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};
