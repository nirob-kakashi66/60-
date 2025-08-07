/cmd install art.js const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "art",
    version: "1.0",
    author: "ＮＩＲＯＢ ᶻ 𝗓 𐰁",
    countDown: 5,
    role: 0,
    shortDescription: "A VIP-only command to generate art.",
    longDescription: "This command is only for VIP users.",
    category: "vip",
    guide: {
      en: "{pn} [prompt]"
    }
  },

  onStart: async function ({ api, event, args, message }) {

    // =======================================================
    // START OF VIP CHECK - এই কোডটি কপি করে পেস্ট করুন
    // =======================================================
    const vipFilePath = path.join(__dirname, "vip.json"); 

    if (!fs.existsSync(vipFilePath)) {
      return message.reply("VIP system is not configured. `vip.json` file not found.");
    }

    let vipData;
    try {
      vipData = JSON.parse(fs.readFileSync(vipFilePath));
    } catch (e) {
      return message.reply("There is an error with the VIP data file.");
    }

    const senderID = event.senderID;

    const isVip = vipData.some(user => 
      user.uid === senderID && (user.expire === 0 || user.expire > Date.now())
    );

    if (!isVip) {
      return message.reply("❌ | 😑 𝐭𝐮𝐦𝐢 𝐕𝐈𝐏 𝐧𝐚, 𝐭𝐮𝐦𝐢 𝐣𝐮𝐬𝐭 𝐞𝐤𝐭𝐚 𝐬𝐭𝐢𝐜𝐤𝐞𝐫...🤡 𝐯𝐢𝐞𝐰 𝐚𝐜𝐡𝐞, 𝐯𝐚𝐥𝐮𝐞 𝐧𝐚𝐢 😭\n\n𝐓𝐲𝐩𝐞 !vip & 𝐬𝐞𝐞 𝐯𝐢𝐩 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐭𝐚𝐬𝐤.");
    }
    // =======================================================
    // END OF VIP CHECK - এই পর্যন্ত পেস্ট করুন
    // =======================================================


    // --- আপনার art কমান্ডের আসল কোড এখানে শুরু হবে ---
    // যদি উপরের চেকিং সফল হয়, তবেই কোড এই পর্যন্ত আসবে

    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply("Please provide a prompt for the art! Example: !art a beautiful cat");
    }

    message.reply(`🎨 | Welcome VIP! Generating art for: "${prompt}"...`);

    // (এখানে আপনার art জেনারেট করার বাকি লজিক থাকবে)
  }
};
