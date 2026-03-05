const { Client, IntentsBitField, Partials } = require("discord.js");
const mongoose = require("mongoose");
const Egg = require("./models/egg");

const config = require("./utils/config");

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

client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();

    if (reaction.emoji.name !== "💙") return;
    if (user.id == config.USER_ID) return;

    const special = await reaction.message.guild.members.fetch(config.USER_ID);
    const channel = await client.channels.fetch(config.CHANNEL_ID);

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
