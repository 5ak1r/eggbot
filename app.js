const { Client, IntentsBitField, Partials } = require("discord.js");
const mongoose = require("mongoose");
const Egg = require("./models/egg");
const Fool = require("./models/fool");
const Level = require("./models/level");
const app = express();

const config = require("./utils/config");
const { SendAnnouncement } = require("./utils/announcement");
const { GetLeaderboard } = require("./commands/leaderboard");

const voiceTimes = new Map();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("successfully connected to DB");
  })
  .catch((error) => {
    console.log("error connecting to DB", error);
  });

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed.");
  process.exit(0);
});

console.log("🥚 Welcome to Eggbot v0.1.6!");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
  ],
});

client.once("clientReady", () => {
  console.log(`successfully logged in as ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  const roles = config.ROLE_LIST;
  const chosen = roles[Math.floor(Math.random() * roles.length)];

  const role = member.guild.roles.cache.get(chosen);

  if (chosen) {
    await member.roles.add(role);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content.toLowerCase().includes("hope")) {
    await message.reply({
      content: "6/6/19 Never Forget 🦝",
      allowedMentions: { parse: [] }
    });
  }

  if (message.content.toLowerCase() === 'f') {
    await message.reply({
      content: "is for <a:FurretWalk:750197791459901492>",
      allowedMentions: { parse: [] }
    });
  }
})

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.member.voice.channelId && !message.member.voice.selfMute) return;

  if (config.NO_EXP_CHANNEL_ID_LIST.includes(message.channelId)) return;

  messageServer = message.guild.id;
  messageUser = message.author.id;

  let user = await Level.findOne({
    server: messageServer,
    user: messageUser
  });

  if (!user) {
    user = new Level({
      server: messageServer,
      user: messageUser
    });
  }

  const cooldown = 60000;
  const now = Date.now();

  if (now - user.last < cooldown) return;

  const addXP = Math.floor(Math.random() * 15) + 10;
  user.xp += addXP;
  user.last = now;

  // https://github.com/Mee6/Mee6-documentation/blob/master/docs/levels_xp.md
  const neededXP = 5 * (user.level ** 2) + 50 * user.level + 100;
  if (user.xp > neededXP) {
    user.level += 1;
    user.xp -= neededXP;

    message.channel.send(`Happy Birthday ${message.author}! You just reached **level ${user.level}** ! 🎉🎊🎉`);
    await SendAnnouncement(client, message, user.level);
  }

  await user.save();
})

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  if (message.content === "!leaderboard") {
    let leaderboard = await GetLeaderboard(message);
    message.channel.send(leaderboard);
  }
})

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  const triggers = ["egg", "🥚", "🪺", "🍆"];

  if (triggers.some((word) => message.content.toLowerCase().includes(word))) {
    try {
      const updatedEgg = await Egg.findOneAndUpdate(
        { server: message.guild.id },
        {
          $inc: { count: 1 },
          $setOnInsert: {
            server: message.guild.id,
          },
        },
        {
          new: true,
          upsert: true,
        },
      );

      await message.reply({
        content: `Egg counter increased! Total: ${updatedEgg.count}`,
        allowedMentions: { parse: [] }
      });
    } catch (error) {
      console.log("Error updating", error);
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const today = new Date();
  if (today.getDate() !== 1 || today.getMonth() !== 3) return;

  const aprilFoolsTriggers = ["the", "of", "in", "and", "john"];
  let updates = {};
  let needUpdate = false;

  for (const word of aprilFoolsTriggers) {
    if (message.content.toLowerCase().includes(word)) {
      updates[`counts.${word}`] = 1;
      needUpdate = true;
    }
  }

  if (!needUpdate) return;

  try {
    const updatedFools = await Fool.findOneAndUpdate(
      { server: message.guild.id },
      {
        $inc: updates,
        $setOnInsert: { server: message.guild.id }
      },
      { new: true, upsert: true }
    );

    for (const [key, value] of Object.entries(updates)) {
      if (value > 0) {
        const word = key.replace(/^counts\./, "");
        const titleWord = word.charAt(0).toUpperCase() + word.slice(1);

        await message.reply({
          content: `${titleWord} counter increased! Total: ${updatedFools.counts.get(word)}`,
          allowedMentions: { parse: [] }
        });
      }
    }
  } catch (error) {
    console.log("Error updating", error);
  }
});

client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.emoji.name !== "💙") return;

    const special = await reaction.message.guild.members.fetch(config.USER_ID);

    let channel;
    if (user.id !== config.USER_ID) {
      channel = await client.channels.fetch(config.BOT_CHANNEL_ID);

      await channel.send(`Sorry ${user}, only ${special.displayName} can grant blue hearts to users`);
      await reaction.users.remove(user.id);
      return;
    }

    channel = await client.channels.fetch(config.HEART_CHANNEL_ID);

    const author = await reaction.message.guild.members.fetch(reaction.message.author.id);
    const msg = `${author} achieved a Blue Heart for the following message: ${reaction.message.url}
      ${reaction.message.attachments.size ? reaction.message.attachments.first().url : ``}`.replace(/\s*\n\s*/g, " ");
    await channel.send(msg);
  }

  catch (error) {
    if (error.code === 10007) {
      const msg = `Unknown Member achieved a Blue Heart for the following message: ${reaction.message.url}
        ${reaction.message.attachments.size ? reaction.message.attachments.first().url : ``}`.replace(/\s*\n\s*/g, " ");

      const channel = await client.channels.fetch(config.HEART_CHANNEL_ID);

      await channel.send(msg);
      return;
    }

    console.error(error);
  }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const channelServer = oldState.guild.id;

  const getUsers = (channel) => {
    if (!channel) return [];
    return channel.members.filter(m => !m.user.bot);
  }

  const isActive = (state) => {
    return !(
      state.selfMute ||
      state.serverMute ||
      state.selfDeaf ||
      state.serverDeaf
    );
  };

  const updateUserXP = async (id) => {
    const joined = voiceTimes.get(id);
    if (!joined) return;

    const minutes = (Date.now() - joined) / 60000;

    let user = await Level.findOne({
      server: channelServer,
      user: id
    });

    if (!user) {
      user = new Level({
        server: channelServer,
        user: id
      });
    }

    let xpToGain = Math.floor((10 + Math.random() * 10) * minutes);

    const neededXP = 5 * (user.level ** 2) + 50 * user.level + 100;
    if (user.xp + xpToGain < neededXP * 0.7) user.xp += xpToGain;

    await user.save();
  };

  const handleLeave = async (state) => {
    if (!state.channel) return;

    const users = getUsers(state.channel);
    const size = users.size;

    await updateUserXP(state.id);

    if (size === 1) {
      const lastUserId = users.first().id;
      await updateUserXP(lastUserId);
    }
  };

  const handleJoin = (state) => {
    const users = getUsers(state.channel);
    const size = users.size;

    if (size < 2) return;

    if (size === 2) {
      users.forEach(member => {
        voiceTimes.set(member.id, Date.now());
      });
    } else {
      voiceTimes.set(state.id, Date.now());
    }
  };

  if (oldState.channelId) await handleLeave(oldState);
  if (newState.channelId) handleJoin(newState);

  // cannot gain xp if muted or deafened
  const wasActive = isActive(oldState);
  const nowActive = isActive(newState);

  // temporary treat them as leaving
  if (wasActive && !nowActive) await handleLeave(oldState);
  if (nowActive && !wasActive) handleJoin(newState);
});

app.get("/health", (req, res) => {
  const mongoHealth = mongoose.connection.readyState === 1;
  const discordHealth = client.isReady();

  if (mongoHealth && discordHealth) {
    return res.status(200).json({
      status: "healthy"
    });
  }

  return res.status(503).json({
    status: "unhealthy",
    mongo: mongoHealth,
    discord: discordHealth
  });
});

app.listen(3000, () => {
  console.log("Health server live on port 3000");
})

client
  .login(config.TOKEN)
  .catch((error) => console.error("failed to log in:", error));
