const LINK_REGEX = /(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch|youtu\.be|youtube\.com|t\.me|telegram\.me|wa\.me|bit\.ly|tiktok\.com|discord\.gg|linktr\.ee|x\.com|twitter\.com)/i;

module.exports = {
  config: {
    name: "autokick",
    version: "1.0",
    author: "Romim",
    description: "Auto kick users who send links if enabled",
    category: "events"
  },

  onChat: async function ({ event, api, threadsData }) {
    const { threadID, senderID, body, isGroup } = event;

    if (!isGroup || !body) return;
    const threadData = await threadsData.get(threadID);
    const isEnabled = threadData?.data?.autoKickLink;

    if (!isEnabled) return;
    if (!LINK_REGEX.test(body)) return;

    try {
      await api.removeUserFromGroup(senderID, threadID);
      console.log(`✅ Removed user ${senderID} for sending link`);
    } catch (err) {
      console.log("❌ Failed to kick user:", err);
      api.sendMessage("⚠️ Couldn't remove user who shared a link (maybe not admin).", threadID);
    }
  }
};
