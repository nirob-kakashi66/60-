 const axios = require("axios");

module.exports = {
  config: {
    name: "dice",
    aliases: ["roll", "dice"],
    version: "3.1",
    author: "Modified ＮＩＲＯＢ ᶻ 𝗓 𐰁",
    countDown: 5,
    role: 0,
    shortDescription: "Bet & compete in a dice roll!",
    longDescription: "Rolls a dice against a random user with balance. Win double your bet!",
    category: "game",
    guide: "{pn} <bet>"
  },

  onStart: async function ({ api, event, usersData, args }) {
    const senderID = event.senderID;
    const { threadID, messageID } = event;
    const name1 = (await usersData.get(senderID)).name;

    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet < 50) {
      return api.sendMessage("⚠️ 𝙋𝙡𝙚𝙖𝙨𝙚 𝙚𝙣𝙩𝙚𝙧 𝙖 𝙫𝙖𝙡𝙞𝙙 𝙗𝙚𝙩 (𝙢𝙞𝙣𝙞𝙢𝙪𝙢 𝟓𝟎 𝙘𝙤𝙞𝙣𝙨).\n📌 𝙀𝙭𝙖𝙢𝙥𝙡𝙚: !dice 100", threadID, messageID);
    }

    const userBalance = (await usersData.get(senderID)).money || 0;
    if (userBalance < bet) {
      return api.sendMessage(`❌ 𝙉𝙤𝙩 𝙚𝙣𝙤𝙪𝙜𝙝 𝙘𝙤𝙞𝙣𝙨.\n💰 𝙔𝙤𝙪𝙧 𝙗𝙖𝙡𝙖𝙣𝙘𝙚: ${userBalance} 𝙘𝙤𝙞𝙣𝙨`, threadID, messageID);
    }

    // Filter valid opponents with balance
    const threadInfo = await api.getThreadInfo(threadID);
    const allParticipants = threadInfo.participantIDs.filter(id => id !== senderID && id !== api.getCurrentUserID());

    const validOpponents = [];

    for (const id of allParticipants) {
      const userData = await usersData.get(id);
      if (userData.money && userData.money > 0) {
        validOpponents.push(id);
      }
    }

    if (validOpponents.length === 0) {
      return api.sendMessage("⚠️ 𝙉𝙤 𝙫𝙖𝙡𝙞𝙙 𝙤𝙥𝙥𝙤𝙣𝙚𝙣𝙩𝙨 𝙛𝙤𝙪𝙣𝙙 (𝙤𝙣𝙡𝙮 𝙥𝙚𝙤𝙥𝙡𝙚 𝙬𝙞𝙩𝙝 𝙗𝙖𝙡𝙖𝙣𝙘𝙚 𝙘𝙖𝙣 𝙥𝙡𝙖𝙮).", threadID, messageID);
    }

    const opponentID = validOpponents[Math.floor(Math.random() * validOpponents.length)];
    const name2 = (await usersData.get(opponentID)).name;

    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const diceEmoji = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    let result = `🎲 𝑫𝒊𝒄𝒆 𝑩𝒂𝒕𝒕𝒍𝒆 🎲\n\n`;
    result += `👤 ${name1}: ${diceEmoji[roll1 - 1]} (${roll1})\n`;
    result += `🆚\n`;
    result += `👤 ${name2}: ${diceEmoji[roll2 - 1]} (${roll2})\n\n`;

    await usersData.set(senderID, { money: userBalance - bet });

    if (roll1 > roll2) {
      const reward = bet * 2;
      const senderCurrent = (await usersData.get(senderID)).money;
      await usersData.set(senderID, { money: senderCurrent + reward });

      result += `🏆 𝑾𝒊𝒏𝒏𝒆𝒓: ${name1}!\n🎁 𝒀𝒐𝒖 𝒘𝒐𝒏 +${reward} 𝒄𝒐𝒊𝒏𝒔!`;
    } else if (roll2 > roll1) {
      const opponentBal = (await usersData.get(opponentID)).money || 0;
      await usersData.set(opponentID, { money: opponentBal + bet });

      result += `🏆 𝑾𝒊𝒏𝒏𝒆𝒓: ${name2}\n😢 𝒀𝒐𝒖 𝒍𝒐𝒔𝒕 ${bet} 𝒄𝒐𝒊𝒏𝒔.\n💸 𝑻𝒓𝒂𝒏𝒔𝒇𝒆𝒓𝒓𝒆𝒅 𝒕𝒐 ${name2}`;
    } else {
      const currentMoney = (await usersData.get(senderID)).money;
      await usersData.set(senderID, { money: currentMoney + bet });
      result += `🤝 𝑰𝒕'𝒔 𝒂 𝒕𝒊𝒆!\n💸 𝑩𝒆𝒕 𝒓𝒆𝒇𝒖𝒏𝒅𝒆𝒅.`;
    }

    const finalBalance = (await usersData.get(senderID)).money;
    result += `\n\n💰 𝑪𝒖𝒓𝒓𝒆𝒏𝒕 𝒃𝒂𝒍𝒂𝒏𝒄𝒆: ${finalBalance} 𝒄𝒐𝒊𝒏𝒔`;

    return api.sendMessage(result, threadID, messageID);
  }
};
