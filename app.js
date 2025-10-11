const {Client, IntentsBitField} = require('discord.js')
const mongoose = require('mongoose')
const Egg = require('./models/egg')

const config = require('./utils/config')

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('successfully connected to DB')
  })
  .catch(error => {
    console.log('error connecting to DB', error)
  })

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('🔌 MongoDB connection closed.')
  process.exit(0)
})

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
})

client.once('ready', () => {
  console.log(`successfully logged in as ${client.user.tag}`)
})

client.on('messageCreate', async (message) => {
  if(message.author.bot) return

  if(message.content.toLowerCase().includes('egg')) {
    try {
      const updatedEgg = await Egg.findOneAndUpdate(
        {},
        {$inc: {count: 1}},
        {new: true, upsert: true}
      )

      await message.reply(`Egg counter increased! Total: ${updatedEgg.count}`)

    } catch (error) {
      console.log('Error updating', error)
    }
  }
})

client
  .login(config.TOKEN)
  .catch(error => console.error('failed to log in:', error))