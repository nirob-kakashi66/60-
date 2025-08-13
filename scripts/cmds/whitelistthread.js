const { config } = global.GoatBot;
const { client } = global;
const { writeFileSync } = require("fs-extra");

// Helper function to get thread names
async function getThreadNames(tids, api) {
    const result = [];
    for (const tid of tids) {
        try {
            const info = await api.getThreadInfo(tid);
            result.push({ tid, name: info.threadName });
        } catch {
            result.push({ tid, name: "Unknown" });
        }
    }
    return result;
}

module.exports = {
    config: {
        name: "whitelistthread",
        aliases: ["wlt", "wt"],
        version: "1.7",
        author: "NTKhang (Fixed by nirob)",
        countDown: 5,
        role: 2,
        description: { en: "Add, remove, or manage thread whitelist." },
        category: "owner",
        guide: {
            en: '   {pn} [add | -a | +] [<tid>...]: Add thread(s) to whitelist.\n'
                + '   {pn} [remove | -r | -] [<tid>...]: Remove thread(s) from whitelist.\n'
                + '   {pn} [list | -l]: List all whitelisted threads.\n'
                + '   {pn} [mode | -m] <on|off>: Turn on/off whitelist mode.\n'
                + '   {pn} [mode | -m] noti <on|off>: Turn on/off notification for non-whitelisted threads.'
        }
    },

    langs: {
        en: {
            added: `\n╭─✦✅ | Added %1 thread(s) to whitelist:\n%2`,
            alreadyWLT: `\n╭─✦⚠️ | %1 thread(s) are already whitelisted:\n%2`,
            missingTIDAdd: "⚠️ | Please provide a Thread ID to add to the whitelist.",
            removed: `\n╭─✦✅ | Removed %1 thread(s) from whitelist:\n%2`,
            notAdded: `\n╭─✦❎ | %1 thread(s) were not in the whitelist:\n%2`,
            missingTIDRemove: "⚠️ | Please provide a Thread ID to remove from the whitelist.",
            listWLTs: `╭─✦✨ | Whitelisted Threads (%1):\n%2`,
            turnedOn: "✅ | Whitelist mode has been turned ON. Only whitelisted threads can use the bot.",
            turnedOff: "❎ | Whitelist mode has been turned OFF. All threads can use the bot.",
            turnedOnNoti: "✅ | Notification for non-whitelisted threads has been turned ON.",
            turnedOffNoti: "❎ | Notification for non-whitelisted threads has been turned OFF.",
            invalidCommand: "⚠️ | Invalid command. Please use the guide for correct syntax."
        }
    },

    onStart: async function ({ message, args, event, getLang, api }) {
        switch (args[0]) {
            case "add":
            case "-a":
            case "+": {
                let tids = args.slice(1).filter(arg => !isNaN(arg));
                if (tids.length === 0) tids.push(event.threadID);

                const alreadyWLT = [];
                const addedTIDs = [];
                for (const tid of tids) {
                    if (config.whiteListModeThread.whiteListThreadIds.includes(tid))
                        alreadyWLT.push(tid);
                    else {
                        config.whiteListModeThread.whiteListThreadIds.push(tid);
                        addedTIDs.push(tid);
                    }
                }

                let msg = "";
                if (addedTIDs.length > 0) {
                    const names = await getThreadNames(addedTIDs, api);
                    msg += getLang("added", addedTIDs.length, names.map(({ tid, name }) => `  ├‣ Name: ${name}\n  ╰‣ TID: ${tid}`).join("\n"));
                }
                if (alreadyWLT.length > 0) {
                    msg += getLang("alreadyWLT", alreadyWLT.length, alreadyWLT.map(tid => `  ╰‣ TID: ${tid}`).join("\n"));
                }

                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                return message.reply(msg);
            }

            case "remove":
            case "rm":
            case "-r":
            case "-": {
                let tids = args.slice(1).filter(arg => !isNaN(arg));
                if (tids.length === 0) tids.push(event.threadID);

                const removedTIDs = [];
                const notInWLT = [];
                for (const tid of tids) {
                    if (config.whiteListModeThread.whiteListThreadIds.includes(tid))
                        removedTIDs.push(tid);
                    else
                        notInWLT.push(tid);
                }

                config.whiteListModeThread.whiteListThreadIds = config.whiteListModeThread.whiteListThreadIds.filter(tid => !removedTIDs.includes(tid));

                let msg = "";
                if (removedTIDs.length > 0) {
                    const names = await getThreadNames(removedTIDs, api);
                    msg += getLang("removed", removedTIDs.length, names.map(({ tid, name }) => `  ├‣ Name: ${name}\n  ╰‣ TID: ${tid}`).join("\n"));
                }
                if (notInWLT.length > 0) {
                    msg += getLang("notAdded", notInWLT.length, notInWLT.map(tid => `  ╰‣ TID: ${tid}`).join("\n"));
                }

                writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                return message.reply(msg);
            }

            case "list":
            case "-l": {
                const list = config.whiteListModeThread.whiteListThreadIds;
                if (list.length === 0) return message.reply("The whitelist is currently empty.");
                const names = await getThreadNames(list, api);
                return message.reply(getLang("listWLTs", list.length, names.map(({ tid, name }) => `  ├‣ Name: ${name}\n  ╰‣ TID: ${tid}`).join("\n")));
            }

            case "mode":
            case "m":
            case "-m": {
                const option = args[1];
                const value = args[2];

                if (option === 'noti') {
                    if (value === 'on') {
                        config.whiteListModeThread.noti = true;
                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                        return message.reply(getLang("turnedOnNoti"));
                    } else if (value === 'off') {
                        config.whiteListModeThread.noti = false;
                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                        return message.reply(getLang("turnedOffNoti"));
                    }
                } else {
                    if (option === 'on') {
                        config.whiteListModeThread.enable = true;
                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                        return message.reply(getLang("turnedOn"));
                    } else if (option === 'off') {
                        config.whiteListModeThread.enable = false;
                        writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
                        return message.reply(getLang("turnedOff"));
                    }
                }

                return message.reply(getLang("invalidCommand"));
            }

            default:
                return message.reply(getLang("invalidCommand"));
        }
    }
};
