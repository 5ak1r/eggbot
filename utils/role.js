const { LEVEL_ROLE_LIST } = require('./config');

const levelRoles = {
  5: LEVEL_ROLE_LIST[0],
  15: LEVEL_ROLE_LIST[1],
  25: LEVEL_ROLE_LIST[2],
  35: LEVEL_ROLE_LIST[3],
  50: LEVEL_ROLE_LIST[4],
};

async function AssignRole(message, level) {
  const newRole = levelRoles[level];

  if (!newRole) return;

  await message.member.roles.add(newRole);
}

module.exports = {
  AssignRole
}