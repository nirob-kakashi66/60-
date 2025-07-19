const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "tikvd",
		version: "2.0",
		role: 0,
		countDown: 0,
		author: "ArYAN",
		shortDescription: "tiktok search videos",
		hasPrefix: false,
		category: "MEDIA",
		aliases: ["tik"],
		usage: "[Tiktok <search>]",
		cooldown: 5,
	},

	onStart: async function({ api, event, args }) {
		try {
			api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
			const searchQuery = args.join(" ");
			if (!searchQuery) {
				api.sendMessage("Usage: tiktok <search text>", event.threadID);
				return;
			}

			const response = await axios.get(`https://aryan-noobs-apis.onrender.com/aryan/tiksearch?search=${encodeURIComponent(searchQuery)}`);
			const videos = response.data.data.videos;

			if (!videos || videos.length === 0) {
				api.sendMessage("No videos found for the given search query.", event.threadID);
				return;
			}

			const videoData = videos[0];
			const videoUrl = videoData.play;

			const message = ` 🎵 𝗧𝗜𝗞𝗧𝗢𝗞\n\n𝗉𝗈𝗌𝗍 𝖻𝗈𝗒 ➪ ${videoData.author.nickname}\n𝖴𝗌𝖾𝗋𝖭𝖺𝗆𝖾 ➪ ${videoData.author.unique_id}`;
			api.setMessageReaction("✅", event.messageID, () => {}, true);

			const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
			const writer = fs.createWriteStream(filePath);

			const videoResponse = await axios({
				method: 'get',
				url: videoUrl,
				responseType: 'stream'
			});

			videoResponse.data.pipe(writer);

			writer.on('finish', () => {
				api.sendMessage(
					{ body: message, attachment: fs.createReadStream(filePath) },
					event.threadID,
					() => fs.unlinkSync(filePath)
				);
			});
		} catch (error) {
			console.error('Error:', error);
			api.sendMessage("An error occurred while processing the request.", event.threadID);
		}
	}
};
