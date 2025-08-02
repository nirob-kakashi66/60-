module.exports = {
  config: {
    name: "tag",
    version: "1.1",
    author: "Arijit",
    countDown: 3,
    role: 0,
    shortDescription: "Tag mentioned or replied user",
    longDescription: "Tag a user by mention or by replying to their message with an optional message.",
    category: "utility",
    guide: {
      en: "{pn} [@mention or reply] [optional message]"
    }
  },

  onStart: async function ({ api, event, args }) {
    let targetID;
    let tagName;

    // Replied user
    if (event.type === "message_reply") {
      targetID = event.messageReply.senderID;
      tagName = event.messageReply.senderID;
    }

    // Mentioned user
    else if (Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
      tagName = event.mentions[targetID];
    }

    // No target
    else {
      return api.sendMessage("❌ | Please mention a user or reply to someone's message.", event.threadID);
    }

    // Message body
    const customMsg = args.join(" ") || "👋 Hey there!";
    const msg = {
      body: customMsg,
      mentions: [{
        tag: typeof tagName === "string" ? tagName : "User",
        id: targetID
      }]
    };

    return api.sendMessage(msg, event.threadID);
  }
};
