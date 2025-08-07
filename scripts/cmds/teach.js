const fs = require("fs");
const path = __dirname + "/../../data/teach.json";

module.exports = {
  config: {
    name: "teach",
    aliases: [],
    author: "ChatGPT",
    version: "1.0",
    role: 0,
    description: "Teach the bot how to reply to a message",
    usage: "/teach question | answer",
  },

  onStart: async function ({ message, args }) {
    if (!args[0]) return message.reply("❌ Format:\n/teach question | answer");

    const [q, a] = args.join(" ").split("|").map(i => i.trim());
    if (!q || !a) return message.reply("❌ Both question and answer are required.");

    let db = {};
    if (fs.existsSync(path)) {
      try {
        db = JSON.parse(fs.readFileSync(path));
      } catch (e) {
        return message.reply("⚠️ Failed to read database.");
      }
    }

    db[q.toLowerCase()] = a;
    fs.writeFileSync(path, JSON.stringify(db, null, 2));

    message.reply(`✅ Learned:\n🧠 ${q} → 💬 ${a}`);
  }
};
