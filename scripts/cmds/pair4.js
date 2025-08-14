const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require("path");

module.exports = {
  config: {
    name: "pair4",
    author: 'Nyx x Ariyan  modified by NIROB',
    category: "TOOLS"
  },

  onStart: async function ({ api, event, usersData }) {
    try {
      const senderData = await usersData.get(event.senderID);
      const senderName = senderData.name;
      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData.userInfo;

      const myData = users.find(user => user.id === event.senderID);
      if (!myData || !myData.gender) {
        return api.sendMessage("❌ Undefined gender, cannot find match.", event.threadID, event.messageID);
      }

      const myGender = myData.gender.toUpperCase();
      let matchCandidates = [];

      if (myGender === "MALE") {
        matchCandidates = users.filter(user => user.gender === "FEMALE" && user.id !== event.senderID);
      } else if (myGender === "FEMALE") {
        matchCandidates = users.filter(user => user.gender === "MALE" && user.id !== event.senderID);
      } else {
        return api.sendMessage("❌ Undefined gender, cannot find match.", event.threadID, event.messageID);
      }

      if (matchCandidates.length === 0) {
        return api.sendMessage("😔 No suitable match found in the group.", event.threadID, event.messageID);
      }

      const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
      const matchName = selectedMatch.name;
      const lovePercentage = Math.floor(Math.random() * 100) + 1;

      // Lovely notes (bold kawaii style)
      const notes = [
        "💖 𝓨𝓸𝓾 𝓪𝓻𝓮 𝓶𝔂 𝓼𝓾𝓷𝓼𝓱𝓲𝓷𝓮! 🌸",
        "💞 𝓔𝓿𝓮𝓻𝔂 𝓭𝓪𝔶 𝔀𝓲𝓽𝓱 𝔂𝓸𝓾 𝓲𝓼 𝓪 𝓬𝓱𝓮𝓻𝓲𝓼𝓱! 💫",
        "🌷 𝓨𝓸𝓾’𝓻𝓮 𝓶𝔂 𝓬𝓾𝓽𝓮 𝓵𝓲𝓽𝓽𝓵𝓮 𝓽𝓻𝓮𝓪𝓼𝓾𝓻𝓮! 💖",
        "💌 𝓜𝔂 𝓱𝓮𝓪𝓻𝓽 𝓫𝓮𝓪𝓽𝓼 𝓯𝓸𝓻 𝔂𝓸𝓾! 🌸",
        "✨ 𝓨𝓸𝓾 𝓶𝓪𝓴𝓮 𝓶𝔂 𝔀𝓸𝓻𝓵𝓭 𝓫𝓻𝓲𝓰𝓱𝓽! 💞"
      ];
      const lovelyNote = notes[Math.floor(Math.random() * notes.length)];

      // Canvas setup
      const width = 800, height = 400;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      const background = await loadImage("https://i.postimg.cc/ZqqqQ1x2/Picsart-25-08-14-21-50-43-048.jpg");
      const senderAvatar = await loadImage(await usersData.getAvatarUrl(event.senderID));
      const matchAvatar = await loadImage(await usersData.getAvatarUrl(selectedMatch.id));

      ctx.drawImage(background, 0, 0, width, height);

      // Draw avatars
      ctx.drawImage(senderAvatar, 80, 100, 150, 150);
      ctx.drawImage(matchAvatar, width - 230, 100, 150, 150);

      const outputPath = path.join(__dirname, 'pair_output.png');
      const out = fs.createWriteStream(outputPath);
      const stream = canvas.createPNGStream();
      stream.pipe(out);

      out.on('finish', () => {
        const message = 
`🄷🄴🅈 🄻🄾🅅🄴🄻🅈 🄿🄰🄸🅁 💖
@${senderName} ＆ @${matchName}

💖 𝐌𝐚𝐭𝐜𝐡 𝐑𝐚𝐭𝐞: ${lovePercentage}%

❝ ${lovelyNote} ❞
🌸💫`;

        api.sendMessage({
          body: message,
          mentions: [
            { tag: senderName, id: event.senderID },
            { tag: matchName, id: selectedMatch.id }
          ],
          attachment: fs.createReadStream(outputPath)
        }, event.threadID, () => fs.unlinkSync(outputPath), event.messageID);
      });

    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ An error occurred: " + error.message, event.threadID, event.messageID);
    }
  }
};
