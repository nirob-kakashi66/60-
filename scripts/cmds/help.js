const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

const catboxImages = [
  "https://files.catbox.moe/hlds7u.mp4",
  "https://files.catbox.moe/c6ujy4.jpg",
  "https://files.catbox.moe/ueiep7.jpg",
  "https://files.catbox.moe/5wytj0.jpg",
  "https://files.catbox.moe/ueiep7.jpg", // Replace or add valid image URLs
  "https://files.catbox.moe/6mckih.mp4"
];

// Split array into n parts evenly
function splitArray(arr, parts = 6) {
  const len = arr.length;
  const out = [];
  let i = 0;
  while (i < len) {
    out.push(arr.slice(i, i + Math.ceil(len / parts)));
    i += Math.ceil(len / parts);
  }
  return out;
}

module.exports = {
  config: {
    name: "help",
    version: "2.0",
    author: "ＮＩＲＯＢ ᶻ 𝗓 𐰁",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "kakashi - BOT help menu, split into 6 pages!",
    },
    longDescription: {
      en: "Shows commands with pastel style and catbox images on 6 pages.",
    },
    category: "info",
    guide: {
      en: "{pn} [1-6]",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const prefix = getPrefix(event.threadID);
    let page = 1;
    if (args.length > 0) {
      const p = parseInt(args[0]);
      if (p >= 1 && p <= 6) page = p;
    }

    const availableCommands = [];
    for (const [name, cmd] of commands) {
      if (cmd.config.role > role) continue;
      availableCommands.push(name);
    }
    availableCommands.sort();

    const splitCommands = splitArray(availableCommands, 6);
    const commandsOnPage = splitCommands[page - 1] || [];

    let msg = `╭──────────── 𝙷𝙴𝙻𝙿 𝙼𝙴𝙽𝚄 ══ Page ${page} ────────╮\n\n`;

    const categories = {};
    for (const cmdName of commandsOnPage) {
      const cmd = commands.get(cmdName) || commands.get(aliases.get(cmdName));
      if (!cmd) continue;
      const cat = cmd.config.category || "Other";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmdName);
    }

    for (const catName of Object.keys(categories)) {
      msg += `♡ ${capitalize(catName)} ♡  \n`;
      msg += categories[catName]
        .map((cmd) => `${prefix}${cmd}`)
        .join("    ") + "\n\n";
    }

    msg += `╰───────────────────────────────╯  \n`;
    msg += `Use "${prefix}help ${page === 6 ? 1 : page + 1}" to see more commands!\n`;
    msg += `𝙳𝚎𝚟: 𝙽𝚒𝚛𝚘𝚋 ꨄ︎\n`;

    const imgUrl = catboxImages[page - 1];
    await message.reply({
      body: msg,
      attachment: await global.utils.getStreamFromURL(imgUrl),
    });
  },
};

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
                                 }
