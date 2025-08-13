const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: 'automsg',
  version: "2.0.0",
  role: 0,
  author: "ＮＩＲ O Ｂ",
  description: "Auto time message with random videos and painful notes",
  category: "AutoTime",
  countDown: 3
};

// ভিডিও ডাউনলোড করার ফাংশন
async function downloadVideo(url, filename) {
  const response = await axios.get(url, { responseType: "stream" });
  const filePath = path.join(__dirname, filename);
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
}

module.exports.onLoad = async ({ api }) => {
  console.log("Automsg command loaded successfully! ✅");
};

module.exports.onStart = async function({ api, event }) {
  // ভিডিও লিঙ্ক লোড
  let videos = [];
  try {
    const response = await axios.get("https://raw.githubusercontent.com/nirob-kakashi66/60-/main/AutomsgVideo.json");
    videos = response.data;
  } catch (e) {
    console.error("❌ ভিডিও লিঙ্ক লোড করা যায়নি:", e);
  }

  // painful কিন্তু সুন্দর নোট
  const notes = [
    "💔 কখনো কখনো বিদায়ই হয় ভালোবাসার চূড়ান্ত শিক্ষা। 🤍",
    "🌙 রাত যত গভীর, স্মৃতিগুলো তত বেশি চাপে রাখে। 🧡",
    "😔 তোমাকে হারিয়ে আমি শুধু খালি বুকে শূন্যতা পাই। 🖤",
    "🌸 ভালোবাসার ছায়া মাঝে মাঝে সবচেয়ে ব্যথার মতো লাগে। 💞",
    "💭 কিছু মানুষ শুধু স্মৃতি হয়ে যায়, ছুঁতে পারি না। 💞",
    "🕊️ মনে হয় তুমি শুধু স্বপ্নে বাঁচছ। 💛",
    "🌧️ অশ্রুর প্রতিটা ফোঁটা তোমার কথা মনে করায়। 🤍",
    "🔥 যন্ত্রণার মাঝে কখনো কখনো আমরা সবচেয়ে জীবিত বোধ করি। ♥️",
    "🌹 হারানো ভালোবাসা অনেক সময় ফুলের মতো মধুর লাগে। 😍",
    "💫 কিছু সম্পর্ক শুধু হৃদয়ের কোণে থাকে। 🌻",
    "⚡ ব্যথা ছাড়া আমি বুঝি না সুখের দাম। 💮",
    "🍂 সবকিছু শেষ হলেও মন এখনও তোমায় খুঁজে থাকে। 🌼",
    "🌈 যন্ত্রণার মাঝেও আশা মিশে থাকে। 🌹",
    "💔 তুমি নেই, অথচ মনে হয় তুমি পাশে আছ। 🌺",
    "🌊 নদীর মতো আমার অনুভূতি কখনো থামে না। 💘",
    "🌟 তোমার কথা ভাবলে রাতও জেগে থাকে। 😍",
    "🖤 কিছু মানুষ শুধু শূন্যতা রেখে যায়। 🖤",
    "🎵 ব্যথা কখনো কখনো সবচেয়ে সুন্দর গান বানায়। 😁",
    "🌹 তোমার অভাব হৃদয়কে আরও নরম করে। ☺️",
    "💭 স্মৃতিগুলো কখনো ভুলে যায় না, শুধু চুপচাপ থাকে। 🥰",
    "🌺 হারানো হাসি মাঝে মাঝে হৃদয় ছিঁড়ে দেয়। 😅",
    "🌌 রাতের নীরবতা যেন তোমার কণ্ঠস্বর বাজায়। 😊",
    "💖 ব্যথার মাঝে শিখি সত্যিকার ভালবাসা কত সুন্দর। 🙂"
  ];

  // প্রতি ঘন্টায় পাঠানোর মেসেজ
  const messagesByTime = {};
  for (let i = 0; i < 24; i++) {
    const hour = i.toString().padStart(2, '2');
    const suffix = i < 12 ? "AM" : "PM";
    messagesByTime[`${hour}:00:00 ${suffix}`] = {
      message: "====== 🐾 𝗔𝗨𝗧𝗢 𝗦𝗘𝗡𝗗 🐾 ======\n━━━━━━━━━━━━━━━━━━━━━━━\n➝ 𝗡𝗼𝘄 𝗜𝘀: " + hour + ":00 " + suffix
    };
  }

  // প্রতি সেকেন্ডে পরীক্ষা করা
  setInterval(async () => {
    const currentTime = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
    if (messagesByTime[currentTime]) {
      const baseMsg = messagesByTime[currentTime].message;
      const randomNote = notes[Math.floor(Math.random() * notes.length)];
      let finalMsg = `${baseMsg}\n\n💬: ${randomNote}\n━━━━━━━━━━━━━━━━━━\n➝ 𝗧𝗵𝗶𝘀 𝗜𝘀 𝗔𝗻 𝗔𝘂𝘁𝗼𝗺𝗮𝘁𝗶𝗰 𝗠𝗲𝘀𝘀𝗮𝗴𝗲`;

      if (videos.length > 0) {
        const randomVideoUrl = videos[Math.floor(Math.random() * videos.length)];
        try {
          const videoPath = await downloadVideo(randomVideoUrl, "tempvideo.mp4");
          api.sendMessage({ body: finalMsg, attachment: fs.createReadStream(videoPath) }, event.threadID);
          fs.unlinkSync(videoPath); // পাঠানোর পর টেম্প ফাইল ডিলিট
        } catch (e) {
          console.error("❌ ভিডিও পাঠানো যায়নি:", e);
          api.sendMessage({ body: finalMsg }, event.threadID);
        }
      } else {
        api.sendMessage({ body: finalMsg }, event.threadID);
      }
    }
  }, 1000);
};
