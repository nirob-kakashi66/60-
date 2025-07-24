module.exports = {
  config: {
    name: "catbox",
    version: "1.5",
    author: "Nirob",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Upload media to Catbox"
    },
    longDescription: {
      en: "Reply to an image (JPG/PNG) or video (MP4) and get a Catbox direct link"
    },
    category: "tools",
    guide: {
      en:
        "┌──⭓ CATBOX Uploader v1.5\n" +
        "│\n" +
        "│ 📂 Description:\n" +
        "│ Reply to a JPG/PNG image or MP4 video\n" +
        "│ to upload and get a Catbox direct link.\n" +
        "│\n" +
        "│ 👨‍💻 Author: Nirob\n" +
        "│ ⚙️ Version: 1.5\n" +
        "│ 🧾 Usage: {pn} (reply to media)\n" +
        "│ 🧑‍🔧 Role: 0 (All users)\n" +
        "└─────────────────────⭓"
    }
  },

  onStart: async function ({ api, event }) {
    const axios = require("axios");
    const fs = require("fs");
    const path = require("path");
    const FormData = require("form-data");

    const reply = event.messageReply;
    if (!reply || !reply.attachments || reply.attachments.length === 0) {
      return api.sendMessage("❌ Please reply to a JPG/PNG image or MP4 video.", event.threadID, event.messageID);
    }

    const attachment = reply.attachments[0];
    const url = attachment.url;
    const type = attachment.type;

    const extMatch = url.match(/\.(jpg|jpeg|png|mp4)(\?.*)?$/i);
    const ext = extMatch ? `.${extMatch[1].toLowerCase()}` : (type === "photo" ? ".jpg" : type === "video" ? ".mp4" : "");

    if (![".jpg", ".jpeg", ".png", ".mp4"].includes(ext)) {
      return api.sendMessage("❌ Only JPG, PNG, or MP4 files are supported.", event.threadID, event.messageID);
    }

    const fileName = `${Date.now()}${ext}`;
    const filePath = path.join(__dirname, "cache", fileName);

    try {
      const writer = fs.createWriteStream(filePath);
      const response = await axios.get(url, { responseType: "stream" });
      response.data.pipe(writer);

      writer.on("finish", async () => {
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(filePath));

        try {
          const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders()
          });

          fs.unlinkSync(filePath);
          const finalLink = uploadRes.data.trim();

          api.sendMessage({
            body:
              "╭──⭓ Catbox Upload Complete\n" +
              "│\n" +
              `│ ✅ File Type: ${ext.replace(".", "").toUpperCase()}\n` +
              `│ 🔗 Link: ${finalLink}\n` +
              "│\n" +
              "│ 🗂️ Uploaded via Nirob's Uploader\n" +
              "╰────────────────────────────⭓"
          }, event.threadID, event.messageID);

        } catch (err) {
          fs.unlinkSync(filePath);
          api.sendMessage("❌ Failed to upload to Catbox.", event.threadID, event.messageID);
        }
      });

      writer.on("error", () => {
        api.sendMessage("❌ Couldn't save the file.", event.threadID, event.messageID);
      });

    } catch (err) {
      api.sendMessage("❌ Error while downloading the file.", event.threadID, event.messageID);
    }
  }
};
