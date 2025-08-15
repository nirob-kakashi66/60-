const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.0.1",
  permission: 0,
  credits: "IMRAN (fixed)",
  description: "Chat with a GPT-4.1 AI bot (with reply support)",
  prefix: false,
  category: "chatgpt",
  usages: "ai [your message]",
  cooldowns: 5
};

const cuteReplies = [
  "Hey there! 👋 How can I brighten your day?",
  "Hello! Let me know how I can help you today.",
  "Hi! I’m here if you need anything!",
  "What’s up? How can I assist you today?",
  "Hey hey! Need help with something?",
  "Yo! Let’s get started!",
  "Welcome aboard! 😊 Ready when you are.",
  "Glad you're here! Tell me how I can make things easier.",
  "Hi there! Whether fun or help — I’m just one message away.",
  "Nice to see you here! Let’s do something awesome together."
];

const replyMap = new Map();

module.exports.onStart = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!query) {
    const reply = cuteReplies[Math.floor(Math.random() * cuteReplies.length)];
    return api.sendMessage(reply, threadID, (err, info) => {
      if (!err) {
        if (!replyMap.has(threadID)) replyMap.set(threadID, []);
        replyMap.get(threadID).push({ messageID: info.messageID, author: senderID });
      }
    }, messageID);
  }

  try {
    const apiUrl = `https://kaiz-apis.gleeze.com/api/kaiz-ai?ask=${encodeURIComponent(query)}&uid=${senderID}&apikey=6c9542b5-7070-48cb-b325-80e1ba65a451`;
    const response = await axios.get(apiUrl);
    const botReply = response.data?.response || "Hmm, I didn’t catch that. Try asking something else!";

    api.sendMessage(botReply, threadID, (err, info) => {
      if (!err) {
        if (!replyMap.has(threadID)) replyMap.set(threadID, []);
        replyMap.get(threadID).push({ messageID: info.messageID, author: senderID });
      }
    }, messageID);
  } catch (e) {
    console.error("GPT API Error:", e.message);
    api.sendMessage("❌ Something went wrong while contacting GPT service.", threadID, messageID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  if (!messageReply?.messageID || !replyMap.has(threadID)) return;

  const replies = replyMap.get(threadID);
  const found = replies.find(item => item.messageID === messageReply.messageID && item.author === senderID);

  if (!found || !body) return;

  try {
    const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4.1?ask=${encodeURIComponent(body)}&uid=${senderID}&apikey=6c9542b5-7070-48cb-b325-80e1ba65a451`;
    const response = await axios.get(apiUrl);
    const botReply = response.data?.response || "Sorry, I didn’t quite get that. Try again!";

    api.sendMessage(botReply, threadID, (err, info) => {
      if (!err) replies.push({ messageID: info.messageID, author: senderID });
    }, messageID);
  } catch (e) {
    console.error("GPT API Error:", e.message);
    api.sendMessage("❌ Error contacting GPT service.", threadID, messageID);
  }
};
