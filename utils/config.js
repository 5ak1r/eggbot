require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const APPLICATION_ID = process.env.APPLICATION_ID
const PUBLIC_KEY = process.env.PUBLIC_KEY
const TOKEN = process.env.TOKEN

module.exports = {
  PORT,
  MONGODB_URI,
  APPLICATION_ID,
  PUBLIC_KEY,
  TOKEN
}