 const axios = require('axios');
const fs = require('fs');
module.exports = {
  config: {
    name: 'sing',
    category: 'youtube song downloader',
    author: 'Romim',
  },

  onStart: async ({ message, args }) => {
    const query = args.join(' ');
    if (!query) return message.reply("Please provide a search query!");

    try {
      const searchResponse = await axios.get(`https://www.noobz-api.rf.gd/api/yts?name=${query}`);
      const data = searchResponse.data.data.slice(0, 6);
      const thumbnails = await Promise.all(
        data.map((item) => global.utils.getStreamFromUrl(item.thumbnail))
      );

      let body = '';
      data.forEach((item, index) => {
        body += `${index + 1}. ${item.name}\nDuration: ${item.dur}\n\n`;
      });

      const reply = await message.reply({
        body: `Search Results:\n\n${body}\nPlease select a number (1-6).`,
        attachment: thumbnails,
      });

      global.GoatBot.onReply.set(reply.messageID, {
        commandName: 'sing',
        messageID: reply.messageID,
        result: data,
      });
    } catch (error) {
      message.reply(`Error: ${error.message}`);
    }
  },

  onReply: async ({ Reply, message, event }) => {
    const { result, messageID } = Reply;
    const { senderID, body } = event;

    const choice = parseInt(body.trim());
    if (isNaN(choice) || choice < 1 || choice > 6) {
      return message.reply("Please select a valid number between 1 and 5.");
    }

    const selectedVideo = result[choice - 1];
    if (!selectedVideo) {
      return message.reply("Invalid choice. Please try again.");
    }
    message.unsend(messageID);

    try {
      const downloadResponse = await axios.get(`https://www.noobz-api.rf.gd/api/ytmp3?query=${selectedVideo.id}&format=mp3`);
      const songUrl = downloadResponse.data.data;
      const filePath = __dirname + `/cache/${selectedVideo.name}.mp3`;
      fs.writeFileSync(filePath, Buffer.from((await axios.get(songUrl, { responseType: "arraybuffer" })).data, "binary"))
      const tinyUrlResponse = await axios.get(`https://tinyurl.com/api-create.php?url=${songUrl}`);
      const tinyUrl = tinyUrlResponse.data;

      await message.reply({
        body: `Here's your requested song: ${selectedVideo.name}\nDuration: ${selectedVideo.dur}\nDownload Link: ${tinyUrl}`,
        attachment: fs.createReadStream(filePath)
      }, () => fs.unlinkSync(filePath));
    } catch (error) {
      message.reply("Error: Unable to fetch the song. Please try again later.");
    }
  },
};
