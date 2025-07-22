const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const { getStreamFromURL, shortenURL, randomString } = global.utils;

function loadAutoLinkStates() {
  try {
    const data = fs.readFileSync("autolink.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function saveAutoLinkStates(states) {
  fs.writeFileSync("autolink.json", JSON.stringify(states, null, 2));
}

let autoLinkStates = loadAutoLinkStates();

module.exports = {
  threadStates: {},
  config: {
    name: 'autolink',
    version: '3.1',
    author: 'Vex_Kshitiz + Updated by Nirob',
    countDown: 5,
    role: 0,
    shortDescription: 'Auto video downloader (kawaii edition)',
    longDescription: '',
    category: 'media',
    guide: {
      en: '{p}{n}',
    }
  },
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!autoLinkStates[threadID]) {
      autoLinkStates[threadID] = 'on'; 
      saveAutoLinkStates(autoLinkStates);
    }

    if (!this.threadStates[threadID]) {
      this.threadStates[threadID] = {};
    }

    const body = event.body.toLowerCase();
    if (body.includes('autolink off')) {
      autoLinkStates[threadID] = 'off';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage("🌸 AutoLink is now turned off in this chat. Stay cozy! 💤", threadID, event.messageID);
    } else if (body.includes('autolink on')) {
      autoLinkStates[threadID] = 'on';
      saveAutoLinkStates(autoLinkStates);
      api.sendMessage("✨ AutoLink is now turned on in this chat! Time to catch some cutie videos! 💫", threadID, event.messageID);
    }
  },

  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    const linkMatch = this.checkLink(event.body);

    if (linkMatch) {
      const { url } = linkMatch;
      console.log(`Attempting to download from URL: ${url}`);
      if (autoLinkStates[threadID] === 'on' || !autoLinkStates[threadID]) {
        this.downLoad(url, api, event);
      }
      api.setMessageReaction("💖", event.messageID, () => {}, true);
    }
  },

  downLoad: function (url, api, event) {
    const time = Date.now();
    const path = __dirname + `/cache/${time}.mp4`;

    if (url.includes("instagram")) {
      this.downloadInstagram(url, api, event, path);
    } else if (url.includes("facebook") || url.includes("fb.watch")) {
      this.downloadFacebook(url, api, event, path);
    } else if (url.includes("tiktok")) {
      this.downloadTikTok(url, api, event, path);
    } else if (url.includes("x.com")) {
      this.downloadTwitter(url, api, event, path);
    } else if (url.includes("pin.it")) {
      this.downloadPinterest(url, api, event, path);
    } else if (url.includes("youtu")) {
      this.downloadYouTube(url, api, event, path);
    }
  },

  sendCuteMessage: async function (api, event, shortUrl, path) {
    const messageBody = `╔══🎀 𝓒𝓾𝓽𝓮 𝓥𝓲𝓭𝓮𝓸 𝓓𝓸𝔀𝓷𝓵𝓸𝓪𝓭 🎀══╗
 💕 From: N I R O B 💕
╚════════════════════════╝

📎 𝓛𝓲𝓷𝓴: ${shortUrl}
🎬 𝓔𝓷𝓳𝓸𝔂 𝓽𝓱𝓮 𝓿𝓲𝓫𝓮𝓼~ ✨`;

    api.sendMessage({
      body: messageBody,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);
  },

  downloadInstagram: async function (url, api, event, path) {
    try {
      const res = await this.getLink(url, api, event, path);
      const response = await axios.get(res, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25)
        return api.sendMessage("⚠️ File too large to send!", event.threadID, () => fs.unlinkSync(path), event.messageID);

      const shortUrl = await shortenURL(res);
      this.sendCuteMessage(api, event, shortUrl, path);
    } catch (err) {
      console.error(err);
    }
  },

  downloadFacebook: async function (url, api, event, path) {
    try {
      const res = await fbDownloader(url);
      if (res.success && res.download?.length > 0) {
        const videoUrl = res.download[0].url;
        const response = await axios.get(videoUrl, { responseType: "stream" });

        if (response.headers['content-length'] > 87031808)
          return api.sendMessage("⚠️ File too large to send!", event.threadID, () => fs.unlinkSync(path), event.messageID);

        response.data.pipe(fs.createWriteStream(path));
        response.data.on('end', async () => {
          const shortUrl = await shortenURL(videoUrl);
          this.sendCuteMessage(api, event, shortUrl, path);
        });
      }
    } catch (err) {
      console.error(err);
    }
  },

  downloadTikTok: async function (url, api, event, path) {
    try {
      const res = await this.getLink(url, api, event, path);
      const response = await axios.get(res, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25)
        return api.sendMessage("⚠️ File too large to send!", event.threadID, () => fs.unlinkSync(path), event.messageID);

      const shortUrl = await shortenURL(res);
      this.sendCuteMessage(api, event, shortUrl, path);
    } catch (err) {
      console.error(err);
    }
  },

  downloadTwitter: async function (url, api, event, path) {
    try {
      const res = await axios.get(`https://xdl-twitter.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data.url;
      const response = await axios.get(videoUrl, { responseType: "stream" });

      if (response.headers['content-length'] > 87031808)
        return api.sendMessage("⚠️ File too large to send!", event.threadID, () => fs.unlinkSync(path), event.messageID);

      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        this.sendCuteMessage(api, event, shortUrl, path);
      });
    } catch (err) {
      console.error(err);
    }
  },

  downloadPinterest: async function (url, api, event, path) {
    try {
      const res = await axios.get(`https://pindl-pinterest.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data.url;
      const response = await axios.get(videoUrl, { responseType: "stream" });

      if (response.headers['content-length'] > 87031808)
        return api.sendMessage("⚠️ File too large to send!", event.threadID, () => fs.unlinkSync(path), event.messageID);

      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        this.sendCuteMessage(api, event, shortUrl, path);
      });
    } catch (err) {
      console.error(err);
    }
  },

  downloadYouTube: async function (url, api, event, path) {
    try {
      const res = await axios.get(`https://yt-downloader-eta.vercel.app/kshitiz?url=${encodeURIComponent(url)}`);
      const videoUrl = res.data['480p'];
      const response = await axios.get(videoUrl, { responseType: "stream" });

      if (response.headers['content-length'] > 87031808)
        return api.sendMessage("⚠️ File too large to send!", event.threadID, () => fs.unlinkSync(path), event.messageID);

      response.data.pipe(fs.createWriteStream(path));
      response.data.on('end', async () => {
        const shortUrl = await shortenURL(videoUrl);
        this.sendCuteMessage(api, event, shortUrl, path);
      });
    } catch (err) {
      console.error(err);
    }
  },

  getLink: function (url, api, event, path) {
    return new Promise((resolve, reject) => {
      if (url.includes("instagram")) {
        axios.get(`https://insta-downloader-ten.vercel.app/insta?url=${encodeURIComponent(url)}`)
        .then(res => res.data.url ? resolve(res.data.url) : reject("Invalid Instagram response"))
        .catch(reject);
      } else if (url.includes("facebook") || url.includes("fb.watch")) {
        fbDownloader(url).then(res => {
          res.success && res.download?.length > 0
            ? resolve(res.download[0].url)
            : reject("Invalid Facebook response");
        }).catch(reject);
      } else if (url.includes("tiktok")) {
        this.queryTikTok(url).then(res => resolve(res.downloadUrls)).catch(reject);
      } else {
        reject("Unsupported platform.");
      }
    });
  },

  queryTikTok: async function (url) {
    try {
      const res = await axios.get("https://ssstik.io/en");
      const s_tt = res.data.split('s_tt = ')[1].split(',')[0];
      const result = await axios.post("https://ssstik.io/abc?url=dl", qs.stringify({
        id: url,
        locale: 'en',
        tt: s_tt
      }), {
        headers: {
          "user-agent": "Mozilla/5.0"
        }
      });

      const $ = cheerio.load(result.data);
      const slide = $(".slide");
      if (slide.length) {
        const urls = [];
        slide.each((_, el) => urls.push($(el).attr('href')));
        return { downloadUrls: urls[0] };
      }

      return { downloadUrls: $('.result_overlay_buttons > a').first().attr('href') };
    } catch (err) {
      console.error("TikTok error:", err);
      throw new Error("TikTok download failed");
    }
  },

  checkLink: function (url) {
    const patterns = [
      "instagram", "facebook", "fb.watch", "tiktok", "x.com", "pin.it", "youtu"
    ];
    return patterns.some(p => url.includes(p)) ? { url } : null;
  }
};

async function fbDownloader(url) {
  try {
    const response = await axios.post('https://snapsave.app/action.php?lang=vn', { url }, {
      headers: {
        "content-type": "multipart/form-data"
      }
    });

    let html;
    const evalCode = response.data.replace('return decodeURIComponent', 'html = decodeURIComponent');
    eval(evalCode);
    html = html.split('innerHTML = "')[1].split('";\n')[0].replace(/\\"/g, '"');

    const $ = cheerio.load(html);
    const download = [];

    $('table tbody tr').each((_, tr) => {
      const tds = $(tr).children();
      const quality = $(tds[0]).text().trim();
      const url = $(tds[2]).find('a').attr('href');
      if (url) download.push({ quality, url });
    });

    return { success: true, download };
  } catch (err) {
    console.error("FB Downloader error:", err);
    return { success: false };
  }
    }
