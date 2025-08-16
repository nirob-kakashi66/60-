const axios = require("axios");

module.exports = {
  config: {
    name: "pin",
    version: "1.0.6",
    author: "JVB",
    role: 0,
    countDown: 50,
    shortDescription: { en: "🔍 Search Pinterest images fast" },
    longDescription: { en: "Search Pinterest and return multiple images quickly!" },
    category: "image",
    guide: { en: "{prefix}pin <query> -<number>\nExample: {prefix}pin cat -5" }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          `❌ Wrong format!\n💡 Use: ${this.config.guide.en}`,
          event.threadID,
          event.messageID
        );
      }

      const query = keySearch.substring(0, keySearch.indexOf("-")).trim();
      const limit = parseInt(keySearch.split("-").pop().trim()) || 5;

      // Cute wait message
      const waitMsg = await api.sendMessage(
        `🌸 Hold on! I'm pawing through Pinterest for "${query}" 🐾✨`,
        event.threadID
      );

      // Fetch images
      const res = await axios.get(
        `https://celestial-dainsleif-v2.onrender.com/pinterest?pinte=${encodeURIComponent(query)}`
      );
      const data = res.data;

      if (!data || !Array.isArray(data) || data.length === 0) {
        return api.sendMessage(
          `❌ No images found for "${query}". Try another keyword.`,
          event.threadID,
          event.messageID
        );
      }

      // Download images in parallel
      const images = await Promise.all(
        data.slice(0, limit).map(async (item, i) => {
          try {
            const imgRes = await axios.get(item.image, { responseType: "arraybuffer" });
            return { filename: `image${i + 1}.jpg`, data: Buffer.from(imgRes.data) };
          } catch {
            return null;
          }
        })
      );

      const validImages = images.filter(Boolean);

      if (validImages.length > 0) {
        await api.unsendMessage(waitMsg.messageID);
        await api.sendMessage(
          { body: `🌸 Here are ${validImages.length} images for "${query}"! 🐾`, attachment: validImages },
          event.threadID,
          event.messageID
        );
      } else {
        await api.sendMessage(
          `❌ Failed to fetch images for "${query}". Try again later.`,
          event.threadID,
          event.messageID
        );
      }

    } catch (error) {
      return api.sendMessage(
        `❌ Something went wrong! Error: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
