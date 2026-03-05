require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const APPLICATION_ID = process.env.APPLICATION_ID
const PUBLIC_KEY = process.env.PUBLIC_KEY
const TOKEN = process.env.TOKEN
const USER_ID = process.env.USER_ID
const CHANNEL_ID = process.env.CHANNEL_ID

module.exports = {
  MONGODB_URI,
  APPLICATION_ID,
  PUBLIC_KEY,
  TOKEN,
  USER_ID,
  CHANNEL_ID
}