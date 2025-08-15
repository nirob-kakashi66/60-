const axios = require("axios");

module.exports.config = {
  name: "flux",
  version: "2.0.1",
  permission: 0,
  credits: "Dipto (Fixed) BY NIROB",
  description: "Flux Image Generator",
  prefix: false,
  premium: false,
  category: "Image Generator",
  usages: "flux [prompt] --ratio 1024x1024",
  cooldowns: 15
};

module.exports.onStart = async ({ api, event, args }) => {
  const dipto = "https://www.noobs-api.rf.gd/dipto";

  try {
    if (!args.length) {
      return api.sendMessage("❌ Please provide a prompt.\nExample: flux a cute cat --ratio 1024x1024", event.threadID, event.messageID);
    }

    let prompt = args.join(" ");
    let ratio = "1:1";

    if (prompt.includes("--ratio")) {
      const parts = prompt.split("--ratio");
      prompt = parts[0].trim();
      ratio = parts[1]?.trim() || "1:1";
    }

    ratio = ratio.replace(/x/g, ":");

    const startTime = Date.now();
    const waitMessage = await api.sendMessage("⏳ Generating image, please wait...", event.threadID);
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    const apiurl = `${dipto}/flux?prompt=${encodeURIComponent(prompt)}&ratio=${encodeURIComponent(ratio)}`;
    const response = await axios.get(apiurl, { responseType: "stream" });

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    if (waitMessage?.messageID) api.unsendMessage(waitMessage.messageID);

    api.sendMessage({
      body: `✅ Here's your image (Generated in ${timeTaken} seconds)`,
      attachment: response.data
    }, event.threadID, event.messageID);

  } catch (e) {
    console.error(e);
    api.sendMessage("❌ Error: " + e.message, event.threadID, event.messageID);
  }
};
