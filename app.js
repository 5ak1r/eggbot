const { Client, IntentsBitField, Partials } = require("discord.js");
const mongoose = require("mongoose");
const Egg = require("./models/egg");

const config = require("./utils/config");
const ordinals = require("./utils/ordinals");

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

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
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
  console.log('add role started');

  const roles = config.ROLE_LIST;
  const chosen = roles[Math.floor(Math.random() * roles.length)];

  const role = member.guild.roles.cache.get(chosen);

  if (chosen) {
    await member.roles.add(role);
  }
});

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

      await message.reply(`Egg counter increased! Total: ${updatedEgg.count}`);
    } catch (error) {
      console.log("Error updating", error);
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.id != config.LEVEL_UP_BOT_ID) return;

  if (message.content.includes('level')) {
    const channel = await client.channels.fetch(config.ANNOUNCEMENT_CHANNEL_ID);
    const user = message.mentions.users.first();

    const right = message.content.indexOf('level') + 5;
    const left = message.content.indexOf('** !');
    let level = message.content.substring(right, left).trim();
    level = parseInt(level);

    const messages = await message.channel.messages.fetch({ limit: 100 });
    const last = messages.find(m => m.author.id === user.id);

    let adj;
    if (user.id == config.LEADER_ID) {
      adj = "that guy";
    } else {
      const adjs = ["the brand new", "the young", "the educated", "the wise", "the exceptional", "the unstoppable"];

      const thresholds = [5, 15, 25, 35, 49];
      const idx = thresholds.findIndex(x => level < x);
      adj = adjs[idx === -1 ? adjs.length - 1 : idx];
    }

    const today = new Date();
    const month = today.toLocaleString('default', { month: 'long' });
    const day = ordinals.ordinal(today.getDate());

    try {
      await channel.send(
        `On the ${today.getDate() + day} day of ${month}, ${adj} ${user} said: *"${last.content}"*
        ${last.attachments.size ? last.attachments.first().url : ""} and reached **level ${level}**!`
      );
    } catch (error) {
      console.log("failed to send: ", err);
    }
  }
})

client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.emoji.name !== "💙") return;
    if (user.id == config.USER_ID) return;

    const special = await reaction.message.guild.members.fetch(config.USER_ID);
    const channel = await client.channels.fetch(config.BOT_CHANNEL_ID);

    await channel.send(`Sorry ${user}, only ${special.displayName} can grant blue hearts to users`);
    await reaction.users.remove(user.id);
  }

  catch (error) {
    console.error(error);
  }
});

client
  .login(config.TOKEN)
  .catch((error) => console.error("failed to log in:", error));
