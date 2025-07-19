module.exports = {
config: {
name: "Kakashi2",
version: "1.0",
author: "AceGun",
countDown: 5,
role: 0,
shortDescription: "no prefix",
longDescription: "no prefix",
category: "no prefix",
},

onStart: async function(){}, 
onChat: async function({ event, message, getLang }) {
if (event.body && event.body.toLowerCase() === "kakashi2") {
return message.reply({
body: " 「【𝙷𝙴𝙻𝙻𝙾 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴】⦿\n \n\n「nirob】\n─ Here is KAKASHI ☠️」",
attachment: await global.utils.getStreamFromURL("https://i.imgur.com/QbiVGYW.mp4")
});
}
}
}
