const fs = require("fs");
const path = __dirname + "/../../data/teach.json";

module.exports = {
  config: {
    name: "autoreply",
    description: "Auto replies to taught messages",
    author: "ChatGPT",
    version: "1.0",
  },

  onChat: async function ({ event, message }) {
    if (!event.body) return;

    let db = {};
    if (fs.existsSync(path)) {
      try {
        db = JSON.parse(fs.readFileSync(path));
      } catch {
        return;
      }
    }

    const content = event.body.trim().toLowerCase();
    if (db[content]) {
      message.reply(db[content]);
    }
  }
};
