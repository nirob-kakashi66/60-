const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "anivoice",
    aliases: ["aniv"],
    author: "NIROB",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Get voice of specific anime character",
    longDescription: "Send voice of character name given",
    category: "anime",
    guide: "{p}anivoice <characterName>\nExample: {p}anivoice kakashi",
  },

  onStart: async function ({ api, event, args, message }) {
    api.setMessageReaction("🕐", event.messageID, () => {}, true);

    const character = args[0]?.toLowerCase();
    if (!character) return message.reply("Please provide a character name.\nExample: anivoice kakashi");

    // Map character names to local mp3 file paths
    const voices = {
      naruto: path.join(__dirname, "anime_voices", "naruto.mp3"),
      kakashi: path.join(__dirname, "anime_voices", "kakashi.mp3"),
      sasuke: path.join(__dirname, "anime_voices", "sasuke.mp3"),
      luffy: path.join(__dirname, "anime_voices", "luffy.mp3"),
      zoro: path.join(__dirname, "anime_voices", "zoro.mp3"),
    };

    if (!voices[character]) {
      return message.reply(`No voice found for '${character}'. Available: ${Object.keys(voices).join(", ")}`);
    }

    const filePath = voices[character];

    if (!fs.existsSync(filePath)) {
      return message.reply(`Voice file missing for '${character}'.`);
    }

    try {
      const stream = fs.createReadStream(filePath);
      message.reply({ attachment: stream });
      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (err) {
      console.error(err);
      message.reply("Error sending voice.");
    }
  },
};
