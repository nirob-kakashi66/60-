module.exports = {
  config: {
    name: "font",
    version: "2.2",
    author: "NIROB 🖤",
    countDown: 5,
    role: 1, // VIP role required (change if your VIP role id is different)
    shortDescription: "Stylish font converter",
    longDescription: "Convert your text into various stylish fonts",
    category: "text",
    guide: {
      en: "{pn} list — Show all font styles\n{pn} [number] [text] — Convert your text with selected font"
    }
  },

  onStart: async function ({ event, message, args, usersData }) {
    // Check VIP access: role 1 means VIP users only
    // Adjust this check depending on your framework for roles
    if (this.config.role > 0) {
      // Suppose your usersData has roles: usersData[event.senderID].role
      const userRole = usersData?.[event.senderID]?.role || 0;
      if (userRole < this.config.role) {
        return message.reply("❌ This command is only available for VIP users.");
      }
    }

    const fonts = [
      { name: "𝓒𝓾𝓻𝓼𝓲𝓿𝓮", converter: str => str.replace(/[A-Za-z]/g, c => {
          const base = c === c.toUpperCase() ? 0x1D4D0 : 0x1D4EA;
          return String.fromCodePoint(base + c.toLowerCase().charCodeAt(0) - 97);
      }) },
      { name: "𝐁𝐨𝐥𝐝", converter: str => str.replace(/[A-Za-z]/g, c => {
          const base = c === c.toUpperCase() ? 0x1D400 : 0x1D41A;
          return String.fromCodePoint(base + c.toLowerCase().charCodeAt(0) - 97);
      }) },
      { name: "𝘐𝘵𝘢𝘭𝘪𝘤", converter: str => str.replace(/[A-Za-z]/g, c => {
          const base = c === c.toUpperCase() ? 0x1D434 : 0x1D44E;
          return String.fromCodePoint(base + c.toLowerCase().charCodeAt(0) - 97);
      }) },
      { name: "𝙈𝙤𝙣𝙤𝙨𝙥𝙖𝙘𝙚", converter: str => str.replace(/[A-Za-z]/g, c => {
          const base = 0x1D670;
          return String.fromCodePoint(base + c.toUpperCase().charCodeAt(0) - 65);
      }) },
      { name: "𝙱𝚘𝚕𝚍 𝙼𝚘𝚗𝚘", converter: str => str.replace(/[A-Za-z]/g, c => {
          const base = 0x1D6A8;
          return String.fromCodePoint(base + c.toUpperCase().charCodeAt(0) - 65);
      }) },
      { name: "🅑🅞🅧", converter: str => str.replace(/[A-Za-z]/g, c => {
          return "🅐🅑🅒🅓🅔🅕🅖🅗🅘🅙🅚🅛🅜🅝🅞🅟🅠🅡🅢🅣🅤🅥🅦🅧🅨🅩"[c.toUpperCase().charCodeAt(0) - 65];
      }) },
      { name: "ᑕOOᒪ", converter: str => str.split('').map(c => {
          const map = { N: 'ᑎ', I: 'I', R: 'ᖇ', O: 'O', B: 'ᗷ' };
          return map[c.toUpperCase()] || c;
      }).join('') },
      { name: "ⓒⓘⓡⓒⓛⓔ", converter: str => str.replace(/[A-Za-z]/g, c => {
          return String.fromCodePoint(0x24B6 + c.toUpperCase().charCodeAt(0) - 65);
      }) },
      { name: "🄱🄾🅇🄴🄳", converter: str => str.replace(/[A-Za-z]/g, c => {
          return String.fromCodePoint(0x1F130 + c.toUpperCase().charCodeAt(0) - 65);
      }) },
      { name: "ᴛɪɴʏ", converter: str => str.replace(/[A-Za-z]/g, c => {
          const tiny = {
            a:'ᴀ', b:'ʙ', c:'ᴄ', d:'ᴅ', e:'ᴇ', f:'ғ', g:'ɢ',
            h:'ʜ', i:'ɪ', j:'ᴊ', k:'ᴋ', l:'ʟ', m:'ᴍ', n:'ɴ',
            o:'ᴏ', p:'ᴘ', q:'ǫ', r:'ʀ', s:'s', t:'ᴛ', u:'ᴜ',
            v:'ᴠ', w:'ᴡ', x:'x', y:'ʏ', z:'ᴢ'
          };
          return [...str].map(c => tiny[c.toLowerCase()] || c).join('');
      }) },
      { name: "ＭＯＮＯ　ＦＵＬＬ", converter: str => str.replace(/[A-Za-z]/g, c => {
          return String.fromCharCode(c.charCodeAt(0) + 0xFEE0);
      }) },
      { name: "🅣🅘🅣🅛🅔", converter: str => str.toUpperCase().split('').reverse().join('') },
      { name: "𝔊𝔬𝔱𝔥𝔦𝔠", converter: str => str.replace(/[A-Za-z]/g, c => {
          const base = c === c.toUpperCase() ? 0x1D504 : 0x1D51E;
          return String.fromCodePoint(base + c.toLowerCase().charCodeAt(0) - 97);
      }) },
      { name: "𝖘𝖈𝖆𝖗𝖞", converter: str => str.replace(/[A-Za-z]/g, c => {
          const scary = {
            A:'𝖆', B:'𝖇', C:'𝖈', D:'𝖉', E:'𝖊', F:'𝖋', G:'𝖌', H:'𝖍',
            I:'𝖎', J:'𝖏', K:'𝖐', L:'𝖑', M:'𝖒', N:'𝖓', O:'𝖔', P:'𝖕',
            Q:'𝖖', R:'𝖗', S:'𝖘', T:'𝖙', U:'𝖚', V:'𝖛', W:'𝖜', X:'𝖝',
            Y:'𝖞', Z:'𝖟'
          };
          return [...str].map(c => scary[c.toUpperCase()] || c).join('');
      }) },
      { name: "ɹǝʌǝɹsǝd", converter: str => str.split('').map(c => {
          const flip = {
            a:'ɐ', b:'q', c:'ɔ', d:'p', e:'ǝ', f:'ɟ', g:'ƃ', h:'ɥ',
            i:'ᴉ', j:'ɾ', k:'ʞ', l:'ʃ', m:'ɯ', n:'u', o:'o', p:'d',
            q:'b', r:'ɹ', s:'s', t:'ʇ', u:'n', v:'ʌ', w:'ʍ', x:'x',
            y:'ʎ', z:'z', '.':'˙', ',':'\'', '\'':',', '"':',,',
            '_':'‾', '?':'¿', '!':'¡', '[':']', '(':')', '{':'}',
            ']':'[', ')':'(', '}':'{'
          };
          return flip[c.toLowerCase()] || c;
      }).reverse().join('') }
    ];

    if (!args[0]) {
      return message.reply("❌ Please provide a font number or type `list` to see all fonts.\nExample:\nfont list\nfont 3 Hello");
    }

    if (args[0].toLowerCase() === "list") {
      let listMsg = "🖋️ Available Fonts:\n\n";
      fonts.forEach((f, i) => {
        listMsg += `${i+1}. ${f.name}\n`;
      });
      return message.reply(listMsg);
    }

    const fontIndex = parseInt(args[0], 10);
    if (!fontIndex || fontIndex < 1 || fontIndex > fonts.length) {
      return message.reply("❌ Invalid font number. Use `font list` to see available fonts.");
    }

    // If no text given, default to "NIROB"
    const textToConvert = args.slice(1).join(' ') || "NIROB";

    const converted = fonts[fontIndex - 1].converter(textToConvert);
    return message.reply(converted);
  }
};
