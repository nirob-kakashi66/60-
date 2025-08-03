const cooldowns = new Map();

module.exports = {
  config: {
    name: "slot",
    version: "3.2",
    author: "Arijit",
    countDown: 12,
    shortDescription: {
      en: "slot game 🙂",
    },
    longDescription: {
      en: "Try your luck in a slot game",
    },
    category: "game",
  },

  langs: {
    en: {
      invalid_amount: "𝗣𝗹𝗲𝗮𝘀𝗲 𝗲𝗻𝘁𝗲𝗿 𝗮 𝘃𝗮𝗹𝗶𝗱 𝗮𝗺𝗼𝘂𝗻𝘁 😿💅",
      not_enough_money: "𝗣𝗹𝗲𝗮𝘀𝗲 𝗰𝗵𝗲𝗰𝗸 𝘆𝗼𝘂𝗿 𝗯𝗮𝗹𝗮𝗻𝗰𝗲 🤡",
      max_limit: "❌ | The maximum bet amount is 100M.",
      limit_reached: "❌ | 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐫𝐞𝐚𝐜𝐡𝐞𝐝 𝐲𝐨𝐮𝐫 𝐬𝐥𝐨𝐭 𝐥𝐢𝐦𝐢𝐭. 𝐓𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐢𝐧 %1.",
      jackpot_message: ">🎀\n𝐉𝐚𝐜𝐤𝐩𝐨𝐭! 𝐘𝐨𝐮 𝐰𝐨𝐧 $%1 𝐰𝐢𝐭𝐡 𝐭𝐡𝐫𝐞𝐞 ❤ 𝐬𝐲𝐦𝐛𝐨𝐥𝐬, 𝐁𝐚𝐛𝐲!\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [ %2 | %3 | %4 ]",
      win_message: ">🎀\n• 𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐰𝐨𝐧 $%1\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [ %2 | %3 | %4 ]",
      lose_message: ">🎀\n• 𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭 $%1\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [ %2 | %3 | %4 ]",
    },
  },

  onStart: async function ({ args, message, event, usersData, getLang }) {
    const { senderID } = event;
    const amount = parseInt(args[0]);

    const now = Date.now();
    const limit = 20;
    const interval = 60 * 60 * 1000;

    if (!cooldowns.has(senderID)) {
      cooldowns.set(senderID, []);
    }

    const timestamps = cooldowns.get(senderID).filter(ts => now - ts < interval);
    if (timestamps.length >= limit) {
      const nextUse = new Date(Math.min(...timestamps) + interval);
      const diff = nextUse - now;
      const hours = Math.floor(diff / (60 * 60 * 1000));
      const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
      return message.reply(getLang("limit_reached", `${hours}𝐡 ${minutes}𝐦`));
    }

    if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalid_amount"));
    if (amount > 100000000) return message.reply(getLang("max_limit"));

    const userData = await usersData.get(senderID);
    if (amount > userData.money) return message.reply(getLang("not_enough_money"));

    const result = generateResult();
    const winnings = calculateWinnings(result, amount);

    await usersData.set(senderID, {
      money: userData.money + winnings,
      data: userData.data,
    });

    cooldowns.set(senderID, [...timestamps, now]);
    return message.reply(formatResult(result, winnings, getLang));
  }
};

function generateResult() {
  const slots = ["💚", "💛", "💙", "💜", "🤎", "🤍", "❤️"];
  const r = Math.random() * 100;

  if (r < 5) return ["❤️", "❤️", "❤️"]; // Jackpot
  if (r < 20) {
    const symbol = slots.filter(e => e !== "❤️")[Math.floor(Math.random() * 6)];
    return [symbol, symbol, symbol]; // 5x
  }
  if (r < 65) {
    const s = slots[Math.floor(Math.random() * slots.length)];
    const r2 = slots[Math.floor(Math.random() * slots.length)];
    return [s, s, r2]; // 3x
  }
  while (true) {
    const [a, b, c] = [randomEmoji(slots), randomEmoji(slots), randomEmoji(slots)];
    if (!(a === b && b === c)) return [a, b, c]; // Loss
  }
}

function calculateWinnings([a, b, c], bet) {
  if (a === b && b === c) {
    if (a === "❤️") return bet * 10;
    return bet * 5;
  }
  if (a === b || b === c || a === c) return bet * 3;
  return -bet;
}

function formatResult([a, b, c], winnings, getLang) {
  const formatted = formatMoney(Math.abs(winnings));
  if (a === b && b === c && a === "❤️")
    return getLang("jackpot_message", formatted, a, b, c);
  if (winnings > 0)
    return getLang("win_message", formatted, a, b, c);
  return getLang("lose_message", formatted, a, b, c);
}

function randomEmoji(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatMoney(amount) {
  if (amount >= 1e12) return (amount / 1e12).toFixed(2) + "𝗧";
  if (amount >= 1e9) return (amount / 1e9).toFixed(2) + "𝗕";
  if (amount >= 1e6) return (amount / 1e6).toFixed(2) + "𝐌";
  if (amount >= 1e3) return (amount / 1e3).toFixed(2) + "𝗞";
  return amount.toString();
        }
