module.exports = {
  config: {
    name: "autokick",
    aliases: ["autokicklink", "autokickon"],
    version: "1.0",
    author: "ＮＩＲＯＢ ᶻ 𝗓 𐰁",
    role: 1,
    category: "Owner",
    shortDescription: "Auto kick user who sends link",
    longDescription: "Enable or disable auto-kick when users send links in group",
    guide: "{pn} on | off"
  },

  onStart: async function ({ message, event, threadsData, args }) {
    const status = args[0];

    if (!["on", "off"].includes(status)) {
      return message.reply("⚠️ Use: /autokick on or /autokick off");
    }

    const enable = status === "on";
    const threadData = await threadsData.get(event.threadID);
    threadData.data.autoKickLink = enable;
    await threadsData.set(event.threadID, threadData);

    return message.reply(
      enable
        ? "✅ Auto-kick for links has been enabled in this group."
        : "❌ Auto-kick for links has been disabled in this group."
    );
  }
};
