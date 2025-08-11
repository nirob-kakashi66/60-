// file: scripts/events/setBalanceOnStart.js
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "setBalanceOnStart",
    version: "1.0",
    author: "NIROB",
    role: 2,
    description: "Set all user balance to 5M on bot start",
    category: "system"
  },

  onLoad: async function ({ usersData }) {
    const allUsers = await usersData.getAll();
    const fixedAmount = 5000000;

    for (let user of allUsers) {
      if (!user.data) user.data = {};
      user.data.money = fixedAmount;
      await usersData.set(user.userID, user.data);
    }

    console.log(`✅ All user balances set to ${fixedAmount}`);
  }
};
