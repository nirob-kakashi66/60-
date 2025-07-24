module.exports = {
  config: {
    name: "dice",
    aliases: [],
    version: "1.0",
    author: "NIROB",
    countDown: 5,
    role: 0,
    description: "Roll a dice and compete with the bot!",
    category: "games",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, usersData }) {
    const { threadID, messageID, senderID } = event;

    const user = await usersData.get(senderID);
    const userRoll = Math.floor(Math.random() * 6) + 1;
    const botRoll = Math.floor(Math.random() * 6) + 1;

    // Optional: Dice emoji mapping
    const diceEmoji = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    let result = `🎲 You rolled: ${diceEmoji[userRoll - 1]} (${userRoll})\n🤖 Bot rolled: ${diceEmoji[botRoll - 1]} (${botRoll})\n`;

    if (userRoll > botRoll) {
      const winAmount = 5000000;
      await usersData.set(senderID, { money: user.money + winAmount });
      result += `✅ You won! +$${(winAmount / 1000000).toFixed(1)}M`;
    } else if (userRoll < botRoll) {
      const loseAmount = 3000000;
      await usersData.set(senderID, { money: user.money - loseAmount });
      result += `❌ You lost! -$${(loseAmount / 1000000).toFixed(1)}M`;
    } else {
      result += "🔁 It's a tie! No money gained or lost.";
    }

    api.sendMessage(result, threadID, messageID);
  }
};
