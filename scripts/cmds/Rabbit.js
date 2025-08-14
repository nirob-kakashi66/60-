const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports = {
  config: {
    name: "rabbit",
    version: "1.0.1",
    author: "NIROB",
    countDown: 5,
    role: 0,
    shortDescription: "Expose someone as a RABBIT!",
    longDescription: "Puts the tagged/replied user's face on a RABBIT's body (funny meme)",
    category: "fun",
    guide: {
      en: "{pn} @mention or reply to someone",
    },
  },

  onStart: async function ({ event, message, api }) {
    let targetID = Object.keys(event.mentions)[0];
    if (event.type === "message_reply") targetID = event.messageReply.senderID;

    if (!targetID)
      return message.reply("❗ কাউকে ট্যাগ কর বা রিপ্লাই দে, যাতে ওকে খরগোশ বানানো যায়!");
    if (targetID === event.senderID)
      return message.reply("❗ নিজেকে খরগোশ বানাতে চাস? একটু লজ্জা কর ভাই! 😹");

    const baseFolder = path.join(__dirname, "Rabbit_Temp");
    const bgPath = path.join(baseFolder, "rabbit.png");
    const avatarPath = path.join(baseFolder, `avatar_${targetID}.png`);
    const outputPath = path.join(baseFolder, `rabbit_result_${targetID}.png`);

    try {
      if (!fs.existsSync(baseFolder)) fs.mkdirSync(baseFolder);

      // Download rabbit image if missing
      if (!fs.existsSync(bgPath)) {
        const imgUrl =
          "https://raw.githubusercontent.com/kakashiNN/FUNNY-PHOTOS-/main/7d9689be-b088-4da4-a48d-87fc0e77dd7f.jpeg";
        const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
        await fs.writeFile(bgPath, res.data);
      }

      // Download avatar safely
      let avatarBuffer;
      try {
        const res = await axios.get(
          `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
          { responseType: "arraybuffer" }
        );
        avatarBuffer = res.data;
      } catch (err) {
        return message.reply("❌ Avatar ডাউনলোড করা যায়নি, আবার চেষ্টা কর।");
      }
      await fs.writeFile(avatarPath, avatarBuffer);

      // Process avatar to circle
      const avatarImg = await jimp.read(avatarPath);
      avatarImg.circle();
      await avatarImg.writeAsync(avatarPath);

      // Process background image
      const bg = await jimp.read(bgPath);
      bg.resize(600, 800); // Standard size

      const avatarCircle = await jimp.read(avatarPath);
      avatarCircle.resize(180, 180); // Adjust face size

      // Placement on rabbit head
      const xCenter = (bg.getWidth() - avatarCircle.getWidth()) / 2;
      const yTop = 240; // Adjust to fit rabbit image
      bg.composite(avatarCircle, xCenter, yTop);

      // Save final image
      await bg.writeAsync(outputPath);

      // Fetch user info
      const userInfo = await api.getUserInfo(targetID);
      const tagName = userInfo[targetID]?.name || "Someone";

      // Send message with attachment
      if (!fs.existsSync(outputPath))
        return message.reply("❌ Image তৈরি হয়নি, আবার চেষ্টা কর।");

      await message.reply(
        {
          body: `🐇\n${tagName} হলো একটা খরগোশ! 🐰`,
          mentions: [{ tag: tagName, id: targetID }],
          attachment: fs.createReadStream(outputPath),
        },
        () => {
          // Cleanup
          try {
            fs.unlinkSync(avatarPath);
            fs.unlinkSync(outputPath);
          } catch (e) {}
        }
      );
    } catch (err) {
      console.error("🐇 Rabbit Command Error:", err);
      message.reply("ওপ্পস! খরগোশ পালাইছে বোধহয়... আবার চেষ্টা কর।");
    }
  },
};
