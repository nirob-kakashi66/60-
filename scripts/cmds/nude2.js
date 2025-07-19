module.exports = {
  config: {
    name: "nude",
    author: "Romim",
    category: "Nude-pic"
  },
  onStart: async function ({ api, event }) {
    try {
      const axios = require('axios');
      const { threadID, messageID } = event;      
      const romim = await axios.get("https://www.x-noobs-api.000.pe/nude?uid=100085332887575");
      const { type, url } = romim.data;
      const response = await axios.get(url, { responseType: 'stream' });
      api.sendMessage({
        body: `nude type: ${type}`,
        attachment: response.data
      }, threadID, messageID);

    } catch (e) {
      api.sendMessage(e.message, threadID, messageID);
    }
  }
}
