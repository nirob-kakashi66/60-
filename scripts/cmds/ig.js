const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "ig",
    version: "1.2",
    author: "MR᭄﹅ MAHABUB﹅ メꪜ  Modify by NIROB ",
    countDown: 5,
    role: 0,
    shortDescription: "Responds to /start or command",
    longDescription: "Sends a random quote when user sends / or uses the command",
    category: "fun",
    guide: "{prefix}ig or /",
    usePrefix: false
  },

  onStart: async function ({ api, event }) {
    return sendQuoteWithImage(api, event);
  },

  onChat: async function ({ api, event }) {
    const body = event.body?.toLowerCase().trim();
    if (body === "/" || body === "/") {
      return sendQuoteWithImage(api, event);
    }
  }
};

// Function to get random quote
function getRandomQuote() {
  const quotes = [
    "=== 「𝗣𝗿𝗲𝗳𝗶𝘅 𝐄𝐯𝐞𝐧𝐭」 ===\n --❖-- ＮＩＲＯＢ ᶻ 𝗓 𐰁 (✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n- জীবনে এমন বন্ধু থাকা দরকার.!\n\n - যেনো বিপদে আপদে পাশে পাওয়া যায়..!❤️🥀\n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : ＮＩＲＯＢ ᶻ 𝗓 𐰁 ",
    "=== 「𝗣𝗿𝗲𝗳𝗶𝘅 𝐄𝐯𝐞𝐧𝐭」 ===\n --❖-- ＮＩＲＯＢ ᶻ 𝗓 𐰁 ( (✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n- শখের বয়সে টাকার অভাব থাকে 🙂💔\n\n- তখন পাশে নারী ওহ্ থাকে না 😅\n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : ＮＩＲＯＢ ᶻ 𝗓 𐰁 ",
    "=== 「𝗣𝗿𝗲𝗳𝗶𝘅 𝐄𝐯𝐞𝐧𝐭」 ===\n --❖-- ＮＩＲＯＢ ᶻ 𝗓 𐰁 ( (✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\nপ্রিয় মানুষটার কথা ভাবতে ভাবতে হঠাৎ হেসে ফেলার অনুভূতি টা সুন্দর!'🖤🌸\n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : ＮＩＲＯＢ ᶻ 𝗓 𐰁 ",
    "=== 「𝗣𝗿𝗲𝗳𝗶𝘅 𝐄𝐯𝐞𝐧𝐭」 ===\n --❖-- ＮＩＲＯＢ ᶻ 𝗓 𐰁 ( (✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n মন থেকে ভালোবাসা পূর্ণতা পাক, 💖 নাটকীয় ভালোবাসা থেকে মানুষ মুক্তি পাক!🙂🌸✨🔐\n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : ＮＩＲＯＢ ᶻ 𝗓 𐰁 ",
    "=== 「𝗣𝗿𝗲𝗳𝗶𝘅 𝐄𝐯𝐞𝐧𝐭」 ===\n --❖-- ＮＩＲＯＢ ᶻ 𝗓 𐰁 ( (✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n আমি বদলাইনি  শুধু চুপ করে গেছি 🙂🖤 কারণ কথা বলে লাভ হয় না \n\nযখন মানুষ বুঝতে চায় না! 😅😊 \n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : ＮＩＲＯＢ ᶻ 𝗓 𐰁 ",
    "=== 「𝗣𝗿𝗲𝗳𝗶𝘅 𝐄𝐯𝐞𝐧𝐭」 ===\n --❖-- ＮＩＲＯＢ ᶻ 𝗓 𐰁 ( (✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n অনেক কিছু বলার ছিল, কিন্তু তোমার 'না থাকা' শুনেই থেমে গেছি!💔\n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : ＮＩＲＯＢ ᶻ 𝗓 𐰁 ",
    "=== 「𝗣𝗿𝗲𝗳𝗶𝘅 𝐄𝐯𝐞𝐧𝐭」 ===\n --❖-- ＮＩＲＯＢ ᶻ 𝗓 𐰁 ( (✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n মিথ্যে হেসে বলি, ‘ভালো আছি 😅 \n\n কারণ কেউই জানতে চায় না—আমি আসলেই কেমন আছি! 😁😌\n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : ＮＩＲＯＢ ᶻ 𝗓 𐰁 "
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to get random image URL
function getRandomImageURL() {
  const images = [
    "https://i.postimg.cc/RC2WdgM9/received-781573407532865.jpg",
    "https://i.postimg.cc/vm8TTjv7/received-1163971919108359.jpg",

    "https://i.postimg.cc/YSX9W3X5/received-3664786543817608.jpg",

    "https://i.postimg.cc/FR7KgL87/received-759078849842899.jpg",

"https://i.postimg.cc/26MSH5NT/kakashi.jpg",

"https://i.postimg.cc/L6VzG0N6/received-912842914375425.jpg",

"https://i.postimg.cc/nhcvxYPK/Rin-Nohara-dies.jpg",

"https://i.postimg.cc/cL9fLgpp/received-1264701674653782.jpg",

"https://i.postimg.cc/BvRDxWQN/8b62e6ea-9f65-4352-8937-da11de54db96.jpg",

"https://i.postimg.cc/kGmbpxSb/d2adb93a-a412-4e87-bbbc-e805a8b9ad11.jpg",

"https://i.postimg.cc/prJFbpQ1/received-615057431651453.jpg"
  ];
  return images[Math.floor(Math.random() * images.length)];
}

// Helper to send message with quote + image
async function sendQuoteWithImage(api, event) {
  const quote = getRandomQuote();
  const imageUrl = getRandomImageURL();
  const imgPath = path.join(__dirname, "cache", `start_img_${Date.now()}.jpg`);

  // Ensure cache dir exists
  fs.ensureDirSync(path.join(__dirname, "cache"));

  // Download image
  await new Promise((resolve, reject) => {
    request(imageUrl)
      .pipe(fs.createWriteStream(imgPath))
      .on("finish", resolve)
      .on("error", reject);
  });

  // Send message with attachment
  api.sendMessage({
    body: quote,
    attachment: fs.createReadStream(imgPath)
  }, event.threadID, () => fs.unlinkSync(imgPath));
}
