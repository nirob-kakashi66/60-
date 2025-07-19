const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
  config: {
    name: "album",
    version: "1.7",
    role: 0,
    author: "Anthony", //**Fixed by Anthony **//
    category: "media",
    guide: {
      en: "{p}{n} [cartoon/sad/islamic/funny/anime/...]",
    },
  },

  onStart: async function ({ api, event, args }) {
      const obfuscatedAuthor = String.fromCharCode(65, 110, 116, 104, 111, 110, 121); 
         if (this.config.author !== obfuscatedAuthor) {
        return api.sendMessage("You are not authorized to change the author name.\n\nPlease fix author name to work with this cmd", event.threadID, event.messageID);
         }
      if (!args[0]) {
      api.setMessageReaction("😽", event.messageID, (err) => {}, true);

      const albumOptions = [
        "𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐂𝐚𝐫𝐭𝐨𝐨𝐧 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐋𝐨𝐅𝐢 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐇𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨",
        "𝐂𝐨𝐮𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐅𝐥𝐨𝐰𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐒𝐢𝐠𝐦𝐚 𝐑𝐮𝐥𝐞 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐋𝐲𝐫𝐢𝐜𝐬 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐂𝐚𝐭 𝐕𝐢𝐝𝐞𝐨 📔",
        "18+ 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐅𝐫𝐞𝐞 𝐅𝐢𝐫𝐞 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐅𝐨𝐨𝐭𝐁𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐆𝐢𝐫𝐥 𝐕𝐢𝐝𝐞𝐨 📔",
        "𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐕𝐢𝐝𝐞𝐨 📔",
      ];

      const message =
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐚𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞 𝐚𝐥𝐛𝐮𝐦 𝐯𝐢𝐝𝐞𝐨 𝐥𝐢𝐬𝐭 📔<\n" +
        "━━━━━━━━━━━━━━━━━━━━━\n" +
        albumOptions.map((option, index) => `${index + 1}. ${option}`).join("\n") +
        "\n━━━━━━━━━━━━━━━━━━━━━";

      await api.sendMessage(
        message,
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            link: albumOptions,
          });
        },
        event.messageID
      );
    }
  },

  onReply: async function ({ api, event, Reply }) {
    api.unsendMessage(Reply.messageID);

    if (event.type == "message_reply") {
      const reply = parseInt(event.body);
      if (isNaN(reply) || reply < 1 || reply > 18) {
        return api.sendMessage(
          "Please reply with a number between 1 - 18",
          event.threadID,
          event.messageID
        );
      }

      const categories = [
        "funny",
        "islamic",
        "sad",
        "anime",
        "cartoon",
        "lofi",
        "horny",
        "couple",
        "flower",
        "aesthetic",
        "sigma",
        "lyrics",
        "cat",
        "18+",
        "freefire",
        "football",
        "girl",
        "friends",
      ];

      const captions = [
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐮𝐧𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 <😹",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐈𝐬𝐥𝐚𝐦𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 <😘",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐒𝐚𝐝 𝐕𝐢𝐝𝐞𝐨 <😿",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐀𝐧𝐢𝐦𝐞 𝐕𝐢𝐝𝐞𝐨 <👽",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐂𝐚𝐫𝐭𝐨𝐨𝐧 𝐕𝐢𝐝𝐞𝐨 <🐰",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐋𝐨𝐅𝐢 𝐕𝐢𝐝𝐞𝐨 <😘",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐇𝐨𝐫𝐧𝐲 𝐕𝐢𝐝𝐞𝐨 <🔞",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐂𝐨𝐮𝐩𝐥𝐞 𝐕𝐢𝐝𝐞𝐨 <💑",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐥𝐨𝐰𝐞𝐫 𝐕𝐢𝐝𝐞𝐨 <🌼",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 𝐕𝐢𝐝𝐞𝐨 <🎨",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐒𝐢𝐠𝐦𝐚 𝐑𝐮𝐥𝐞 𝐕𝐢𝐝𝐞𝐨 <😈",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐋𝐲𝐫𝐢𝐜𝐬  𝐕𝐢𝐝𝐞𝐨 <🎵",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐂𝐚𝐭 𝐕𝐢𝐝𝐞𝐨 <🐱",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 18+ 𝐕𝐢𝐝𝐞𝐨 <🔞 (Admin Only)",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐫𝐞𝐞 𝐅𝐢𝐫𝐞 𝐕𝐢𝐝𝐞𝐨 <🔥",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐨𝐨𝐭𝐁𝐚𝐥𝐥 𝐕𝐢𝐝𝐞𝐨 <⚽",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐆𝐢𝐫𝐥 𝐕𝐢𝐝𝐞𝐨 <💃",
        "𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐅𝐫𝐢𝐞𝐧𝐝𝐬 𝐕𝐢𝐝𝐞𝐨 <👫🏼",
      ];

      let query = categories[reply - 1];
      let cp = captions[reply - 1];

      if (query === "18+" && event.senderID !== "61572491867501") {
        return api.sendMessage("❌ You don't have permission to access this category.", event.threadID);
      }

      const albumData = JSON.parse(fs.readFileSync("idoll.json", "utf-8"));
      const videoUrls = albumData[query];

      if (!videoUrls || videoUrls.length === 0) {
        return api.sendMessage("❌ No videos found for this category.", event.threadID, event.messageID);
      }

      const randomVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
      const filePath = path.join(__dirname, "temp_video.mp4");

      async function downloadFile(url, filePath) {
        const response = await axios({
          url,
          method: "GET",
          responseType: "stream",
        });

        return new Promise((resolve, reject) => {
          const writer = fs.createWriteStream(filePath);
          response.data.pipe(writer);
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      }

      try {
        await downloadFile(randomVideoUrl, filePath);

        api.sendMessage(
          {
            body: cp,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => {
            fs.unlinkSync(filePath); // Delete the file after sending
          }
        );
      } catch (error) {
        api.sendMessage("❌ Failed to download the video.", event.threadID);
      }
    }
  },
};
