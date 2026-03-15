const Level = require('../models/level');

async function GetLeaderboard(message) {
  const users = await Level.find({
    server: message.guild.id
  })
    .sort({ level: -1, xp: -1 });

  const max = 20;

  if (!users.length) {
    return "No leaderboard data yet.";
  }

  let leaderboard = "```md\n";
  let successes = 1;

  for (let i = 0; i < users.length; i++) {
    let member = message.guild.members.cache.get(users[i].user);

    if (!member) {
      try {
        member = await message.guild.members.fetch(users[i].user);
      } catch {
        member = null;
      }
    }

    if (!member) continue;

    const stripEmojis = (str) => str.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
    const name = stripEmojis(member.displayName);

    const rank = `${successes}`.padStart(2, "0");
    const paddedName = name.padEnd(30, " ");
    const level = `${users[i].level}`.padStart(3, " ");
    const xp = `${users[i].xp}`.padStart(6, " ");

    leaderboard += `${rank}. ${paddedName} | Level ${level} | ${xp} XP\n`;

    if (successes === max) break;
    successes++;
  }

  leaderboard += "```";
  return leaderboard;
}

module.exports = {
  GetLeaderboard
}