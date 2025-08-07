const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pair3",
    aliases: [],
    version: "1.1-VIP",
    author: "OTINXSANDIP",
    countDown: 5,
    role: 0,
    shortDescription: "Pairing command for VIPs.",
    longDescription: "Pairs you with another user in the group. VIP only.",
    category: "love",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, threadsData, usersData, message }) {
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

    const senderID_check = event.senderID;

    const isVip = vipData.some(user =>
      user.uid === senderID_check && (user.expire === 0 || user.expire > Date.now())
    );

    if (!isVip) {
      return message.reply("❌ | Ei command er control Owner er kache ! Tui ekhono VIP list e nai, !vip try kor !! 💡");
    }

    const { threadID, messageID, senderID } = event;
    const { participantIDs } = await api.getThreadInfo(threadID);
    const botID = api.getCurrentUserID();
    const listUserID = participantIDs.filter(ID => ID != botID && ID != senderID);

    if (listUserID.length < 1) {
      return message.reply("There are no other users in this group to pair with!");
    }

    const id = listUserID[Math.floor(Math.random() * listUserID.length)];
    const name1 = (await usersData.get(senderID)).name;
    const name2 = (await usersData.get(id)).name;
    const tle = Math.floor(Math.random() * 101);

    // Mentions and tag string building
    const tagString = `🥰Successful pairing!\n💌Wish you two hundred years of happiness\n💕Double ratio: ${tle}%\n👉 ${name1} 💓 ${name2}`;

    const mentions = [
      { id: senderID, tag: name1 },
      { id: id, tag: name2 }
    ];

    // Download profile pictures and gif
    const avtPath1 = path.join(__dirname, "cache", "avt.png");
    const avtPath2 = path.join(__dirname, "cache", "avt2.png");
    const gifPath = path.join(__dirname, "cache", "giflove.gif");

    const avatar1 = (await axios.get(`https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(avtPath1, Buffer.from(avatar1, "utf-8"));

    const avatar2 = (await axios.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(avtPath2, Buffer.from(avatar2, "utf-8"));

    const gifLove = (await axios.get("https://i.ibb.co/y4dWfQq/image.gif", { responseType: "arraybuffer" })).data;
    fs.writeFileSync(gifPath, Buffer.from(gifLove, "utf-8"));

    const attachments = [
      fs.createReadStream(avtPath1),
      fs.createReadStream(gifPath),
      fs.createReadStream(avtPath2)
    ];

    return api.sendMessage({
      body: tagString,
      mentions,
      attachment: attachments
    }, threadID, messageID);
  }
};
