config = require('./config');
ordinals = require('./ordinals');

async function SendAnnouncement(client, message, level) {
  const channel = await client.channels.fetch(config.ANNOUNCEMENT_CHANNEL_ID);
  const user = message.author;

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
  const day = ordinals.Ordinal(today.getDate());

  const msg = `On the ${today.getDate() + day} day of ${month}, ${adj} ${user} said:
    *"${message.content}"* ${message.attachments.size ? message.attachments.first().url : ""}
    and reached **level ${level}**!`.replace(/\s*\n\s*/g, " ");

  await channel.send(msg);
}

module.exports = {
  SendAnnouncement
}