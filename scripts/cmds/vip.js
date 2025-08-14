const fs = require("fs-extra");
const path = require("path");

const VIP_FILE = path.join(__dirname, "vip.json");

// Owner Facebook UID
const OWNER_UID = "61572240295227"; 

module.exports = {
  config: {
    name: "vip",
    version: "2.4",
    author: "Arijit (Edited for Ownership + Updated by Kakashi)",
    countDown: 0,
    role: 0,
    shortDescription: "Manage VIP users",
    longDescription: "Add, remove, list VIP users and see VIP commands (VIPs only).",
    category: "vip",
    guide: {
      en: "{pn} add [@tag/reply] [days]\n{pn} remove [@tag/reply]\n{pn} list\n{pn} cmds"
    }
  },

  onStart: async function ({ message, event, usersData, args }) {
    const { senderID, mentions, messageReply } = event;

    let vipDB = [];
    if (fs.existsSync(VIP_FILE)) {
      try {
        vipDB = JSON.parse(fs.readFileSync(VIP_FILE));
      } catch (e) {
        console.error("Error reading or parsing vip.json:", e);
        vipDB = [];
      }
    }

    const cmd = args[0]?.toLowerCase();

    if (cmd === "add") {
      if (senderID !== OWNER_UID) {
        return message.reply("❌ | Ei command er control Owner er kache !! Tui ekhono VIP list e nai, !vip try kor ! 💡");
      }
      const day = parseInt(args[args.length - 1]);
      if (isNaN(day) || day < 0 || day > 999) return message.reply("❌ | Please enter a valid number of days (e.g., 7, 30, or 0 for permanent).");
      let uids = [];
      if (Object.keys(mentions).length > 0) uids = Object.keys(mentions);
      else if (messageReply) uids = [messageReply.senderID];
      else return message.reply("❌ | Please tag a user or reply to their message to add them as VIP.");
      for (let uid of uids) {
        const expire = day === 0 ? 0 : Date.now() + day * 86400000;
        const existing = vipDB.find(v => v.uid === uid);
        if (existing) existing.expire = expire;
        else vipDB.push({ uid, expire });
        const userData = await usersData.get(uid);
        const name = userData?.name || `User (${uid})`;
        const duration = day === 0 ? "∞ (permanent)" : `${day} day(s)`;
        message.reply(`🎀 | Success! ${name} has been added as a VIP for ${duration}.`);
      }
      fs.writeFileSync(VIP_FILE, JSON.stringify(vipDB, null, 2));
    }
    else if (cmd === "remove") {
      if (senderID !== OWNER_UID) return message.reply("❌ | You don't have permission to use this command.\nOnly the Bot Owner can use this.");
      let uids = [];
      if (Object.keys(mentions).length > 0) uids = Object.keys(mentions);
      else if (messageReply) uids = [messageReply.senderID];
      else return message.reply("❌ | Please tag a user or reply to their message to remove them from VIP.");
      const initialCount = vipDB.length;
      vipDB = vipDB.filter(user => !uids.includes(user.uid));
      if (vipDB.length < initialCount) {
        fs.writeFileSync(VIP_FILE, JSON.stringify(vipDB, null, 2));
        for (let uid of uids) {
          const userData = await usersData.get(uid);
          const name = userData?.name || `User (${uid})`;
          message.reply(`❌ | Success! ${name} has been removed from the VIP list.`);
        }
      } else message.reply("❌ | The specified user(s) were not found in the VIP list.");
    }
    else if (cmd === "list") {
      if (vipDB.length === 0) return message.reply("📃 | The VIP list is currently empty.");
      let listText = "🎀 | VIP Users List:\n\n";
      const now = Date.now();
      const sortedVipDB = [...vipDB].sort((a, b) => a.uid.localeCompare(b.uid));
      for (const user of sortedVipDB) {
        const userData = await usersData.get(user.uid);
        const name = userData?.name || "Unknown User";
        let expireText = user.expire === 0 ? "∞ (Permanent)" : (user.expire - now <= 0 ? "Expired" : `${Math.floor((user.expire - now) / 86400000)}d ${Math.floor(((user.expire - now) % 86400000) / 3600000)}h remaining`);
        listText += `• Name: ${name}\n  UID: ${user.uid}\n  Expires: ${expireText}\n\n`;
      }
      message.reply(listText.trim());
    }
    else if (cmd === "cmds") {
      const isVip = vipDB.some(user => user.uid === senderID && (user.expire === 0 || user.expire > Date.now()));
      if (isVip) {
        const vipCmds = [
          "art", "edit", "gay", "gay2", "jan edit permission", "mistake",
          "pair3", "pair4", "pair10", "wlt",
          "buttslap", "duck", "cockroach" // ✅ Added here
        ];
        const msg = `🎀 | VIP Command List:\n${vipCmds.sort().map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n> More VIP commands coming soon!`;
        message.reply(msg);
      } 
      else {
        return message.reply("❌ | 𝐘𝐨𝐮 𝐚𝐫𝐞 𝐍𝐨𝐭 𝐚 𝐯𝐢𝐩 𝐮𝐬𝐞𝐫 𝐛𝐚𝐛𝐲\n\n𝐓𝐲𝐩𝐞 !vip & 𝐬𝐞𝐞 𝐯𝐢𝐩 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐭𝐚𝐬𝐤.");
      }
    }
    else {
      message.reply("📝 | Invalid command. Use:\n\n• vip add [@tag/reply] [days]\n• vip remove [@tag/reply]\n• vip list\n• vip cmds");
    }
  }
};
