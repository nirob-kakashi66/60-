const axios = require("axios");
const noobs = 'xyz';

module.exports = {
  config: {
    name: "sing",
    version: "1.2",
    author: "Fahim_Noob",
    countDown: 5,
    role: 0,
    description: {
      en: "Plays a music track from the given URL."
    },
    category: "music",
    guide: {
      en: "Type the command followed by the song name to play the music."
    }
  },
  langs: {
    en: {
      syntaxError: "Please provide a valid song name!",
      fetchError: "Error occurred while fetching the song."
    }
  },

  onStart: async function ({ message, event, args, getLang, api }) {
    const songName = args.join(" ");
    if (!songName) return message.reply(getLang('syntaxError'));

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    try {
      const url = `https://smfahim.${noobs}/ytb/audio?search=${encodeURIComponent(songName)}`;
      const { data: { data: { link, title } } } = await axios.get(url);

      await message.reply({
        body: title,
        attachment: await global.utils.getStreamFromURL(link, "music.mp3")
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

    } catch (error) {
      console.error(error);
      message.reply(getLang('fetchError'));
    }
  }
};
