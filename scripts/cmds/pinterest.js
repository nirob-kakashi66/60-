const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pin",
    version: "1.0.4",
    author: "JVB",
    role: 0,
    countDown: 50,
    shortDescription: {
      en: "🔍 Search and fetch Pinterest images"
    },
    longDescription: {
      en: "Search Pinterest and return multiple images in a stylish way"
    },
    category: "image",
    guide: {
      en: "{prefix}pin <search query> -<number of images>\nExample: {prefix}pin cat -5"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          `❌ Oops! Wrong format.\n💡 Use like this:\n${this.config.guide.en}`,
          event.threadID,
          event.messageID
        );
      }

      const query = keySearch.substring(0, keySearch.indexOf("-")).trim();
      const limit = parseInt(keySearch.split("-").pop().trim()) || 5;

      // Notify user
      const waitMsg = await api.sendMessage(
        `✨ Searching Pinterest for "${query}"... Please wait!`,
        event.threadID
      );

      // Fetch images from API
      const res = await axios.get(
        `https://celestial-dainsleif-v2.onrender.com/pinterest?pinte=${encodeURIComponent(query)}`
      );
      const data = res.data;

      if (!data || !Array.isArray(data) || data.length === 0) {
        return api.sendMessage(
          `❌ Sorry! No images found for "${query}". Try another keyword.`,
          event.threadID,
          event.messageID
        );
      }

      const images = [];
      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      for (let i = 0; i < Math.min(limit, data.length); i++) {
        const imgUrl = data[i].image;
        try {
          const imgRes = await axios.get(imgUrl, { responseType: "arraybuffer" });
          const imgPath = path.join(cacheDir, `${i + 1}.jpg`);
          await fs.writeFile(imgPath, imgRes.data);
          images.push(fs.createReadStream(imgPath));
        } catch (err) {
          console.error(`❌ Failed to download image ${i + 1}: ${err.message}`);
        }
      }

      // Send images
      if (images.length > 0) {
        await api.unsendMessage(waitMsg.messageID);
        await api.sendMessage(
          {
            body: `🌸 Here are ${images.length} images for "${query}"\nEnjoy! 🐾`,
            attachment: images
          },
          event.threadID,
          event.messageID
        );
      } else {
        await api.sendMessage(
          `❌ Failed to download any images for "${query}". Try again later.`,
          event.threadID,
          event.messageID
        );
      }

      // Clean cache
      await fs.remove(cacheDir);

    } catch (error) {
      console.error(error);
      return api.sendMessage(
        `❌ Something went wrong! Please try again later.\n💡 Error: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
