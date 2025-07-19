 const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "blink",
		version: "1.1",
		author: "NIB",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "",
			en: "blink images"
		},
		longDescription: {
			vi: "",
			en: "generate blinking gifs with profile pictures"
		},
		category: "image",
		guide: "{pn} @mention"
	},

	onStart: async function ({ event, message, usersData }) {
		try {
			const mentionIDs = Object.keys(event.mentions);
			const senderAvatar = await usersData.getAvatarUrl(event.senderID);
			let targetAvatar;

			// Use self if no mentions
			if (mentionIDs.length === 0) {
				targetAvatar = senderAvatar;
			} else {
				targetAvatar = await usersData.getAvatarUrl(mentionIDs[0]);
			}

			// Safety checks
			if (!senderAvatar || !targetAvatar) {
				return message.reply("⚠️ Couldn't fetch one or both avatar URLs.");
			}

			const img = await new DIG.Blink().getImage(150, senderAvatar, targetAvatar);
			if (!img) {
				return message.reply("❌ Image generation failed.");
			}

			const pathSave = `${__dirname}/tmp/Blink.gif`;
			await fs.writeFileSync(pathSave, Buffer.from(img));

			message.reply({
				body: "✨ Blink Generated!",
				attachment: fs.createReadStream(pathSave)
			}, () => fs.unlinkSync(pathSave));
		} catch (err) {
			console.error("❌ Blink command error:", err);
			message.reply("❌ An error occurred while creating the blink image.");
		}
	}
};
