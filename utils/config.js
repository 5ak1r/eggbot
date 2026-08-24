require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI
const APPLICATION_ID = process.env.APPLICATION_ID
const PUBLIC_KEY = process.env.PUBLIC_KEY
const TOKEN = process.env.TOKEN
const USER_ID = process.env.USER_ID
const LEADER_ID = process.env.LEADER_ID
const BOT_CHANNEL_ID = process.env.BOT_CHANNEL_ID
const ANNOUNCEMENT_CHANNEL_ID = process.env.ANNOUNCEMENT_CHANNEL_ID
const HEART_CHANNEL_ID = process.env.HEART_CHANNEL_ID
const NO_EXP_CHANNEL_ID_LIST=process.env.NO_EXP_CHANNEL_ID_LIST
const ROLE_LIST = process.env.ROLE_LIST.split(',');
const LEVEL_LIST = process.env.LEVEL_LIST.split(',');
const LEVEL_ROLE_LIST = process.env.LEVEL_ROLE_LIST.split(',');
const EVIL_BLUE_NAME = process.env.EVIL_BLUE_NAME
const MUTE_GANG_ROLE = process.env.MUTE_GANG_ROLE

module.exports = {
  MONGODB_URI,
  APPLICATION_ID,
  PUBLIC_KEY,
  TOKEN,
  USER_ID,
  LEADER_ID,
  BOT_CHANNEL_ID,
  ANNOUNCEMENT_CHANNEL_ID,
  HEART_CHANNEL_ID,
  NO_EXP_CHANNEL_ID_LIST,
  ROLE_LIST,
  LEVEL_LIST,
  LEVEL_ROLE_LIST,
  EVIL_BLUE_NAME,
  MUTE_GANG_ROLE
}