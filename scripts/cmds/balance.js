const balance = require('../scripts/balanceStorage');

module.exports = {
	config: {
		name: "balance",
		aliases: ["bal"],
		version: "1.0",
		author: "Fixed by NIROB",
		countDown: 5,
		role: 0,
		description: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "check your money or tagged person's"
		},
		category: "economy",
		guide: {
			vi: "{pn} hoặc {pn} @tag",
			en: "{pn} or {pn} @tag"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %1$",
			moneyOf: "%1 đang có %2$"
		},
		en: {
			money: "You have %1$",
			moneyOf: "%1 has %2$"
		}
	},

	onStart: async function ({ message, event, getLang }) {
		if (Object.keys(event.mentions).length > 0) {
			let reply = "";
			for (const uid in event.mentions) {
				const name = event.mentions[uid].replace("@", "");
				const money = balance.get(uid);
				reply += getLang("moneyOf", name, money) + "\n";
			}
			return message.reply(reply);
		}

		const money = balance.get(event.senderID);
		return message.reply(getLang("money", money));
	}
};
