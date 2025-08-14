const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

const VIP_FILE = path.join(__dirname, "vip.json"); // VIP system file

module.exports = {
  config: {
    name: "duck",
    version: "1.0.1",
    author: "Arijit + VIP Lock by Kakashi",
    countDown: 5,
    role: 0,
    shortDescription: "Turn someone into a Duck 🦆 (VIP Only)",
    longDescription: "Overlay user's avatar onto the body of a duck (VIP users only)",
    category: "fun",
    guide: {
      en: "{pn} reply to someone's message to turn them into a Duck (VIP only)",
    },
  },

  langs: {
    en: {
      notVip: "❌ | You are not a VIP user. Type !vip to see how to get VIP access."
    }
  },

  onStart: async function ({ event, message, api }) {
    // === Check VIP ===
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

    let targetID =
      event.type === "message_reply"
        ? event.messageReply.senderID
        : Object.keys(event.mentions)[0];

    if (!targetID)
      return message.reply("🦆 Reply to someone's message to turn them into a Duck!");

    const baseFolder = path.join(__dirname, "Arijit_duck");
    const bgPath = path.join(baseFolder, "duck_bg.jpg");
    const avatarPath = path.join(baseFolder, `avatar_${targetID}.png`);
    const outputPath = path.join(baseFolder, `duck_result_${targetID}.png`);

    try {
      if (!fs.existsSync(baseFolder)) fs.mkdirSync(baseFolder);

      const duckImageURL = "https://files.catbox.moe/avutgh.jpg";
      if (!fs.existsSync(bgPath)) {
        const res = await axios.get(duckImageURL, { responseType: "arraybuffer" });
        fs.writeFileSync(bgPath, res.data);
      }

      const avatarBuffer = (
        await axios.get(
          `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        )
      ).data;
      fs.writeFileSync(avatarPath, avatarBuffer);

      const bg = await jimp.read(bgPath);
      const avatar = await jimp.read(avatarPath);

      avatar.resize(100, 100).circle();

      const x = 184;
      const y = 32;

      bg.composite(avatar, x, y);

      await bg.writeAsync(outputPath);

      const userInfo = await api.getUserInfo(targetID);
      const name = userInfo[targetID]?.name || "Someone";

      await message.reply(
        {
          body: `😂 ${name} has transformed into a Duck! 🦆`,
          mentions: [{ tag: name, id: targetID }],
          attachment: fs.createReadStream(outputPath),
        },
        () => {
          fs.unlinkSync(avatarPath);
          fs.unlinkSync(outputPath);
        }
      );
    } catch (err) {
      console.error("🦆 Duck command error:", err);
      return message.reply("❌ Failed to create Duck image.");
    }
  },
};
