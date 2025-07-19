const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "ig",
    version: "1.2",
    author: "MR᭄﹅ MAHABUB﹅ メꪜ",
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
    "=== 「𝗣𝗿𝗲𝗳𝗶𝘅 𝐄𝐯𝐞𝐧𝐭」 ===\n --❖-- ＮＩＲＯＢ ᶻ 𝗓 𐰁 ( (✷‿✷) --❖--\n✢━━━━━━━━━━━━━━━✢\n\n মন থেকে ভালোবাসা পূর্ণতা পাক, 💖 নাটকীয় ভালোবাসা থেকে মানুষ মুক্তি পাক!🙂🌸✨🔐\n\n✢━━━━━━━━━━━━━━━✢\n𝐂𝐫𝐞𝐚𝐭𝐨𝐫 : ＮＩＲＯＢ ᶻ 𝗓 𐰁 "
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Function to get random image URL
function getRandomImageURL() {
  const images = [
    "https://i.postimg.cc/L4Cx5RKH/9e67645f927eaae0ba18f19b05622eac.jpg",
    "https://i.postimg.cc/7YXT11nD/780eb0e434ce5ca92e863a92e6cb27cf.jpg",

    "https://i.postimg.cc/1Xsfw4gf/2d1bcd832d2efb496e53cb45190e5325.jpg",

    "https://i.postimg.cc/ryjp7V0N/58137f27ceebf0482a58875d6ded3c1c.jpg",

"https://i.postimg.cc/KvVmyRZB/1552cbe4d268c5f3a92f8ce0188f9fe7.jpg",

"https://i.postimg.cc/L5WFRbM2/b68323d41ab7df1274342dd194292ede.jpg",

"https://i.postimg.cc/nLxbHmNj/456ed64f3c38f3008f5f30f678563409.jpg",

"https://i.postimg.cc/KYxwX2gt/95bf51e4d462707bf1557bbc47694849.jpg",

"https://i.postimg.cc/g2mbpRCw/2bb146f811030e9a91b6654ac23101d1.jpg",

"https://i.postimg.cc/tRxKV2yZ/98b0af95a9349c7705b7febf884e2fad.jpg",

"https://i.postimg.cc/rwQ3LHGb/d13da3cb14a9630bf859795c26a2c972.jpg"
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
