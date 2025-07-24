module.exports = {
  config: {
    name: "animetrivia",
    aliases: ["atrivia", "animequiz"],
    version: "1.0",
    author: "NIROB",
    countDown: 10,
    role: 0,
    description: "Answer anime trivia questions and earn coins!",
    category: "games",
    guide: "{pn}"
  },

  onStart: async function ({ api, event, usersData }) {
    const { threadID, messageID, senderID } = event;
    const user = await usersData.get(senderID);

    const questions = [
      {
        question: "Who is the main character of *Death Note*?",
        options: ["L", "Light Yagami", "Near", "Mikami"],
        answer: 1
      },
      {
        question: "What is Naruto's last name?",
        options: ["Uzumaki", "Uchiha", "Hatake", "Senju"],
        answer: 0
      },
      {
        question: "In *Attack on Titan*, who is the Colossal Titan?",
        options: ["Eren", "Bertholdt", "Reiner", "Zeke"],
        answer: 1
      },
      {
        question: "Who is the captain of the Straw Hat Pirates?",
        options: ["Zoro", "Luffy", "Sanji", "Nami"],
        answer: 1
      },
      {
        question: "What is the name of the organization in *Naruto*?",
        options: ["Akatsuki", "Gotei 13", "Phantom Troupe", "Homunculus"],
        answer: 0
      },
      {
        question: "In *Bleach*, who wields the sword Zangetsu?",
        options: ["Ichigo Kurosaki", "Byakuya Kuchiki", "Urahara", "Toshiro Hitsugaya"],
        answer: 0
      },
      {
        question: "Which anime features alchemy as a central power?",
        options: ["Fullmetal Alchemist", "Fairy Tail", "Hunter x Hunter", "Demon Slayer"],
        answer: 0
      },
      {
        question: "Who killed Ace in *One Piece*?",
        options: ["Kaido", "Blackbeard", "Akainu", "Whitebeard"],
        answer: 2
      },
      {
        question: "Which anime has ghouls living among humans?",
        options: ["Bleach", "Tokyo Ghoul", "Hellsing", "Berserk"],
        answer: 1
      },
      {
        question: "Who is the Flame Alchemist in *FMA*?",
        options: ["Edward", "Roy Mustang", "Alphonse", "Envy"],
        answer: 1
      },
      {
        question: "What village is Naruto from?",
        options: ["Sunagakure", "Amegakure", "Konoha", "Iwagakure"],
        answer: 2
      },
      {
        question: "In *Jujutsu Kaisen*, who has a pact with Sukuna?",
        options: ["Megumi", "Gojo", "Itadori", "Nanami"],
        answer: 2
      },
      {
        question: "Who is the strongest Espada in *Bleach*?",
        options: ["Ulquiorra", "Stark", "Grimmjow", "Nnoitra"],
        answer: 1
      },
      {
        question: "Which anime features 'Nen' as a power system?",
        options: ["One Piece", "Black Clover", "Hunter x Hunter", "Bleach"],
        answer: 2
      },
      {
        question: "What is the name of Light's Shinigami?",
        options: ["Ryuk", "Rem", "Zaraki", "Lucifer"],
        answer: 0
      },
      {
        question: "Who is the main villain in *Demon Slayer*?",
        options: ["Akaza", "Doma", "Muzan Kibutsuji", "Rui"],
        answer: 2
      },
      {
        question: "What is Levi's squad known for?",
        options: ["Explosives", "Cavalry", "Titan slaying", "Science"],
        answer: 2
      },
      {
        question: "In *One Punch Man*, what's Saitama's rank?",
        options: ["A-Class", "S-Class", "C-Class", "B-Class"],
        answer: 2
      },
      {
        question: "Which anime features the phrase 'Plus Ultra'?",
        options: ["Naruto", "Bleach", "My Hero Academia", "Black Clover"],
        answer: 2
      },
      {
        question: "What is Gojo's domain expansion called?",
        options: ["Purple Storm", "Six Eyes", "Unlimited Void", "Domain Slash"],
        answer: 2
      },
      {
        question: "Who is known as the Dragon Slayer in *Fairy Tail*?",
        options: ["Laxus", "Gray", "Natsu", "Gajeel"],
        answer: 2
      },
      {
        question: "What is Eren Yeager's Titan called?",
        options: ["Colossal Titan", "Beast Titan", "Founding Titan", "Attack Titan"],
        answer: 3
      },
      {
        question: "In *Sword Art Online*, who is Kirito's love interest?",
        options: ["Sinon", "Asuna", "Yui", "Leafa"],
        answer: 1
      },
      {
        question: "Who says 'Dattebayo'?",
        options: ["Sasuke", "Naruto", "Kakashi", "Boruto"],
        answer: 1
      },
      {
        question: "Which anime character loves pudding?",
        options: ["Luffy", "Goku", "Gintoki", "Gohan"],
        answer: 1
      }
    ];

    const random = questions[Math.floor(Math.random() * questions.length)];

    let text = `🧠 Anime Trivia Time!\n\n❓ ${random.question}\n`;
    random.options.forEach((opt, index) => {
      text += `${index + 1}. ${opt}\n`;
    });
    text += "\n👉 Reply with the correct option number (1-4).";

    api.sendMessage(text, threadID, async (err, info) => {
      if (err) return;
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "animetrivia",
        messageID: info.messageID,
        author: senderID,
        correct: random.answer,
        options: random.options,
        user
      });
    }, messageID);
  },

  onReply: async function ({ api, event, Reply, usersData }) {
    const { senderID, messageID, body, threadID } = event;
    if (senderID !== Reply.author) return;

    const userAnswer = parseInt(body) - 1;
    if (isNaN(userAnswer) || userAnswer < 0 || userAnswer > 3)
      return api.sendMessage("❌ Please reply with a number between 1 and 4!", threadID, messageID);

    let replyText = "";
    if (userAnswer === Reply.correct) {
      await usersData.set(senderID, { money: Reply.user.money + 5000000 });
      replyText = `✅ Correct! You earned $5M\n🎉 Answer: ${Reply.options[Reply.correct]}`;
    } else {
      await usersData.set(senderID, { money: Reply.user.money - 2000000 });
      replyText = `❌ Wrong! You lost $2M\n✅ Correct answer: ${Reply.options[Reply.correct]}`;
    }

    api.sendMessage(replyText, threadID, messageID);
  }
};
